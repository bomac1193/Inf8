/**
 * o8 Provenance Service
 *
 * Unified service that combines:
 * - IPFS storage for permanent content addressing
 * - C2PA manifests for content authenticity
 * - o8 identity integration
 *
 * This is the main entry point for provenance operations.
 */

import { createHash } from 'crypto';
import { CreatorIdentity, CreativeDeclaration, ProvenanceChain } from '../core/types.v2.js';
import { IPFSService, createIPFSService, IPFSServiceConfig, PublishResult } from './ipfs-service.js';
import { C2PAManifestGenerator, createManifestGenerator, C2PAManifest, ManifestGeneratorConfig } from './c2pa-manifest.js';

// ============================================================================
// TYPES
// ============================================================================

export interface ProvenanceServiceConfig {
  ipfs?: IPFSServiceConfig;
  c2pa?: ManifestGeneratorConfig;
}

export interface StampResult {
  /** IPFS CID of the declaration */
  declaration_cid: string;
  /** IPFS CID of the C2PA manifest */
  manifest_cid: string;
  /** Gateway URLs */
  gateway_urls: {
    declaration: string;
    manifest: string;
  };
  /** The stamped declaration */
  declaration: CreativeDeclaration;
  /** The C2PA manifest */
  manifest: C2PAManifest;
  /** Timestamp */
  timestamp: string;
}

export interface VerificationResult {
  /** Overall verification status */
  valid: boolean;
  /** Individual check results */
  checks: {
    /** Declaration exists on IPFS */
    declaration_exists: boolean;
    /** Manifest exists on IPFS */
    manifest_exists: boolean;
    /** Manifest signature is valid */
    signature_valid: boolean;
    /** Content hash matches */
    content_hash_valid: boolean;
    /** Identity CID matches (if specified) */
    identity_valid?: boolean;
  };
  /** Error messages */
  errors: string[];
  /** Declaration if found */
  declaration?: CreativeDeclaration;
  /** Manifest if found */
  manifest?: C2PAManifest;
}

// ============================================================================
// PROVENANCE SERVICE
// ============================================================================

export class ProvenanceService {
  private ipfs: IPFSService;
  private c2pa: C2PAManifestGenerator;

  constructor(config: ProvenanceServiceConfig = {}) {
    this.ipfs = createIPFSService(config.ipfs);
    this.c2pa = createManifestGenerator(config.c2pa);
  }

  /**
   * Check service health
   */
  async checkHealth(): Promise<{
    ipfs: { available: boolean; providers: { name: string; available: boolean }[] };
  }> {
    const ipfsStatus = await this.ipfs.checkHealth();
    return {
      ipfs: {
        available: ipfsStatus.some(s => s.available),
        providers: ipfsStatus.map(s => ({
          name: s.provider,
          available: s.available,
        })),
      },
    };
  }

  /**
   * Publish an identity to IPFS
   */
  async publishIdentity(identity: CreatorIdentity): Promise<{
    cid: string;
    gatewayUrl: string;
    identity: CreatorIdentity;
  }> {
    const result = await this.ipfs.publishIdentity(identity);

    // Update identity with provenance info
    const updatedIdentity: CreatorIdentity = {
      ...identity,
      provenance: {
        ...identity.provenance,
        ipfs_cid: result.cid,
      },
      updated_at: new Date().toISOString(),
    };

    return {
      cid: result.cid,
      gatewayUrl: result.gatewayUrl,
      identity: updatedIdentity,
    };
  }

  /**
   * Stamp content with full provenance
   *
   * This creates:
   * 1. A CreativeDeclaration linking content to identity
   * 2. A C2PA manifest with authenticity assertions
   * 3. Publishes both to IPFS
   */
  async stampContent(options: {
    /** o8 identity */
    identity: CreatorIdentity;
    /** Content type */
    contentType: 'audio' | 'visual' | 'video' | 'text';
    /** Content fingerprint (SHA-256 hash) */
    contentFingerprint: string;
    /** Content title */
    title?: string;
    /** AI contribution percentage (0-1) */
    aiContribution?: number;
    /** AI model info (if AI was used) */
    aiModel?: {
      name: string;
      provider: string;
      version?: string;
    };
    /** Additional metadata */
    metadata?: Record<string, unknown>;
    /** Game audio context (if applicable) */
    gameAudioContext?: {
      gameState: string;
      stemMix: Record<string, number>;
      crossfadeMs: number;
    };
  }): Promise<StampResult> {
    const now = new Date().toISOString();
    const declarationId = `decl-${this.generateId()}`;

    // 1. Create CreativeDeclaration
    const declaration: CreativeDeclaration = {
      declaration_id: declarationId,
      version: '2.0',
      created_at: now,
      updated_at: now,
      identity: options.identity,
      declaration_type: 'content_attribution',
      content: {
        type: options.contentType,
        fingerprint: options.contentFingerprint,
        metadata: options.metadata,
      },
      ai_contribution: options.aiModel ? {
        model: options.aiModel.name,
        provider: options.aiModel.provider,
        contribution_percentage: options.aiContribution || 0,
        generation_params: options.gameAudioContext,
      } : undefined,
    };

    // 2. Create C2PA Manifest
    let manifest: C2PAManifest;
    if (options.gameAudioContext) {
      manifest = this.c2pa.generateGameAudioManifest({
        contentHash: options.contentFingerprint,
        identity: options.identity,
        gameState: options.gameAudioContext.gameState,
        stemMix: options.gameAudioContext.stemMix,
        crossfadeMs: options.gameAudioContext.crossfadeMs,
      });
    } else {
      manifest = this.c2pa.generateManifest({
        contentHash: options.contentFingerprint,
        contentType: this.getMimeType(options.contentType),
        title: options.title,
        identity: options.identity,
        declaration,
        aiContribution: options.aiContribution,
      });
    }

    // 3. Publish declaration to IPFS
    const declResult = await this.ipfs.publishDeclaration(declaration);

    // 4. Publish manifest to IPFS
    const manifestJson = this.c2pa.exportJSON(manifest);
    const manifestResult = await this.ipfs.publishJSON(
      manifest,
      `${declarationId}.c2pa.json`
    );

    // 5. Update declaration with CIDs
    declaration.content!.metadata = {
      ...declaration.content?.metadata,
      declaration_cid: declResult.cid,
      manifest_cid: manifestResult.cid,
    };

    return {
      declaration_cid: declResult.cid,
      manifest_cid: manifestResult.cid,
      gateway_urls: {
        declaration: declResult.gatewayUrl,
        manifest: manifestResult.gatewayUrl,
      },
      declaration,
      manifest,
      timestamp: now,
    };
  }

  /**
   * Stamp game audio output with provenance
   */
  async stampGameAudio(options: {
    /** o8 identity */
    identity: CreatorIdentity;
    /** Audio fingerprint (SHA-256) */
    audioFingerprint: string;
    /** Game state that triggered this audio */
    gameState: string;
    /** Stem mix configuration */
    stemMix: Record<string, number>;
    /** Crossfade duration */
    crossfadeMs: number;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
  }): Promise<StampResult> {
    return this.stampContent({
      identity: options.identity,
      contentType: 'audio',
      contentFingerprint: options.audioFingerprint,
      title: `Game Audio - ${options.gameState}`,
      aiContribution: 0.3, // Adaptive mixing has AI component
      metadata: {
        ...options.metadata,
        game_state: options.gameState,
        stem_mix: options.stemMix,
        crossfade_ms: options.crossfadeMs,
      },
      gameAudioContext: {
        gameState: options.gameState,
        stemMix: options.stemMix,
        crossfadeMs: options.crossfadeMs,
      },
    });
  }

  /**
   * Verify content provenance
   */
  async verifyProvenance(options: {
    /** Declaration CID */
    declarationCid?: string;
    /** Manifest CID */
    manifestCid?: string;
    /** Expected content fingerprint */
    contentFingerprint?: string;
    /** Expected identity ID */
    identityId?: string;
  }): Promise<VerificationResult> {
    const errors: string[] = [];
    const checks = {
      declaration_exists: false,
      manifest_exists: false,
      signature_valid: false,
      content_hash_valid: false,
      identity_valid: undefined as boolean | undefined,
    };

    let declaration: CreativeDeclaration | undefined;
    let manifest: C2PAManifest | undefined;

    // Check declaration
    if (options.declarationCid) {
      try {
        declaration = await this.ipfs.fetchDeclaration(options.declarationCid);
        checks.declaration_exists = true;
      } catch (error) {
        errors.push(`Declaration not found: ${options.declarationCid}`);
      }
    }

    // Check manifest
    if (options.manifestCid) {
      try {
        manifest = await this.ipfs.fetchJSON<C2PAManifest>(options.manifestCid);
        checks.manifest_exists = true;

        // Verify signature
        checks.signature_valid = this.c2pa.verifyManifest(manifest);
        if (!checks.signature_valid) {
          errors.push('Manifest signature verification failed');
        }
      } catch (error) {
        errors.push(`Manifest not found: ${options.manifestCid}`);
      }
    }

    // Verify content fingerprint
    if (options.contentFingerprint && declaration) {
      checks.content_hash_valid = declaration.content?.fingerprint === options.contentFingerprint;
      if (!checks.content_hash_valid) {
        errors.push('Content fingerprint mismatch');
      }
    }

    // Verify identity
    if (options.identityId && declaration) {
      checks.identity_valid = declaration.identity.identity_id === options.identityId;
      if (!checks.identity_valid) {
        errors.push('Identity ID mismatch');
      }
    }

    return {
      valid: errors.length === 0 && (checks.declaration_exists || checks.manifest_exists),
      checks,
      errors,
      declaration,
      manifest,
    };
  }

  /**
   * Fetch a declaration by CID
   */
  async fetchDeclaration(cid: string): Promise<CreativeDeclaration> {
    return this.ipfs.fetchDeclaration(cid);
  }

  /**
   * Fetch an identity by CID
   */
  async fetchIdentity(cid: string): Promise<CreatorIdentity> {
    return this.ipfs.fetchIdentity(cid);
  }

  /**
   * Fetch a C2PA manifest by CID
   */
  async fetchManifest(cid: string): Promise<C2PAManifest> {
    return this.ipfs.fetchJSON<C2PAManifest>(cid);
  }

  /**
   * Generate a content fingerprint from data
   */
  generateFingerprint(data: Uint8Array): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate fingerprint from a file (Node.js)
   */
  async generateFileFingerprint(filePath: string): Promise<string> {
    const { readFile } = await import('fs/promises');
    const data = await readFile(filePath);
    return this.generateFingerprint(data);
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}`;
  }

  private getMimeType(contentType: 'audio' | 'visual' | 'video' | 'text'): string {
    switch (contentType) {
      case 'audio':
        return 'audio/mpeg';
      case 'visual':
        return 'image/png';
      case 'video':
        return 'video/mp4';
      case 'text':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export function createProvenanceService(config?: ProvenanceServiceConfig): ProvenanceService {
  return new ProvenanceService(config);
}

let serviceInstance: ProvenanceService | null = null;

export function getProvenanceService(config?: ProvenanceServiceConfig): ProvenanceService {
  if (!serviceInstance) {
    serviceInstance = new ProvenanceService(config);
  }
  return serviceInstance;
}
