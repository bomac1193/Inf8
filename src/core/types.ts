/**
 * Ø8 Core Types
 * TypeScript interfaces for the creative provenance declaration schema
 */

/**
 * Primary artist identity with optional wallet verification
 */
export interface PrimaryArtist {
  /** Artist name or alias */
  name: string;
  /** Ethereum wallet address for cryptographic verification */
  wallet?: string;
  /** Cryptographic signature proving ownership */
  signature?: string;
}

/**
 * Collaborator with role and optional revenue split
 */
export interface Collaborator {
  /** Collaborator name */
  name: string;
  /** Role in the production (e.g., "vocals", "mixing", "arrangement") */
  role: string;
  /** Ethereum wallet address */
  wallet?: string;
  /** Revenue split percentage (0-1) */
  split?: number;
}

/**
 * Contributor who participated but may not receive revenue split
 */
export interface Contributor {
  /** Contributor name */
  name: string;
  /** Role in the production */
  role: string;
  /** Description of specific contribution */
  contribution: string;
}

/**
 * Identity section containing all parties involved
 */
export interface Identity {
  /** Primary creator/owner of the work */
  primary_artist: PrimaryArtist;
  /** Collaborators with revenue splits */
  collaborators: Collaborator[];
  /** Other contributors */
  contributors: Contributor[];
}

/**
 * AI model used in production
 */
export interface AIModel {
  /** Model name (e.g., "Suno v3", "Udio", "AIVA") */
  name: string;
  /** Provider/company (e.g., "Suno", "OpenAI", "Stability AI") */
  provider: string;
  /** Model version if known */
  version?: string;
  /** What the model was used for (e.g., "melody generation", "stem separation") */
  usage: string;
}

/**
 * Sample used in production
 */
export interface Sample {
  /** Sample name or identifier */
  name: string;
  /** Source (sample pack, artist, platform) */
  source: string;
  /** License type if known */
  license?: string;
}

/**
 * Creative stack documenting all tools used
 */
export interface CreativeStack {
  /** Digital Audio Workstations (e.g., "Ableton Live 12", "Logic Pro X") */
  daws: string[];
  /** Plugins and software instruments */
  plugins: string[];
  /** AI models used in production */
  ai_models: AIModel[];
  /** Hardware instruments and equipment */
  hardware: string[];
  /** Samples used */
  samples: Sample[];
}

/**
 * AI contribution percentages for each production phase
 */
export interface AIContribution {
  /** Composition phase (melody, harmony, chord progressions) - 0 to 1 */
  composition: number;
  /** Arrangement phase (structure, sections, instrumentation) - 0 to 1 */
  arrangement: number;
  /** Production phase (sound design, mixing decisions) - 0 to 1 */
  production: number;
  /** Mixing phase (levels, EQ, compression) - 0 to 1 */
  mixing: number;
  /** Mastering phase (final polish, loudness) - 0 to 1 */
  mastering: number;
}

/**
 * Production intelligence documenting AI involvement
 */
export interface ProductionIntelligence {
  /** AI contribution breakdown by phase */
  ai_contribution: AIContribution;
  /** Methodology description explaining the creative process */
  methodology: string;
  /** Additional notes about the production */
  notes?: string;
}

/**
 * Source material referenced in the work
 */
export interface SourceMaterial {
  /** IPFS CID of the source */
  cid: string;
  /** Description of the source material */
  description: string;
  /** Relationship type */
  relationship: "sample" | "remix" | "cover" | "interpolation";
}

/**
 * Sample reference with IPFS CID
 */
export interface SampleReference {
  /** IPFS CID of the sample */
  cid: string;
  /** Sample name */
  name: string;
  /** Timestamp in the track where sample appears (ISO-8601 duration or ms) */
  timestamp?: string;
}

/**
 * Stem export with type classification
 */
export interface Stem {
  /** IPFS CID of the stem */
  cid: string;
  /** Stem name */
  name: string;
  /** Stem type classification */
  type: "vocals" | "drums" | "bass" | "melody" | "harmony" | "fx" | "other";
}

/**
 * Provenance chain linking to source materials
 */
export interface Provenance {
  /** IPFS CID of the final audio file */
  ipfs_cid?: string;
  /** Source materials this work derives from */
  source_material: SourceMaterial[];
  /** Samples used with CID references */
  samples: SampleReference[];
  /** Individual stems exported */
  stems: Stem[];
}

/**
 * Revision history entry
 */
export interface Revision {
  /** Version identifier */
  version: string;
  /** Timestamp of revision (ISO-8601) */
  timestamp: string;
  /** Description of changes */
  changes: string;
  /** CID of previous declaration version */
  previous_cid?: string;
}

/**
 * Audio file fingerprint for verification
 */
export interface AudioFingerprint {
  /** SHA-256 hash of the audio file */
  sha256: string;
  /** Duration in milliseconds */
  duration_ms: number;
  /** Audio format (e.g., "wav", "mp3", "flac") */
  format: string;
  /** Sample rate in Hz */
  sample_rate?: number;
  /** Bit depth */
  bit_depth?: number;
}

/**
 * Complete Ø8 Declaration
 * The machine-readable creative provenance record
 */
export interface Declaration {
  /** Schema version */
  version: "1.0";
  /** Unique declaration ID (format: "o8-[IPFS_CID]" or "o8-pending-[uuid]") */
  declaration_id: string;
  /** Creation timestamp (ISO-8601) */
  created_at: string;
  /** Last update timestamp (ISO-8601) */
  updated_at: string;
  /** Identity of all parties involved */
  identity: Identity;
  /** Tools and technologies used */
  creative_stack: CreativeStack;
  /** AI involvement metrics and methodology */
  production_intelligence: ProductionIntelligence;
  /** Source material and IPFS references */
  provenance: Provenance;
  /** Version history */
  revision_history: Revision[];
  /** Audio file verification data */
  audio_fingerprint: AudioFingerprint;
}

/**
 * Verification result from checking a declaration
 */
export interface VerificationResult {
  /** Overall verification success */
  valid: boolean;
  /** The declaration being verified */
  declaration: Declaration;
  /** Individual check results */
  checks: {
    /** Schema validation */
    schema: { valid: boolean; errors?: string[] };
    /** Audio fingerprint verification */
    fingerprint?: { valid: boolean; computed?: string; declared?: string };
    /** Cryptographic signature verification */
    signatures?: { valid: boolean; verified?: string[]; failed?: string[] };
    /** Provenance source availability */
    provenance?: { valid: boolean; sources_checked: number; sources_valid: number };
  };
  /** Verification timestamp */
  timestamp: string;
}

/**
 * Result type for validation operations
 */
export type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; errors: string[] };
