/**
 * o8 Unified Identity API
 *
 * Single API surface for creating, retrieving, and managing CreatorIdentity.
 * Aggregates DNA from:
 * - BOVEDA (genome, narrative, movement)
 * - STARFORGE (audio DNA)
 * - CLAROSA (visual DNA)
 * - CHROMOX (voice DNA)
 */

import { createHash } from 'crypto';
import {
  CreatorIdentity,
  CreatorInfo,
  CreativeDNA,
  AudioDNA,
  VisualDNA,
  VoiceDNA,
  LicensingTerms,
  ProvenanceChain,
  CreativeDeclaration,
  CreateIdentityRequest,
  CreateIdentityResponse,
  GetIdentityRequest,
  UpdateIdentityRequest,
  StampContentRequest,
  StampContentResponse,
} from '../core/types.v2.js';
import {
  bovedaToO8,
  o8ToBoveda,
  mergeExternalDNA,
  validateIdentityForUseCase,
  BovedaCharacterGenome,
} from '../core/converters.js';

// ============================================================================
// TYPES
// ============================================================================

export interface IdentityStore {
  get(id: string): Promise<CreatorIdentity | null>;
  set(id: string, identity: CreatorIdentity): Promise<void>;
  delete(id: string): Promise<boolean>;
  list(filters?: IdentityFilters): Promise<CreatorIdentity[]>;
}

export interface IdentityFilters {
  creator_name?: string;
  has_audio_dna?: boolean;
  has_visual_dna?: boolean;
  has_voice_dna?: boolean;
  has_genome?: boolean;
  verification_level?: CreatorInfo['verification_level'];
  created_after?: string;
  created_before?: string;
}

export interface ExternalDNASources {
  /** STARFORGE API endpoint */
  starforge?: string;
  /** CLAROSA API endpoint */
  clarosa?: string;
  /** CHROMOX API endpoint */
  chromox?: string;
  /** BOVEDA API endpoint */
  boveda?: string;
}

export interface IdentityServiceConfig {
  store: IdentityStore;
  externalSources?: ExternalDNASources;
  ipfsGateway?: string;
}

// ============================================================================
// IN-MEMORY STORE (for development/testing)
// ============================================================================

export class InMemoryIdentityStore implements IdentityStore {
  private identities = new Map<string, CreatorIdentity>();

  async get(id: string): Promise<CreatorIdentity | null> {
    return this.identities.get(id) || null;
  }

  async set(id: string, identity: CreatorIdentity): Promise<void> {
    this.identities.set(id, identity);
  }

  async delete(id: string): Promise<boolean> {
    return this.identities.delete(id);
  }

  async list(filters?: IdentityFilters): Promise<CreatorIdentity[]> {
    let results = Array.from(this.identities.values());

    if (filters) {
      if (filters.creator_name) {
        results = results.filter(i =>
          i.creator.name.toLowerCase().includes(filters.creator_name!.toLowerCase())
        );
      }
      if (filters.has_audio_dna !== undefined) {
        results = results.filter(i => !!i.dna.audio === filters.has_audio_dna);
      }
      if (filters.has_visual_dna !== undefined) {
        results = results.filter(i => !!i.dna.visual === filters.has_visual_dna);
      }
      if (filters.has_voice_dna !== undefined) {
        results = results.filter(i => !!i.dna.voice === filters.has_voice_dna);
      }
      if (filters.has_genome !== undefined) {
        results = results.filter(i => !!i.genome === filters.has_genome);
      }
      if (filters.verification_level) {
        results = results.filter(i => i.creator.verification_level === filters.verification_level);
      }
      if (filters.created_after) {
        const after = new Date(filters.created_after);
        results = results.filter(i => new Date(i.created_at) >= after);
      }
      if (filters.created_before) {
        const before = new Date(filters.created_before);
        results = results.filter(i => new Date(i.created_at) <= before);
      }
    }

    return results;
  }
}

// ============================================================================
// IDENTITY SERVICE
// ============================================================================

export class IdentityService {
  private store: IdentityStore;
  private externalSources: ExternalDNASources;
  private ipfsGateway: string;

  constructor(config: IdentityServiceConfig) {
    this.store = config.store;
    this.externalSources = config.externalSources || {};
    this.ipfsGateway = config.ipfsGateway || 'https://ipfs.io';
  }

  /**
   * Generate a unique identity ID
   */
  private generateId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const hash = createHash('sha256')
      .update(timestamp + random)
      .digest('hex')
      .slice(0, 16);
    return `o8-${hash}`;
  }

  /**
   * Create a new identity
   */
  async createIdentity(request: CreateIdentityRequest): Promise<CreateIdentityResponse> {
    const now = new Date().toISOString();
    const id = this.generateId();

    const identity: CreatorIdentity = {
      identity_id: id,
      version: '2.0',
      created_at: now,
      updated_at: now,
      creator: request.creator,
      dna: request.dna as CreativeDNA,
      genome: request.genome,
      licensing: request.licensing,
      provenance: {},
    };

    await this.store.set(id, identity);

    return {
      identity,
      // ipfs_cid would be set after publishing to IPFS
    };
  }

  /**
   * Get an identity by ID
   */
  async getIdentity(request: GetIdentityRequest): Promise<CreatorIdentity | null> {
    const identity = await this.store.get(request.identity_id);

    if (!identity) {
      return null;
    }

    // Optionally strip fields based on request
    const result = { ...identity };

    if (request.include_dna === false) {
      result.dna = {} as CreativeDNA;
    }
    if (request.include_genome === false) {
      delete result.genome;
    }
    if (request.include_coherence === false) {
      delete result.coherence;
    }

    return result;
  }

  /**
   * Update an existing identity
   */
  async updateIdentity(request: UpdateIdentityRequest): Promise<CreatorIdentity | null> {
    const existing = await this.store.get(request.identity_id);

    if (!existing) {
      return null;
    }

    const updated: CreatorIdentity = {
      ...existing,
      ...request.updates,
      identity_id: existing.identity_id, // Cannot change ID
      version: existing.version, // Cannot change version
      created_at: existing.created_at, // Cannot change creation time
      updated_at: new Date().toISOString(),
    };

    // Deep merge DNA if provided
    if (request.updates.dna) {
      updated.dna = {
        ...existing.dna,
        ...request.updates.dna,
      };
    }

    await this.store.set(request.identity_id, updated);
    return updated;
  }

  /**
   * Delete an identity
   */
  async deleteIdentity(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  /**
   * List identities with optional filters
   */
  async listIdentities(filters?: IdentityFilters): Promise<CreatorIdentity[]> {
    return this.store.list(filters);
  }

  /**
   * Import a BOVEDA genome as a new identity
   */
  async importFromBoveda(
    genome: BovedaCharacterGenome,
    licensing?: Partial<LicensingTerms>
  ): Promise<CreatorIdentity> {
    const identity = bovedaToO8(genome, { licensing });
    await this.store.set(identity.identity_id, identity);
    return identity;
  }

  /**
   * Export an identity as a BOVEDA genome
   */
  async exportToBoveda(identityId: string): Promise<BovedaCharacterGenome | null> {
    const identity = await this.store.get(identityId);
    if (!identity) {
      return null;
    }
    return o8ToBoveda(identity);
  }

  /**
   * Import Audio DNA from STARFORGE
   */
  async importAudioDNA(
    identityId: string,
    audioDNA: AudioDNA
  ): Promise<CreatorIdentity | null> {
    const identity = await this.store.get(identityId);
    if (!identity) {
      return null;
    }

    const updated = mergeExternalDNA(identity, {
      starforge: audioDNA,
    });

    await this.store.set(identityId, updated);
    return updated;
  }

  /**
   * Import Visual DNA from CLAROSA
   */
  async importVisualDNA(
    identityId: string,
    tasteVector: number[]
  ): Promise<CreatorIdentity | null> {
    const identity = await this.store.get(identityId);
    if (!identity) {
      return null;
    }

    const updated = mergeExternalDNA(identity, {
      clarosa: { taste_vector: tasteVector },
    });

    await this.store.set(identityId, updated);
    return updated;
  }

  /**
   * Import Voice DNA from CHROMOX
   */
  async importVoiceDNA(
    identityId: string,
    voiceData: {
      embedding: number[];
      pitch_hz?: number;
      pitch_variance?: number;
    }
  ): Promise<CreatorIdentity | null> {
    const identity = await this.store.get(identityId);
    if (!identity) {
      return null;
    }

    const updated = mergeExternalDNA(identity, {
      chromox: voiceData,
    });

    await this.store.set(identityId, updated);
    return updated;
  }

  /**
   * Stamp content with identity provenance
   */
  async stampContent(request: StampContentRequest): Promise<StampContentResponse | null> {
    const identity = await this.store.get(request.identity_id);
    if (!identity) {
      return null;
    }

    const declarationId = `decl-${this.generateId().slice(3)}`;
    const now = new Date().toISOString();

    const declaration: CreativeDeclaration = {
      declaration_id: declarationId,
      version: '2.0',
      created_at: now,
      updated_at: now,
      identity,
      declaration_type: 'content_attribution',
      content: {
        type: request.content_type,
        fingerprint: request.content_fingerprint,
        metadata: request.metadata,
      },
      ai_contribution: request.ai_contribution,
    };

    // TODO: Publish to IPFS and get CID
    const ipfs_cid = `Qm${createHash('sha256').update(JSON.stringify(declaration)).digest('hex').slice(0, 44)}`;

    return {
      declaration,
      ipfs_cid,
    };
  }

  /**
   * Validate identity for a specific use case
   */
  async validateForUseCase(
    identityId: string,
    useCase: 'gaming' | 'fashion' | 'music'
  ): Promise<{ valid: boolean; missing: string[] } | null> {
    const identity = await this.store.get(identityId);
    if (!identity) {
      return null;
    }
    return validateIdentityForUseCase(identity, useCase);
  }

  /**
   * Calculate cross-modal coherence (placeholder for ML-based scoring)
   */
  async calculateCoherence(identityId: string): Promise<CreatorIdentity | null> {
    const identity = await this.store.get(identityId);
    if (!identity) {
      return null;
    }

    // Placeholder coherence calculation
    // In production, this would use ML models to compute cross-modal similarity
    const hasDNA = {
      audio: !!identity.dna.audio,
      visual: !!identity.dna.visual,
      voice: !!identity.dna.voice,
      narrative: !!identity.dna.narrative,
    };

    const dnaCount = Object.values(hasDNA).filter(Boolean).length;
    const overallScore = dnaCount >= 2 ? 0.5 + (dnaCount - 2) * 0.15 : 0;

    const updated: CreatorIdentity = {
      ...identity,
      coherence: {
        overall: Math.min(overallScore, 1),
        pairwise: {
          audio_visual: hasDNA.audio && hasDNA.visual ? 0.7 : undefined,
          audio_voice: hasDNA.audio && hasDNA.voice ? 0.75 : undefined,
          visual_voice: hasDNA.visual && hasDNA.voice ? 0.6 : undefined,
          audio_narrative: hasDNA.audio && hasDNA.narrative ? 0.65 : undefined,
          visual_narrative: hasDNA.visual && hasDNA.narrative ? 0.7 : undefined,
        },
        computed_at: new Date().toISOString(),
      },
      updated_at: new Date().toISOString(),
    };

    await this.store.set(identityId, updated);
    return updated;
  }
}

// ============================================================================
// EXPRESS ROUTE HANDLERS (can be used with Express.js or similar)
// ============================================================================

export interface RouteHandler {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  handler: (req: { params: Record<string, string>; body: unknown; query: Record<string, string> }) => Promise<{ status: number; body: unknown }>;
}

export function createRouteHandlers(service: IdentityService): RouteHandler[] {
  return [
    // POST /api/identity - Create new identity
    {
      method: 'POST',
      path: '/api/identity',
      handler: async (req) => {
        const result = await service.createIdentity(req.body as CreateIdentityRequest);
        return { status: 201, body: result };
      },
    },

    // GET /api/identity/:id - Get identity
    {
      method: 'GET',
      path: '/api/identity/:id',
      handler: async (req) => {
        const result = await service.getIdentity({
          identity_id: req.params.id,
          include_dna: req.query.include_dna !== 'false',
          include_genome: req.query.include_genome !== 'false',
          include_coherence: req.query.include_coherence !== 'false',
        });
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 200, body: result };
      },
    },

    // PUT /api/identity/:id - Update identity
    {
      method: 'PUT',
      path: '/api/identity/:id',
      handler: async (req) => {
        const result = await service.updateIdentity({
          identity_id: req.params.id,
          updates: req.body as UpdateIdentityRequest['updates'],
        });
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 200, body: result };
      },
    },

    // DELETE /api/identity/:id - Delete identity
    {
      method: 'DELETE',
      path: '/api/identity/:id',
      handler: async (req) => {
        const deleted = await service.deleteIdentity(req.params.id);
        if (!deleted) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 204, body: null };
      },
    },

    // POST /api/identity/from-boveda - Import from BOVEDA
    {
      method: 'POST',
      path: '/api/identity/from-boveda',
      handler: async (req) => {
        const { genome, licensing } = req.body as { genome: BovedaCharacterGenome; licensing?: Partial<LicensingTerms> };
        const result = await service.importFromBoveda(genome, licensing);
        return { status: 201, body: result };
      },
    },

    // POST /api/identity/:id/from-starforge - Import audio DNA
    {
      method: 'POST',
      path: '/api/identity/:id/from-starforge',
      handler: async (req) => {
        const result = await service.importAudioDNA(req.params.id, req.body as AudioDNA);
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 200, body: result };
      },
    },

    // POST /api/identity/:id/from-clarosa - Import visual DNA
    {
      method: 'POST',
      path: '/api/identity/:id/from-clarosa',
      handler: async (req) => {
        const { taste_vector } = req.body as { taste_vector: number[] };
        const result = await service.importVisualDNA(req.params.id, taste_vector);
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 200, body: result };
      },
    },

    // POST /api/identity/:id/from-chromox - Import voice DNA
    {
      method: 'POST',
      path: '/api/identity/:id/from-chromox',
      handler: async (req) => {
        const result = await service.importVoiceDNA(req.params.id, req.body as { embedding: number[]; pitch_hz?: number; pitch_variance?: number });
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 200, body: result };
      },
    },

    // POST /api/identity/:id/stamp - Stamp content
    {
      method: 'POST',
      path: '/api/identity/:id/stamp',
      handler: async (req) => {
        const stampRequest = {
          identity_id: req.params.id,
          ...(req.body as Omit<StampContentRequest, 'identity_id'>),
        };
        const result = await service.stampContent(stampRequest);
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 201, body: result };
      },
    },

    // GET /api/identity/:id/validate/:useCase - Validate for use case
    {
      method: 'GET',
      path: '/api/identity/:id/validate/:useCase',
      handler: async (req) => {
        const useCase = req.params.useCase as 'gaming' | 'fashion' | 'music';
        if (!['gaming', 'fashion', 'music'].includes(useCase)) {
          return { status: 400, body: { error: 'Invalid use case. Must be: gaming, fashion, or music' } };
        }
        const result = await service.validateForUseCase(req.params.id, useCase);
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 200, body: result };
      },
    },

    // POST /api/identity/:id/coherence - Calculate coherence
    {
      method: 'POST',
      path: '/api/identity/:id/coherence',
      handler: async (req) => {
        const result = await service.calculateCoherence(req.params.id);
        if (!result) {
          return { status: 404, body: { error: 'Identity not found' } };
        }
        return { status: 200, body: result };
      },
    },
  ];
}

// Note: IdentityService, InMemoryIdentityStore, and createRouteHandlers
// are exported where they are defined above.
