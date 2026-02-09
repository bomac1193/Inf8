/**
 * o8 Creative Identity Protocol v2.0
 *
 * Unified schema that bridges:
 * - BOVEDA Character Genome (archetypal identity)
 * - STARFORGE Audio DNA (sonic identity)
 * - CLAROSA Visual DNA (aesthetic identity)
 * - CHROMOX Voice DNA (vocal identity)
 *
 * This is the identity layer for human creativity.
 */

// ============================================================================
// CORE IDENTITY
// ============================================================================

export interface CreatorIdentity {
  /** Unique identifier (format: "o8-[hash]") */
  identity_id: string;

  /** Schema version */
  version: "2.0";

  /** Creation timestamp (ISO-8601) */
  created_at: string;

  /** Last update timestamp (ISO-8601) */
  updated_at: string;

  /** Creator information */
  creator: CreatorInfo;

  /** Multi-modal DNA signatures */
  dna: CreativeDNA;

  /** Archetypal/character genome (from BOVEDA) */
  genome?: CharacterGenome;

  /** Licensing and permissions */
  licensing: LicensingTerms;

  /** Provenance and verification */
  provenance: ProvenanceChain;

  /** Cross-modal coherence metrics */
  coherence?: CoherenceMetrics;
}

// ============================================================================
// CREATOR INFO
// ============================================================================

export interface CreatorInfo {
  /** Display name */
  name: string;

  /** Ethereum wallet for verification */
  wallet?: string;

  /** Cryptographic signature */
  signature?: string;

  /** Verification level */
  verification_level: "none" | "basic" | "enhanced" | "verified";

  /** KYC status (from ISSUANCE) */
  kyc_status?: "pending" | "approved" | "rejected";

  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

// ============================================================================
// CREATIVE DNA (Multi-Modal Signatures)
// ============================================================================

export interface CreativeDNA {
  /** Audio DNA (from STARFORGE) */
  audio?: AudioDNA;

  /** Visual DNA (from CLAROSA) */
  visual?: VisualDNA;

  /** Voice DNA (from CHROMOX) */
  voice?: VoiceDNA;

  /** Narrative DNA (from BOVEDA) */
  narrative?: NarrativeDNA;

  /** Movement DNA (from BOVEDA) */
  movement?: MovementDNA;
}

// ============================================================================
// AUDIO DNA (STARFORGE)
// ============================================================================

export interface AudioDNA {
  /** Source system */
  source: "starforge";

  /** Sonic palette - frequency distribution */
  sonic_palette: {
    sub_bass: number;      // 0-1: 20-60Hz presence
    bass: number;          // 0-1: 60-250Hz presence
    low_mid: number;       // 0-1: 250-500Hz presence
    mid: number;           // 0-1: 500-2kHz presence
    high_mid: number;      // 0-1: 2-4kHz presence
    presence: number;      // 0-1: 4-6kHz presence
    brilliance: number;    // 0-1: 6-20kHz presence
  };

  /** Taste coherence score */
  taste_coherence: number; // 0-1

  /** Energy profile */
  energy_profile: {
    average: number;       // 0-1
    variance: number;      // 0-1
    peak_ratio: number;    // 0-1
  };

  /** BPM range */
  tempo_range: {
    min: number;
    max: number;
    preferred: number;
  };

  /** Influence genealogy */
  influence_genealogy?: {
    primary_genre: string;
    secondary_genres: string[];
    era_influences: string[];
    artist_influences?: string[];
  };

  /** Optional embedding vector */
  embedding?: number[]; // 512-dim
}

// ============================================================================
// VISUAL DNA (CLAROSA)
// ============================================================================

export interface VisualDNA {
  /** Source system */
  source: "clarosa" | "genoma";

  /** Taste vector (DINOv2 embedding) */
  taste_vector?: number[]; // 768-dim

  /** Color palette */
  color_palette: {
    primary: string[];     // Hex colors
    secondary: string[];
    accent?: string[];
  };

  /** Visual style attributes */
  style: {
    aesthetic: string;     // e.g., "Afrofuturist", "Minimalist"
    patterns: string[];
    textures: string[];
    light_quality: string;
  };

  /** Symbol motifs */
  symbol_motifs?: string[];

  /** Genome sliders (from GENOMA) */
  genome_sliders?: {
    abstraction: number;   // 0-1
    motion: number;        // 0-1
    texture: number;       // 0-1
    color_intensity: number; // 0-1
    cinematic: number;     // 0-1
  };
}

// ============================================================================
// VOICE DNA (CHROMOX)
// ============================================================================

export interface VoiceDNA {
  /** Source system */
  source: "chromox";

  /** Voice embedding */
  embedding: number[]; // 256-dim

  /** Pitch profile */
  pitch: {
    range: "bass" | "baritone" | "tenor" | "alto" | "soprano";
    average_hz: number;
    variance: number;
  };

  /** Timbre characteristics */
  timbre: {
    qualities: string[];   // e.g., "warm", "bright", "resonant"
    formant_signature?: number[];
  };

  /** Speech patterns */
  speech_patterns: string[];

  /** Rhythmic quality */
  rhythmic_quality: string;

  /** Emotional resonance */
  emotional_resonance: string;

  /** Provider-specific IDs (for synthesis) */
  provider_ids?: {
    elevenlabs?: string;
    rvc?: string;
    openai?: string;
  };
}

// ============================================================================
// NARRATIVE DNA (BOVEDA)
// ============================================================================

export interface NarrativeDNA {
  /** Source system */
  source: "boveda";

  /** Core values */
  core_values: string[];

  /** Central conflicts */
  central_conflicts: string[];

  /** Recurring themes */
  recurring_themes: string[];

  /** Ultimate goal/purpose */
  telos: string;

  /** Origin elements */
  origin_elements?: string[];

  /** Relational patterns */
  relational_patterns?: {
    archetype: string;
    nature: string;
  }[];
}

// ============================================================================
// MOVEMENT DNA (BOVEDA)
// ============================================================================

export interface MovementDNA {
  /** Source system */
  source: "boveda";

  /** Quality of motion */
  quality_of_motion: string;

  /** Tempo preference */
  tempo_preference: "slow" | "moderate" | "fast" | "variable";

  /** Spatial orientation */
  spatial_orientation: "grounded" | "expansive" | "contained" | "flowing";

  /** Gesture vocabulary */
  gesture_vocabulary: string[];

  /** Dance influences */
  dance_influences: string[];

  /** Posture characteristics */
  posture_characteristics: string[];
}

// ============================================================================
// CHARACTER GENOME (BOVEDA)
// Full archetypal identity system
// ============================================================================

export interface CharacterGenome {
  /** Genome ID */
  genome_id: string;

  /** Schema version */
  schema_version: string;

  /** Orisha configuration */
  orisha: OrishaConfiguration;

  /** Kabbalistic position */
  kabbalah: KabbalisticPosition;

  /** Psychological state */
  psychological_state: PsychologicalState;

  /** Invariant markers (identity anchors) */
  invariants: InvariantMarkers;

  /** Evolution rules */
  evolution_rules: EvolutionRules;
}

export interface OrishaConfiguration {
  /** Primary ruling Orisha */
  head_orisha: string;

  /** Specific camino/path */
  camino?: string;

  /** Secondary influences */
  secondary_influences: {
    orisha: string;
    strength: number; // 0-1
  }[];

  /** Shadow form */
  shadow_form?: string;
}

export interface KabbalisticPosition {
  /** Primary Sephira */
  primary_sephira: string;

  /** Pillar (Mercy/Severity/Balance) */
  pillar: "Mercy" | "Severity" | "Balance";

  /** Qliphothic shadow */
  qliphothic_shadow: string;

  /** Active path being walked */
  active_path?: number;

  /** Daath relationship */
  daath_relationship: "seeking" | "touched" | "integrated" | "avoiding";
}

export interface PsychologicalState {
  /** Individuation level 0-1 */
  individuation_level: number;

  /** Hot/Cool axis -1 to +1 */
  hot_cool_axis: number;

  /** Dominant complex */
  dominant_complex: string;

  /** Shadow integration 0-1 */
  shadow_integration: number;

  /** Active archetypes */
  active_archetypes: string[];

  /** Current trajectory */
  trajectory: "emergence" | "ascent" | "crisis" | "descent" | "integration" | "transcendence";
}

export interface InvariantMarkers {
  /** Identity anchors that never change */
  identity_anchors: string[];

  /** Behaviors never exhibited */
  absolute_taboos: string[];

  /** Signature phrases */
  signature_phrases: string[];

  /** Non-negotiable values */
  sacred_values: string[];

  /** Immutable traits */
  immutable_traits: string[];
}

export interface EvolutionRules {
  /** Aspects that can change */
  permitted_changes: {
    aspect: string;
    max_drift: number; // 0-1
    conditions: string[];
  }[];

  /** Protected core */
  protected_core: string[];

  /** Evolution triggers */
  evolution_triggers: {
    trigger: string;
    effect: string;
  }[];

  /** Change velocity */
  change_velocity: "glacial" | "slow" | "moderate" | "rapid";
}

// ============================================================================
// LICENSING TERMS
// ============================================================================

export interface LicensingTerms {
  /** Allow AI training on this identity */
  training_rights: boolean;

  /** Allow derivative works */
  derivative_rights: boolean;

  /** Allow commercial use */
  commercial_rights: boolean;

  /** Require attribution */
  attribution_required: boolean;

  /** Revenue split (0-1) for licensed uses */
  revenue_split?: number;

  /** Specific platform permissions */
  platform_permissions?: {
    platform: string;
    permitted: boolean;
    terms?: string;
  }[];

  /** Custom license terms */
  custom_terms?: string;

  /** License expiry */
  expires_at?: string;
}

// ============================================================================
// PROVENANCE CHAIN
// ============================================================================

export interface ProvenanceChain {
  /** IPFS CID of identity data */
  ipfs_cid?: string;

  /** Blockchain transaction */
  blockchain_tx?: string;

  /** C2PA manifest reference */
  c2pa_manifest?: string;

  /** Story Protocol IP ID */
  story_protocol_id?: string;

  /** Source materials this identity derives from */
  source_materials?: {
    cid: string;
    description: string;
    relationship: "influenced_by" | "derived_from" | "trained_on";
  }[];

  /** Revision history */
  revisions?: {
    version: string;
    timestamp: string;
    changes: string;
    previous_cid?: string;
  }[];

  /** Audio fingerprint (for audio-primary identities) */
  audio_fingerprint?: {
    sha256: string;
    duration_ms: number;
    format: string;
  };
}

// ============================================================================
// COHERENCE METRICS
// ============================================================================

export interface CoherenceMetrics {
  /** Overall cross-modal coherence 0-1 */
  overall: number;

  /** Pairwise coherence scores */
  pairwise: {
    audio_visual?: number;
    audio_voice?: number;
    visual_voice?: number;
    audio_narrative?: number;
    visual_narrative?: number;
  };

  /** Computed at timestamp */
  computed_at: string;
}

// ============================================================================
// DECLARATION (For provenance stamping)
// ============================================================================

export interface CreativeDeclaration {
  /** Declaration ID */
  declaration_id: string;

  /** Schema version */
  version: "2.0";

  /** Timestamps */
  created_at: string;
  updated_at: string;

  /** The creative identity being declared */
  identity: CreatorIdentity;

  /** What this declaration is for */
  declaration_type: "identity_registration" | "content_attribution" | "license_grant" | "provenance_stamp";

  /** Content being attributed (if applicable) */
  content?: {
    type: "audio" | "visual" | "video" | "text" | "other";
    fingerprint: string;
    metadata?: Record<string, unknown>;
  };

  /** AI contribution (if applicable) */
  ai_contribution?: {
    model: string;
    provider: string;
    contribution_percentage: number;
    generation_params?: Record<string, unknown>;
  };

  /** Cryptographic signature */
  signature?: string;
}

// ============================================================================
// MAPPING HELPERS
// ============================================================================

/**
 * Maps a BOVEDA CharacterGenome to o8 CreatorIdentity
 */
export interface BovedaToO8Mapping {
  /** BOVEDA genome ID */
  boveda_genome_id: string;

  /** o8 identity ID */
  o8_identity_id: string;

  /** Mapping version */
  mapping_version: string;

  /** Field mappings */
  mappings: {
    boveda_field: string;
    o8_field: string;
    transform?: string;
  }[];
}

/**
 * Maps Starforge Audio DNA to o8 AudioDNA
 */
export interface StarforgeToO8Mapping {
  starforge_catalog_id: string;
  o8_identity_id: string;
  sonic_palette_mapping: Record<string, string>;
}

/**
 * Maps Clarosa taste vectors to o8 VisualDNA
 */
export interface ClarosaToO8Mapping {
  clarosa_user_id: string;
  o8_identity_id: string;
  taste_vector_version: string;
}

/**
 * Maps Chromox voice profiles to o8 VoiceDNA
 */
export interface ChromoxToO8Mapping {
  chromox_persona_id: string;
  o8_identity_id: string;
  embedding_version: string;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateIdentityRequest {
  /** Creator info */
  creator: CreatorInfo;

  /** Initial DNA (at least one required) */
  dna: Partial<CreativeDNA>;

  /** Optional genome */
  genome?: CharacterGenome;

  /** Licensing terms */
  licensing: LicensingTerms;
}

export interface CreateIdentityResponse {
  identity: CreatorIdentity;
  ipfs_cid?: string;
}

export interface GetIdentityRequest {
  identity_id: string;
  include_dna?: boolean;
  include_genome?: boolean;
  include_coherence?: boolean;
}

export interface UpdateIdentityRequest {
  identity_id: string;
  updates: Partial<Omit<CreatorIdentity, "identity_id" | "version" | "created_at">>;
}

export interface StampContentRequest {
  identity_id: string;
  content_type: "audio" | "visual" | "video" | "text";
  content_fingerprint: string;
  ai_contribution?: CreativeDeclaration["ai_contribution"];
  metadata?: Record<string, unknown>;
}

export interface StampContentResponse {
  declaration: CreativeDeclaration;
  ipfs_cid: string;
}
