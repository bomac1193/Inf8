/**
 * o8 ↔ BOVEDA Converters
 *
 * Bidirectional conversion between BOVEDA Character Genome and o8 CreatorIdentity.
 * See BOVEDA_O8_MAPPING.md for full field mapping documentation.
 */

import { createHash } from 'crypto';
import {
  CreatorIdentity,
  CreatorInfo,
  CreativeDNA,
  CharacterGenome as O8CharacterGenome,
  OrishaConfiguration as O8OrishaConfig,
  KabbalisticPosition as O8KabbalahPosition,
  PsychologicalState as O8PsychState,
  InvariantMarkers as O8Invariants,
  EvolutionRules as O8EvolutionRules,
  VisualDNA,
  VoiceDNA,
  NarrativeDNA,
  MovementDNA,
  LicensingTerms,
  ProvenanceChain,
} from './types.v2.js';

// ============================================================================
// BOVEDA Types (imported inline to avoid cross-package dependency)
// These mirror the types from boveda/packages/oripheon/src/types/genome.types.ts
// ============================================================================

interface BovedaOrishaConfig {
  headOrisha: string;
  camino?: string;
  secondaryInfluences: { orisha: string; strength: number }[];
  shadowForm?: string;
}

interface BovedaKabbalahPosition {
  primarySephira: string;
  pillar: 'Mercy' | 'Severity' | 'Balance';
  qliphothicShadow: string;
  activePath?: number;
  daathRelationship: 'seeking' | 'touched' | 'integrated' | 'avoiding';
}

interface BovedaPsychState {
  individuationLevel: number;
  hotCoolAxis: number;
  dominantComplex: string;
  shadowIntegration: number;
  activeArchetypes: string[];
  trajectory: 'emergence' | 'ascent' | 'crisis' | 'descent' | 'integration' | 'transcendence';
}

interface BovedaVisualSignature {
  primaryColors: string[];
  secondaryColors: string[];
  patterns: string[];
  textures: string[];
  lightQuality: string;
  aestheticStyle: string;
  symbolMotifs: string[];
}

interface BovedaVoiceSignature {
  pitchRange: 'bass' | 'baritone' | 'tenor' | 'alto' | 'soprano';
  timbre: string[];
  speechPatterns: string[];
  rhythmicQuality: string;
  emotionalResonance: string;
  accentInfluences: string[];
}

interface BovedaMusicSignature {
  keySignature: string;
  mode: string;
  tempoRange: { min: number; max: number };
  primaryInstruments: string[];
  rhythmicPatterns: string[];
  harmonicComplexity: 'simple' | 'moderate' | 'complex' | 'atonal';
  genreInfluences: string[];
}

interface BovedaMovementSignature {
  qualityOfMotion: string;
  tempoPreference: 'slow' | 'moderate' | 'fast' | 'variable';
  spatialOrientation: 'grounded' | 'expansive' | 'contained' | 'flowing';
  gestureVocabulary: string[];
  danceInfluences: string[];
  postureCharacteristics: string[];
}

interface BovedaMultiModalSignature {
  visual: BovedaVisualSignature;
  voice: BovedaVoiceSignature;
  music: BovedaMusicSignature;
  movement: BovedaMovementSignature;
}

interface BovedaNarrativeIdentity {
  coreValues: string[];
  centralConflicts: string[];
  relationalPatterns: { archetype: string; nature: string }[];
  originMythElements: string[];
  recurringThemes: string[];
  telos: string;
}

interface BovedaInvariantMarkers {
  identityAnchors: string[];
  absoluteTaboos: string[];
  signaturePhrases: string[];
  sacredValues: string[];
  immutableTraits: string[];
}

interface BovedaEvolutionRules {
  permittedChanges: { aspect: string; maxDrift: number; conditions: string[] }[];
  protectedCore: string[];
  evolutionTriggers: { trigger: string; effect: string }[];
  changeVelocity: 'glacial' | 'slow' | 'moderate' | 'rapid';
}

export interface BovedaCharacterGenome {
  id: string;
  name: string;
  schemaVersion: string;
  createdAt: Date;
  updatedAt: Date;
  orishaConfiguration: BovedaOrishaConfig;
  kabbalisticPosition: BovedaKabbalahPosition;
  psychologicalState: BovedaPsychState;
  multiModalSignature: BovedaMultiModalSignature;
  narrativeIdentity: BovedaNarrativeIdentity;
  invariantMarkers: BovedaInvariantMarkers;
  evolutionRules: BovedaEvolutionRules;
  characterId?: string;
  seed?: number;
  tags?: string[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a deterministic hash from a genome ID
 */
function generateHash(id: string): string {
  return createHash('sha256').update(id).digest('hex').slice(0, 16);
}

/**
 * Convert camelCase to snake_case
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// ============================================================================
// BOVEDA → o8 MAPPERS
// ============================================================================

function mapOrishaConfig(config: BovedaOrishaConfig): O8OrishaConfig {
  return {
    head_orisha: config.headOrisha,
    camino: config.camino,
    secondary_influences: config.secondaryInfluences.map((inf: { orisha: string; strength: number }) => ({
      orisha: inf.orisha,
      strength: inf.strength,
    })),
    shadow_form: config.shadowForm,
  };
}

function mapKabbalahPosition(position: BovedaKabbalahPosition): O8KabbalahPosition {
  return {
    primary_sephira: position.primarySephira,
    pillar: position.pillar,
    qliphothic_shadow: position.qliphothicShadow,
    active_path: position.activePath,
    daath_relationship: position.daathRelationship,
  };
}

function mapPsychState(state: BovedaPsychState): O8PsychState {
  return {
    individuation_level: state.individuationLevel,
    hot_cool_axis: state.hotCoolAxis,
    dominant_complex: state.dominantComplex,
    shadow_integration: state.shadowIntegration,
    active_archetypes: [...state.activeArchetypes],
    trajectory: state.trajectory,
  };
}

function mapInvariants(markers: BovedaInvariantMarkers): O8Invariants {
  return {
    identity_anchors: [...markers.identityAnchors],
    absolute_taboos: [...markers.absoluteTaboos],
    signature_phrases: [...markers.signaturePhrases],
    sacred_values: [...markers.sacredValues],
    immutable_traits: [...markers.immutableTraits],
  };
}

function mapEvolutionRules(rules: BovedaEvolutionRules): O8EvolutionRules {
  return {
    permitted_changes: rules.permittedChanges.map((change: { aspect: string; maxDrift: number; conditions: string[] }) => ({
      aspect: change.aspect,
      max_drift: change.maxDrift,
      conditions: [...change.conditions],
    })),
    protected_core: [...rules.protectedCore],
    evolution_triggers: rules.evolutionTriggers.map((trigger: { trigger: string; effect: string }) => ({
      trigger: trigger.trigger,
      effect: trigger.effect,
    })),
    change_velocity: rules.changeVelocity,
  };
}

function mapVisualSignature(visual: BovedaVisualSignature): VisualDNA {
  return {
    source: 'genoma',
    color_palette: {
      primary: [...visual.primaryColors],
      secondary: [...visual.secondaryColors],
    },
    style: {
      aesthetic: visual.aestheticStyle,
      patterns: [...visual.patterns],
      textures: [...visual.textures],
      light_quality: visual.lightQuality,
    },
    symbol_motifs: [...visual.symbolMotifs],
  };
}

function mapVoiceSignature(voice: BovedaVoiceSignature): VoiceDNA {
  return {
    source: 'chromox',
    embedding: [], // Populated from CHROMOX when available
    pitch: {
      range: voice.pitchRange,
      average_hz: 0, // Populated from CHROMOX analysis
      variance: 0,
    },
    timbre: {
      qualities: [...voice.timbre],
    },
    speech_patterns: [...voice.speechPatterns],
    rhythmic_quality: voice.rhythmicQuality,
    emotional_resonance: voice.emotionalResonance,
  };
}

function mapNarrativeIdentity(narrative: BovedaNarrativeIdentity): NarrativeDNA {
  return {
    source: 'boveda',
    core_values: [...narrative.coreValues],
    central_conflicts: [...narrative.centralConflicts],
    recurring_themes: [...narrative.recurringThemes],
    telos: narrative.telos,
    origin_elements: [...narrative.originMythElements],
    relational_patterns: narrative.relationalPatterns.map(rp => ({
      archetype: rp.archetype,
      nature: rp.nature,
    })),
  };
}

function mapMovementSignature(movement: BovedaMovementSignature): MovementDNA {
  return {
    source: 'boveda',
    quality_of_motion: movement.qualityOfMotion,
    tempo_preference: movement.tempoPreference,
    spatial_orientation: movement.spatialOrientation,
    gesture_vocabulary: [...movement.gestureVocabulary],
    dance_influences: [...movement.danceInfluences],
    posture_characteristics: [...movement.postureCharacteristics],
  };
}

// ============================================================================
// o8 → BOVEDA MAPPERS (Reverse)
// ============================================================================

function reverseMapOrisha(config: O8OrishaConfig): BovedaOrishaConfig {
  return {
    headOrisha: config.head_orisha,
    camino: config.camino,
    secondaryInfluences: config.secondary_influences.map(inf => ({
      orisha: inf.orisha,
      strength: inf.strength,
    })),
    shadowForm: config.shadow_form,
  };
}

function reverseMapKabbalah(position: O8KabbalahPosition): BovedaKabbalahPosition {
  return {
    primarySephira: position.primary_sephira,
    pillar: position.pillar,
    qliphothicShadow: position.qliphothic_shadow,
    activePath: position.active_path,
    daathRelationship: position.daath_relationship,
  };
}

function reverseMapPsychState(state: O8PsychState): BovedaPsychState {
  return {
    individuationLevel: state.individuation_level,
    hotCoolAxis: state.hot_cool_axis,
    dominantComplex: state.dominant_complex,
    shadowIntegration: state.shadow_integration,
    activeArchetypes: [...state.active_archetypes],
    trajectory: state.trajectory,
  };
}

function reverseMapInvariants(markers: O8Invariants): BovedaInvariantMarkers {
  return {
    identityAnchors: [...markers.identity_anchors],
    absoluteTaboos: [...markers.absolute_taboos],
    signaturePhrases: [...markers.signature_phrases],
    sacredValues: [...markers.sacred_values],
    immutableTraits: [...markers.immutable_traits],
  };
}

function reverseMapEvolution(rules: O8EvolutionRules): BovedaEvolutionRules {
  return {
    permittedChanges: rules.permitted_changes.map(change => ({
      aspect: change.aspect,
      maxDrift: change.max_drift,
      conditions: [...change.conditions],
    })),
    protectedCore: [...rules.protected_core],
    evolutionTriggers: rules.evolution_triggers.map(trigger => ({
      trigger: trigger.trigger,
      effect: trigger.effect,
    })),
    changeVelocity: rules.change_velocity,
  };
}

function reverseMapVisual(visual?: VisualDNA): BovedaVisualSignature {
  if (!visual) {
    return {
      primaryColors: [],
      secondaryColors: [],
      patterns: [],
      textures: [],
      lightQuality: '',
      aestheticStyle: '',
      symbolMotifs: [],
    };
  }
  return {
    primaryColors: [...visual.color_palette.primary],
    secondaryColors: [...visual.color_palette.secondary],
    patterns: [...visual.style.patterns],
    textures: [...visual.style.textures],
    lightQuality: visual.style.light_quality,
    aestheticStyle: visual.style.aesthetic,
    symbolMotifs: visual.symbol_motifs ? [...visual.symbol_motifs] : [],
  };
}

function reverseMapVoice(voice?: VoiceDNA): BovedaVoiceSignature {
  if (!voice) {
    return {
      pitchRange: 'tenor',
      timbre: [],
      speechPatterns: [],
      rhythmicQuality: '',
      emotionalResonance: '',
      accentInfluences: [],
    };
  }
  return {
    pitchRange: voice.pitch.range,
    timbre: [...voice.timbre.qualities],
    speechPatterns: [...voice.speech_patterns],
    rhythmicQuality: voice.rhythmic_quality,
    emotionalResonance: voice.emotional_resonance,
    accentInfluences: [], // Not stored in o8 VoiceDNA
  };
}

function reverseMapMusic(audio?: { tempo_range?: { min: number; max: number; preferred: number }; influence_genealogy?: { primary_genre: string; secondary_genres: string[] } }): BovedaMusicSignature {
  return {
    keySignature: '',
    mode: '',
    tempoRange: audio?.tempo_range
      ? { min: audio.tempo_range.min, max: audio.tempo_range.max }
      : { min: 60, max: 180 },
    primaryInstruments: [],
    rhythmicPatterns: [],
    harmonicComplexity: 'moderate',
    genreInfluences: audio?.influence_genealogy?.secondary_genres || [],
  };
}

function reverseMapMovement(movement?: MovementDNA): BovedaMovementSignature {
  if (!movement) {
    return {
      qualityOfMotion: '',
      tempoPreference: 'moderate',
      spatialOrientation: 'grounded',
      gestureVocabulary: [],
      danceInfluences: [],
      postureCharacteristics: [],
    };
  }
  return {
    qualityOfMotion: movement.quality_of_motion,
    tempoPreference: movement.tempo_preference,
    spatialOrientation: movement.spatial_orientation,
    gestureVocabulary: [...movement.gesture_vocabulary],
    danceInfluences: [...movement.dance_influences],
    postureCharacteristics: [...movement.posture_characteristics],
  };
}

function reverseMapNarrative(narrative?: NarrativeDNA): BovedaNarrativeIdentity {
  if (!narrative) {
    return {
      coreValues: [],
      centralConflicts: [],
      relationalPatterns: [],
      originMythElements: [],
      recurringThemes: [],
      telos: '',
    };
  }
  return {
    coreValues: [...narrative.core_values],
    centralConflicts: [...narrative.central_conflicts],
    relationalPatterns: narrative.relational_patterns?.map((rp: { archetype: string; nature: string }) => ({
      archetype: rp.archetype,
      nature: rp.nature,
    })) || [],
    originMythElements: narrative.origin_elements ? [...narrative.origin_elements] : [],
    recurringThemes: [...narrative.recurring_themes],
    telos: narrative.telos,
  };
}

// ============================================================================
// MAIN CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert a BOVEDA CharacterGenome to an o8 CreatorIdentity
 *
 * @param genome - The BOVEDA genome to convert
 * @param options - Optional conversion configuration
 * @returns A new o8 CreatorIdentity
 */
export function bovedaToO8(
  genome: BovedaCharacterGenome,
  options: {
    licensing?: Partial<LicensingTerms>;
    provenance?: Partial<ProvenanceChain>;
  } = {}
): CreatorIdentity {
  const now = new Date().toISOString();

  return {
    identity_id: `o8-${generateHash(genome.id)}`,
    version: '2.0',
    created_at: genome.createdAt instanceof Date
      ? genome.createdAt.toISOString()
      : genome.createdAt,
    updated_at: genome.updatedAt instanceof Date
      ? genome.updatedAt.toISOString()
      : genome.updatedAt,

    creator: {
      name: genome.name,
      verification_level: 'none',
    },

    dna: {
      visual: mapVisualSignature(genome.multiModalSignature.visual),
      voice: mapVoiceSignature(genome.multiModalSignature.voice),
      narrative: mapNarrativeIdentity(genome.narrativeIdentity),
      movement: mapMovementSignature(genome.multiModalSignature.movement),
      // Note: audio DNA comes from STARFORGE, not BOVEDA
    },

    genome: {
      genome_id: genome.id,
      schema_version: genome.schemaVersion,
      orisha: mapOrishaConfig(genome.orishaConfiguration),
      kabbalah: mapKabbalahPosition(genome.kabbalisticPosition),
      psychological_state: mapPsychState(genome.psychologicalState),
      invariants: mapInvariants(genome.invariantMarkers),
      evolution_rules: mapEvolutionRules(genome.evolutionRules),
    },

    licensing: {
      training_rights: false,
      derivative_rights: false,
      commercial_rights: false,
      attribution_required: true,
      ...options.licensing,
    },

    provenance: {
      source_materials: genome.characterId
        ? [{ cid: genome.characterId, description: 'BOVEDA character source', relationship: 'derived_from' }]
        : [],
      ...options.provenance,
    },
  };
}

/**
 * Convert an o8 CreatorIdentity back to a BOVEDA CharacterGenome
 *
 * @param identity - The o8 identity to convert
 * @returns A new BOVEDA CharacterGenome (throws if no genome data present)
 */
export function o8ToBoveda(identity: CreatorIdentity): BovedaCharacterGenome {
  const genome = identity.genome;
  if (!genome) {
    throw new Error('Cannot convert o8 identity to BOVEDA: no genome data present');
  }

  return {
    id: genome.genome_id,
    name: identity.creator.name,
    schemaVersion: genome.schema_version,
    createdAt: new Date(identity.created_at),
    updatedAt: new Date(identity.updated_at),

    orishaConfiguration: reverseMapOrisha(genome.orisha),
    kabbalisticPosition: reverseMapKabbalah(genome.kabbalah),
    psychologicalState: reverseMapPsychState(genome.psychological_state),

    multiModalSignature: {
      visual: reverseMapVisual(identity.dna?.visual),
      voice: reverseMapVoice(identity.dna?.voice),
      music: reverseMapMusic(identity.dna?.audio),
      movement: reverseMapMovement(identity.dna?.movement),
    },

    narrativeIdentity: reverseMapNarrative(identity.dna?.narrative),
    invariantMarkers: reverseMapInvariants(genome.invariants),
    evolutionRules: reverseMapEvolution(genome.evolution_rules),
  };
}

/**
 * Merge external DNA sources into an existing o8 CreatorIdentity
 *
 * @param identity - The base identity to enhance
 * @param sources - DNA from external systems (STARFORGE, CLAROSA, CHROMOX)
 * @returns Updated identity with merged DNA
 */
export function mergeExternalDNA(
  identity: CreatorIdentity,
  sources: {
    starforge?: Partial<CreativeDNA['audio']>;
    clarosa?: { taste_vector: number[] };
    chromox?: { embedding: number[]; pitch_hz?: number; pitch_variance?: number };
  }
): CreatorIdentity {
  const updated = { ...identity };
  updated.dna = { ...identity.dna };

  // Merge STARFORGE audio DNA
  if (sources.starforge) {
    updated.dna.audio = {
      source: 'starforge',
      sonic_palette: sources.starforge.sonic_palette || {
        sub_bass: 0,
        bass: 0,
        low_mid: 0,
        mid: 0,
        high_mid: 0,
        presence: 0,
        brilliance: 0,
      },
      taste_coherence: sources.starforge.taste_coherence || 0,
      energy_profile: sources.starforge.energy_profile || {
        average: 0,
        variance: 0,
        peak_ratio: 0,
      },
      tempo_range: sources.starforge.tempo_range || {
        min: 60,
        max: 180,
        preferred: 120,
      },
      influence_genealogy: sources.starforge.influence_genealogy,
      embedding: sources.starforge.embedding,
    };
  }

  // Merge CLAROSA visual DNA (taste vector)
  if (sources.clarosa && updated.dna.visual) {
    updated.dna.visual = {
      ...updated.dna.visual,
      source: 'clarosa',
      taste_vector: sources.clarosa.taste_vector,
    };
  }

  // Merge CHROMOX voice DNA (embedding)
  if (sources.chromox && updated.dna.voice) {
    updated.dna.voice = {
      ...updated.dna.voice,
      embedding: sources.chromox.embedding,
      pitch: {
        ...updated.dna.voice.pitch,
        average_hz: sources.chromox.pitch_hz || 0,
        variance: sources.chromox.pitch_variance || 0,
      },
    };
  }

  updated.updated_at = new Date().toISOString();
  return updated;
}

/**
 * Validate that an identity has minimum required DNA for a specific use case
 */
export function validateIdentityForUseCase(
  identity: CreatorIdentity,
  useCase: 'gaming' | 'fashion' | 'music'
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  switch (useCase) {
    case 'gaming':
      // Gaming requires audio DNA and genome
      if (!identity.dna.audio) missing.push('audio DNA (from STARFORGE)');
      if (!identity.genome) missing.push('character genome (from BOVEDA)');
      break;

    case 'fashion':
      // Fashion requires visual DNA
      if (!identity.dna.visual) missing.push('visual DNA (from CLAROSA)');
      if (!identity.dna.visual?.taste_vector) missing.push('visual taste vector (768-dim)');
      break;

    case 'music':
      // Music requires audio and voice DNA
      if (!identity.dna.audio) missing.push('audio DNA (from STARFORGE)');
      if (!identity.dna.voice) missing.push('voice DNA (from CHROMOX)');
      break;
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// ============================================================================
// TYPE RE-EXPORTS (for consumers who need access to BOVEDA types without importing from boveda)
// Note: BovedaCharacterGenome is already exported as an interface above
// ============================================================================

export type {
  BovedaOrishaConfig,
  BovedaKabbalahPosition,
  BovedaPsychState,
  BovedaMultiModalSignature,
  BovedaNarrativeIdentity,
  BovedaInvariantMarkers,
  BovedaEvolutionRules,
};
