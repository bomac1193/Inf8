/**
 * o8 Provenance API Routes
 *
 * API endpoints for provenance stamping and verification
 */

import {
  ProvenanceService,
  createProvenanceService,
  StampResult,
  VerificationResult,
} from '../provenance/index.js';
import { IdentityService, IdentityStore } from './identity.js';

// ============================================================================
// TYPES
// ============================================================================

export interface ProvenanceAPIConfig {
  identityStore: IdentityStore;
  ipfs?: {
    localNodeUrl?: string;
    pinataApiKey?: string;
    pinataSecretKey?: string;
    web3StorageToken?: string;
  };
}

export interface RouteHandler {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: (req: {
    params: Record<string, string>;
    body: unknown;
    query: Record<string, string>;
  }) => Promise<{ status: number; body: unknown }>;
}

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

export function createProvenanceRouteHandlers(config: ProvenanceAPIConfig): RouteHandler[] {
  const provenance = createProvenanceService({ ipfs: config.ipfs });
  const identityService = new IdentityService({ store: config.identityStore });

  return [
    // POST /api/provenance/health - Check service health
    {
      method: 'GET',
      path: '/api/provenance/health',
      handler: async () => {
        const health = await provenance.checkHealth();
        return {
          status: 200,
          body: health,
        };
      },
    },

    // POST /api/provenance/stamp - Stamp content with provenance
    {
      method: 'POST',
      path: '/api/provenance/stamp',
      handler: async (req) => {
        const {
          identity_id,
          content_type,
          content_fingerprint,
          title,
          ai_contribution,
          ai_model,
          metadata,
        } = req.body as {
          identity_id: string;
          content_type: 'audio' | 'visual' | 'video' | 'text';
          content_fingerprint: string;
          title?: string;
          ai_contribution?: number;
          ai_model?: { name: string; provider: string; version?: string };
          metadata?: Record<string, unknown>;
        };

        // Fetch identity
        const identity = await identityService.getIdentity({ identity_id });
        if (!identity) {
          return { status: 404, body: { error: 'Identity not found' } };
        }

        try {
          const result = await provenance.stampContent({
            identity,
            contentType: content_type,
            contentFingerprint: content_fingerprint,
            title,
            aiContribution: ai_contribution,
            aiModel: ai_model,
            metadata,
          });

          return { status: 201, body: result };
        } catch (error) {
          return {
            status: 500,
            body: { error: `Stamping failed: ${(error as Error).message}` },
          };
        }
      },
    },

    // POST /api/provenance/stamp-game-audio - Stamp game audio
    {
      method: 'POST',
      path: '/api/provenance/stamp-game-audio',
      handler: async (req) => {
        const {
          identity_id,
          audio_fingerprint,
          game_state,
          stem_mix,
          crossfade_ms,
          metadata,
        } = req.body as {
          identity_id: string;
          audio_fingerprint: string;
          game_state: string;
          stem_mix: Record<string, number>;
          crossfade_ms: number;
          metadata?: Record<string, unknown>;
        };

        // Fetch identity
        const identity = await identityService.getIdentity({ identity_id });
        if (!identity) {
          return { status: 404, body: { error: 'Identity not found' } };
        }

        try {
          const result = await provenance.stampGameAudio({
            identity,
            audioFingerprint: audio_fingerprint,
            gameState: game_state,
            stemMix: stem_mix,
            crossfadeMs: crossfade_ms,
            metadata,
          });

          return {
            status: 201,
            body: {
              declaration_cid: result.declaration_cid,
              manifest_cid: result.manifest_cid,
              gateway_urls: result.gateway_urls,
              timestamp: result.timestamp,
            },
          };
        } catch (error) {
          return {
            status: 500,
            body: { error: `Stamping failed: ${(error as Error).message}` },
          };
        }
      },
    },

    // POST /api/provenance/verify - Verify provenance
    {
      method: 'POST',
      path: '/api/provenance/verify',
      handler: async (req) => {
        const {
          declaration_cid,
          manifest_cid,
          content_fingerprint,
          identity_id,
        } = req.body as {
          declaration_cid?: string;
          manifest_cid?: string;
          content_fingerprint?: string;
          identity_id?: string;
        };

        try {
          const result = await provenance.verifyProvenance({
            declarationCid: declaration_cid,
            manifestCid: manifest_cid,
            contentFingerprint: content_fingerprint,
            identityId: identity_id,
          });

          return { status: 200, body: result };
        } catch (error) {
          return {
            status: 500,
            body: { error: `Verification failed: ${(error as Error).message}` },
          };
        }
      },
    },

    // GET /api/provenance/declaration/:cid - Fetch declaration
    {
      method: 'GET',
      path: '/api/provenance/declaration/:cid',
      handler: async (req) => {
        try {
          const declaration = await provenance.fetchDeclaration(req.params.cid);
          return { status: 200, body: declaration };
        } catch (error) {
          return {
            status: 404,
            body: { error: `Declaration not found: ${req.params.cid}` },
          };
        }
      },
    },

    // GET /api/provenance/manifest/:cid - Fetch C2PA manifest
    {
      method: 'GET',
      path: '/api/provenance/manifest/:cid',
      handler: async (req) => {
        try {
          const manifest = await provenance.fetchManifest(req.params.cid);
          return { status: 200, body: manifest };
        } catch (error) {
          return {
            status: 404,
            body: { error: `Manifest not found: ${req.params.cid}` },
          };
        }
      },
    },

    // POST /api/provenance/fingerprint - Generate content fingerprint
    {
      method: 'POST',
      path: '/api/provenance/fingerprint',
      handler: async (req) => {
        const { data } = req.body as { data: string }; // base64 encoded

        try {
          const bytes = Buffer.from(data, 'base64');
          const fingerprint = provenance.generateFingerprint(bytes);
          return {
            status: 200,
            body: { fingerprint, algorithm: 'sha256' },
          };
        } catch (error) {
          return {
            status: 400,
            body: { error: 'Invalid data format. Expected base64 encoded string.' },
          };
        }
      },
    },

    // POST /api/provenance/publish-identity - Publish identity to IPFS
    {
      method: 'POST',
      path: '/api/provenance/publish-identity',
      handler: async (req) => {
        const { identity_id } = req.body as { identity_id: string };

        // Fetch identity
        const identity = await identityService.getIdentity({ identity_id });
        if (!identity) {
          return { status: 404, body: { error: 'Identity not found' } };
        }

        try {
          const result = await provenance.publishIdentity(identity);

          // Update identity with CID
          await identityService.updateIdentity({
            identity_id,
            updates: {
              provenance: {
                ...identity.provenance,
                ipfs_cid: result.cid,
              },
            },
          });

          return {
            status: 201,
            body: {
              cid: result.cid,
              gateway_url: result.gatewayUrl,
            },
          };
        } catch (error) {
          return {
            status: 500,
            body: { error: `Publishing failed: ${(error as Error).message}` },
          };
        }
      },
    },
  ];
}

