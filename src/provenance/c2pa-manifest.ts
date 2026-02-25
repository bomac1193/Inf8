/**
 * o8 C2PA Manifest Generator
 *
 * Creates C2PA (Coalition for Content Provenance and Authenticity) manifests
 * for audio content with o8 identity integration.
 *
 * C2PA Spec: https://c2pa.org/specifications/specifications/1.3/specs/C2PA_Specification.html
 *
 * This implementation creates sidecar manifests (JSON) that can be:
 * - Embedded in supported formats (future: C2PA-enabled audio)
 * - Stored alongside content as .c2pa files
 * - Published to IPFS for permanent provenance
 */

import { createHash, createSign, createVerify, generateKeyPairSync, randomBytes } from 'crypto';
import { CreatorIdentity, CreativeDeclaration } from '../core/types.v2.js';

// ============================================================================
// C2PA TYPES (following C2PA Specification 1.3)
// ============================================================================

/**
 * C2PA Claim - the core assertion about content
 */
export interface C2PAClaim {
  /** Claim generator (software that created this claim) */
  claim_generator: string;
  /** Claim generator info */
  claim_generator_info?: {
    name: string;
    version: string;
    website?: string;
  }[];
  /** Title of the content */
  title?: string;
  /** Format of the content (MIME type) */
  format: string;
  /** Instance ID (unique per claim) */
  instance_id: string;
  /** Thumbnail reference (optional) */
  thumbnail?: {
    format: string;
    identifier: string;
  };
  /** Assertions made about the content */
  assertions: C2PAAssertionReference[];
  /** Signature information */
  signature: string;
  /** Claim signature algorithm */
  alg: string;
}

/**
 * Reference to an assertion within the manifest
 */
export interface C2PAAssertionReference {
  url: string;
  hash: string;
  alg: string;
}

/**
 * C2PA Assertion - statements about the content
 */
export interface C2PAAssertion {
  /** Assertion label (type) */
  label: string;
  /** Assertion data */
  data: unknown;
  /** Kind of assertion */
  kind?: 'Json' | 'Cbor' | 'Binary';
}

/**
 * Creative Work Assertion (c2pa.creative_work)
 */
export interface CreativeWorkAssertion {
  /** Author information */
  author?: {
    '@type': 'Person' | 'Organization';
    name: string;
    identifier?: string;
    credential?: {
      url: string;
      alg: string;
      hash: string;
    }[];
  }[];
  /** Creation date */
  dateCreated?: string;
  /** Digital source type */
  digitalSourceType?: string;
}

/**
 * Actions Assertion (c2pa.actions)
 */
export interface ActionsAssertion {
  actions: {
    action: string;
    when?: string;
    softwareAgent?: string;
    parameters?: Record<string, unknown>;
    digitalSourceType?: string;
  }[];
}

/**
 * o8 Identity Assertion (custom extension)
 */
export interface O8IdentityAssertion {
  /** o8 identity ID */
  identity_id: string;
  /** Creator name */
  creator_name: string;
  /** Verification level */
  verification_level: string;
  /** IPFS CID of full identity (if published) */
  identity_cid?: string;
  /** Licensing terms */
  licensing: {
    training_rights: boolean;
    derivative_rights: boolean;
    commercial_rights: boolean;
    attribution_required: boolean;
  };
}

/**
 * o8 Audio DNA Assertion (custom extension)
 */
export interface O8AudioDNAAssertion {
  /** Source of audio DNA */
  source: 'starforge' | 'generated' | 'human';
  /** Genre influences */
  genre_influences?: string[];
  /** Tempo range */
  tempo_range?: { min: number; max: number };
  /** Sonic palette summary */
  sonic_palette_hash?: string;
}

/**
 * Full C2PA Manifest
 */
export interface C2PAManifest {
  /** Manifest version */
  version: '1.3';
  /** Manifest label (unique identifier) */
  manifest_label: string;
  /** Claim */
  claim: C2PAClaim;
  /** Assertions */
  assertions: C2PAAssertion[];
  /** Credential store references */
  credential_store?: {
    url: string;
    alg: string;
    hash: string;
  }[];
  /** o8 extensions */
  o8_extensions?: {
    protocol_version: '2.0';
    identity_cid?: string;
    declaration_cid?: string;
  };
}

// ============================================================================
// C2PA DIGITAL SOURCE TYPES
// ============================================================================

export const DigitalSourceType = {
  /** Created purely by a human */
  TRAINED_ALGORITHM_MEDIA: 'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
  /** Created with AI assistance */
  COMPOSITE_WITH_TRAINED_ALGORITHM: 'http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia',
  /** Human-created content */
  DIGITAL_CAPTURE: 'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture',
  /** Synthesized audio */
  ALGORITHMICALLY_ENHANCED: 'http://cv.iptc.org/newscodes/digitalsourcetype/algorithmicallyEnhanced',
} as const;

// ============================================================================
// C2PA ACTION TYPES
// ============================================================================

export const ActionType = {
  CREATED: 'c2pa.created',
  EDITED: 'c2pa.edited',
  CONVERTED: 'c2pa.converted',
  PUBLISHED: 'c2pa.published',
  TRANSCODED: 'c2pa.transcoded',
  // o8 custom actions
  O8_STAMPED: 'o8.stamped',
  O8_IDENTITY_LINKED: 'o8.identity_linked',
  O8_AUDIO_GENERATED: 'o8.audio_generated',
  O8_AUDIO_ADAPTED: 'o8.audio_adapted',
} as const;

// ============================================================================
// MANIFEST GENERATOR
// ============================================================================

export interface ManifestGeneratorConfig {
  /** Signing key (PEM format) */
  signingKey?: string;
  /** Certificate chain (PEM format) */
  certificateChain?: string;
  /** Claim generator info */
  claimGenerator?: {
    name: string;
    version: string;
    website?: string;
  };
}

export class C2PAManifestGenerator {
  private config: ManifestGeneratorConfig;
  private keyPair: { publicKey: string; privateKey: string } | null = null;

  constructor(config: ManifestGeneratorConfig = {}) {
    this.config = {
      claimGenerator: config.claimGenerator || {
        name: 'o8-protocol',
        version: '2.0.0',
        website: 'https://o8.audio',
      },
      ...config,
    };

    // Generate ephemeral key pair if not provided
    if (!config.signingKey) {
      this.keyPair = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
    }
  }

  /**
   * Generate a manifest for audio content with o8 identity
   */
  generateManifest(options: {
    /** Content fingerprint (SHA-256) */
    contentHash: string;
    /** Content MIME type */
    contentType: string;
    /** Content title */
    title?: string;
    /** o8 identity */
    identity?: CreatorIdentity;
    /** o8 declaration */
    declaration?: CreativeDeclaration;
    /** AI contribution percentage (0-1) */
    aiContribution?: number;
    /** Actions performed */
    actions?: {
      action: string;
      when?: string;
      parameters?: Record<string, unknown>;
    }[];
    /** Additional assertions */
    customAssertions?: C2PAAssertion[];
  }): C2PAManifest {
    const manifestLabel = `o8:urn:uuid:${this.generateUUID()}`;
    const instanceId = `xmp.iid:${this.generateUUID()}`;
    const now = new Date().toISOString();

    // Build assertions
    const assertions: C2PAAssertion[] = [];

    // 1. Creative Work assertion
    const creativeWork: CreativeWorkAssertion = {
      dateCreated: now,
      digitalSourceType: this.determineSourceType(options.aiContribution),
    };

    if (options.identity) {
      creativeWork.author = [{
        '@type': 'Person',
        name: options.identity.creator.name,
        identifier: options.identity.identity_id,
      }];
    }

    assertions.push({
      label: 'c2pa.creative_work',
      data: creativeWork,
      kind: 'Json',
    });

    // 2. Actions assertion
    const actionsData: ActionsAssertion = {
      actions: [
        {
          action: ActionType.CREATED,
          when: now,
          softwareAgent: `${this.config.claimGenerator!.name}/${this.config.claimGenerator!.version}`,
          digitalSourceType: this.determineSourceType(options.aiContribution),
        },
        ...(options.actions || []),
      ],
    };

    if (options.identity) {
      actionsData.actions.push({
        action: ActionType.O8_IDENTITY_LINKED,
        when: now,
        softwareAgent: 'o8-protocol/2.0',
        parameters: {
          identity_id: options.identity.identity_id,
        },
      });
    }

    if (options.declaration) {
      actionsData.actions.push({
        action: ActionType.O8_STAMPED,
        when: now,
        softwareAgent: 'o8-protocol/2.0',
        parameters: {
          declaration_id: options.declaration.declaration_id,
        },
      });
    }

    assertions.push({
      label: 'c2pa.actions',
      data: actionsData,
      kind: 'Json',
    });

    // 3. o8 Identity assertion (custom)
    if (options.identity) {
      const o8Identity: O8IdentityAssertion = {
        identity_id: options.identity.identity_id,
        creator_name: options.identity.creator.name,
        verification_level: options.identity.creator.verification_level,
        identity_cid: options.identity.provenance?.ipfs_cid,
        licensing: {
          training_rights: options.identity.licensing.training_rights,
          derivative_rights: options.identity.licensing.derivative_rights,
          commercial_rights: options.identity.licensing.commercial_rights,
          attribution_required: options.identity.licensing.attribution_required,
        },
      };

      assertions.push({
        label: 'o8.identity',
        data: o8Identity,
        kind: 'Json',
      });
    }

    // 4. o8 Audio DNA assertion (if audio DNA present)
    if (options.identity?.dna?.audio) {
      const audioDNA = options.identity.dna.audio;
      const o8AudioDNA: O8AudioDNAAssertion = {
        source: audioDNA.source,
        genre_influences: audioDNA.influence_genealogy?.secondary_genres,
        tempo_range: audioDNA.tempo_range ? {
          min: audioDNA.tempo_range.min,
          max: audioDNA.tempo_range.max,
        } : undefined,
        sonic_palette_hash: this.hashObject(audioDNA.sonic_palette),
      };

      assertions.push({
        label: 'o8.audio_dna',
        data: o8AudioDNA,
        kind: 'Json',
      });
    }

    // 5. Custom assertions
    if (options.customAssertions) {
      assertions.push(...options.customAssertions);
    }

    // Build assertion references
    const assertionRefs: C2PAAssertionReference[] = assertions.map((assertion, idx) => ({
      url: `self#jumbf=/${manifestLabel}/c2pa.assertions/${assertion.label}_${idx}`,
      hash: this.hashObject(assertion.data),
      alg: 'sha256',
    }));

    // Build claim
    const claim: C2PAClaim = {
      claim_generator: `${this.config.claimGenerator!.name}/${this.config.claimGenerator!.version}`,
      claim_generator_info: [this.config.claimGenerator!],
      title: options.title,
      format: options.contentType,
      instance_id: instanceId,
      assertions: assertionRefs,
      signature: '', // Will be filled after signing
      alg: 'RS256',
    };

    // Sign the claim
    claim.signature = this.signClaim(claim);

    // Build manifest
    const manifest: C2PAManifest = {
      version: '1.3',
      manifest_label: manifestLabel,
      claim,
      assertions,
      o8_extensions: {
        protocol_version: '2.0',
        identity_cid: options.identity?.provenance?.ipfs_cid,
        declaration_cid: options.declaration?.content?.fingerprint,
      },
    };

    return manifest;
  }

  /**
   * Generate a manifest for game audio adaptation
   */
  generateGameAudioManifest(options: {
    /** Content fingerprint */
    contentHash: string;
    /** o8 identity */
    identity: CreatorIdentity;
    /** Game state ID */
    gameState: string;
    /** Stem mix configuration */
    stemMix: Record<string, number>;
    /** Crossfade duration */
    crossfadeMs: number;
  }): C2PAManifest {
    return this.generateManifest({
      contentHash: options.contentHash,
      contentType: 'audio/mpeg',
      title: `Game Audio - ${options.gameState}`,
      identity: options.identity,
      aiContribution: 0.5, // Adaptive audio is partially AI-driven
      actions: [
        {
          action: ActionType.O8_AUDIO_ADAPTED,
          when: new Date().toISOString(),
          parameters: {
            game_state: options.gameState,
            stem_mix: options.stemMix,
            crossfade_ms: options.crossfadeMs,
          },
        },
      ],
    });
  }

  /**
   * Verify a manifest signature
   */
  verifyManifest(manifest: C2PAManifest): boolean {
    try {
      const { signature, ...claimWithoutSig } = manifest.claim;
      const claimData = JSON.stringify(claimWithoutSig);

      const verify = createVerify('RSA-SHA256');
      verify.update(claimData);

      const publicKey = this.keyPair?.publicKey || this.config.certificateChain;
      if (!publicKey) {
        throw new Error('No public key available for verification');
      }

      return verify.verify(publicKey, signature, 'base64');
    } catch {
      return false;
    }
  }

  /**
   * Export manifest as JSON
   */
  exportJSON(manifest: C2PAManifest): string {
    return JSON.stringify(manifest, null, 2);
  }

  /**
   * Export manifest as compact JSON (for embedding)
   */
  exportCompact(manifest: C2PAManifest): string {
    return JSON.stringify(manifest);
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private determineSourceType(aiContribution?: number): string {
    if (aiContribution === undefined) {
      return DigitalSourceType.DIGITAL_CAPTURE;
    }
    if (aiContribution >= 0.8) {
      return DigitalSourceType.TRAINED_ALGORITHM_MEDIA;
    }
    if (aiContribution >= 0.2) {
      return DigitalSourceType.COMPOSITE_WITH_TRAINED_ALGORITHM;
    }
    return DigitalSourceType.ALGORITHMICALLY_ENHANCED;
  }

  private signClaim(claim: C2PAClaim): string {
    const { signature, ...claimWithoutSig } = claim;
    const claimData = JSON.stringify(claimWithoutSig);

    const privateKey = this.keyPair?.privateKey || this.config.signingKey;
    if (!privateKey) {
      // Return hash as pseudo-signature for testing
      return this.hashObject(claimWithoutSig);
    }

    const sign = createSign('RSA-SHA256');
    sign.update(claimData);
    return sign.sign(privateKey, 'base64');
  }

  private hashObject(obj: unknown): string {
    const json = JSON.stringify(obj);
    return createHash('sha256').update(json).digest('hex');
  }

  private generateUUID(): string {
    const bytes = randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = bytes.toString('hex');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export function createManifestGenerator(config?: ManifestGeneratorConfig): C2PAManifestGenerator {
  return new C2PAManifestGenerator(config);
}
