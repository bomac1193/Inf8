/**
 * Converter Tests
 * Validates BOVEDA ↔ o8 bidirectional conversion
 */

import {
  bovedaToO8,
  o8ToBoveda,
  mergeExternalDNA,
  validateIdentityForUseCase,
  BovedaCharacterGenome,
} from './converters.js';

// Sample BOVEDA genome for testing
const sampleGenome: BovedaCharacterGenome = {
  id: 'boveda-test-001',
  name: 'Test Character',
  schemaVersion: '1.0.0',
  createdAt: new Date('2026-01-15T10:00:00Z'),
  updatedAt: new Date('2026-02-07T14:30:00Z'),

  orishaConfiguration: {
    headOrisha: 'Ṣàngó',
    camino: 'Aganju',
    secondaryInfluences: [
      { orisha: 'Ògún', strength: 0.6 },
      { orisha: 'Ọya', strength: 0.4 },
    ],
    shadowForm: 'Destructive Fire',
  },

  kabbalisticPosition: {
    primarySephira: 'Geburah',
    pillar: 'Severity',
    qliphothicShadow: 'Golachab',
    activePath: 22,
    daathRelationship: 'seeking',
  },

  psychologicalState: {
    individuationLevel: 0.65,
    hotCoolAxis: 0.7,
    dominantComplex: 'Hero',
    shadowIntegration: 0.4,
    activeArchetypes: ['Warrior', 'Leader', 'Transformer'],
    trajectory: 'ascent',
  },

  multiModalSignature: {
    visual: {
      primaryColors: ['#FF0000', '#FFD700', '#8B0000'],
      secondaryColors: ['#000000', '#FFFFFF'],
      patterns: ['lightning', 'flames', 'geometric'],
      textures: ['metallic', 'rough', 'volcanic'],
      lightQuality: 'intense dramatic',
      aestheticStyle: 'Afrofuturist Royal',
      symbolMotifs: ['double-axe', 'crown', 'thunder'],
    },
    voice: {
      pitchRange: 'baritone',
      timbre: ['resonant', 'commanding', 'warm'],
      speechPatterns: ['declarative', 'rhythmic', 'emphatic'],
      rhythmicQuality: 'steady powerful',
      emotionalResonance: 'passionate intensity',
      accentInfluences: ['Yoruba', 'Caribbean'],
    },
    music: {
      keySignature: 'D minor',
      mode: 'Mixolydian',
      tempoRange: { min: 90, max: 140 },
      primaryInstruments: ['batá drums', 'agogo', 'electric guitar'],
      rhythmicPatterns: ['6/8', 'syncopated'],
      harmonicComplexity: 'moderate',
      genreInfluences: ['Afrobeat', 'Funk', 'Hard Rock'],
    },
    movement: {
      qualityOfMotion: 'explosive controlled power',
      tempoPreference: 'variable',
      spatialOrientation: 'expansive',
      gestureVocabulary: ['commanding sweep', 'grounded stomp', 'lightning strike'],
      danceInfluences: ['Capoeira', 'Traditional Yoruba'],
      postureCharacteristics: ['chest forward', 'shoulders back', 'wide stance'],
    },
  },

  narrativeIdentity: {
    coreValues: ['Justice', 'Power', 'Transformation'],
    centralConflicts: ['Control vs Chaos', 'Legacy vs Innovation'],
    relationalPatterns: [
      { archetype: 'Protector', nature: 'fierce loyalty' },
      { archetype: 'Rival', nature: 'respectful competition' },
    ],
    originMythElements: ['divine lineage', 'trial by fire', 'kingdom lost'],
    recurringThemes: ['redemption', 'righteous anger', 'leadership burden'],
    telos: 'To restore balance through transformative justice',
  },

  invariantMarkers: {
    identityAnchors: ['child of thunder', 'bearer of the double-axe'],
    absoluteTaboos: ['cowardice', 'betrayal of followers', 'injustice without response'],
    signaturePhrases: ['Kabiyesi!', 'The storm answers', 'Fire cleanses'],
    sacredValues: ['honor', 'justice', 'courage'],
    immutableTraits: ['commanding presence', 'passionate nature', 'royal bearing'],
  },

  evolutionRules: {
    permittedChanges: [
      { aspect: 'temperament', maxDrift: 0.3, conditions: ['major life event', 'spiritual growth'] },
      { aspect: 'style', maxDrift: 0.5, conditions: ['cultural exchange', 'era adaptation'] },
    ],
    protectedCore: ['divine connection', 'justice orientation', 'royal identity'],
    evolutionTriggers: [
      { trigger: 'great injustice witnessed', effect: 'increase hot axis' },
      { trigger: 'mentorship role', effect: 'increase individuation' },
    ],
    changeVelocity: 'slow',
  },
};

// Run tests
function runTests() {
  console.log('=== BOVEDA → o8 Converter Tests ===\n');

  // Test 1: Basic conversion
  console.log('Test 1: BOVEDA → o8 Conversion');
  const o8Identity = bovedaToO8(sampleGenome);

  console.log('  ✓ Identity ID:', o8Identity.identity_id);
  console.log('  ✓ Version:', o8Identity.version);
  console.log('  ✓ Creator name:', o8Identity.creator.name);
  console.log('  ✓ Has genome:', !!o8Identity.genome);
  console.log('  ✓ Has visual DNA:', !!o8Identity.dna.visual);
  console.log('  ✓ Has voice DNA:', !!o8Identity.dna.voice);
  console.log('  ✓ Has narrative DNA:', !!o8Identity.dna.narrative);
  console.log('  ✓ Has movement DNA:', !!o8Identity.dna.movement);
  console.log('');

  // Test 2: Roundtrip conversion
  console.log('Test 2: o8 → BOVEDA Roundtrip');
  const roundtrip = o8ToBoveda(o8Identity);

  console.log('  ✓ Name preserved:', roundtrip.name === sampleGenome.name);
  console.log('  ✓ Head Orisha preserved:', roundtrip.orishaConfiguration.headOrisha === sampleGenome.orishaConfiguration.headOrisha);
  console.log('  ✓ Sephira preserved:', roundtrip.kabbalisticPosition.primarySephira === sampleGenome.kabbalisticPosition.primarySephira);
  console.log('  ✓ Trajectory preserved:', roundtrip.psychologicalState.trajectory === sampleGenome.psychologicalState.trajectory);
  console.log('');

  // Test 3: Merge external DNA
  console.log('Test 3: Merge External DNA');
  const enhanced = mergeExternalDNA(o8Identity, {
    starforge: {
      sonic_palette: {
        sub_bass: 0.7,
        bass: 0.8,
        low_mid: 0.5,
        mid: 0.6,
        high_mid: 0.4,
        presence: 0.5,
        brilliance: 0.3,
      },
      taste_coherence: 0.85,
      energy_profile: { average: 0.7, variance: 0.3, peak_ratio: 0.8 },
      tempo_range: { min: 90, max: 140, preferred: 110 },
      influence_genealogy: {
        primary_genre: 'Afrobeat',
        secondary_genres: ['Funk', 'Rock'],
        era_influences: ['70s', '90s'],
      },
    },
    clarosa: {
      taste_vector: new Array(768).fill(0).map(() => Math.random()),
    },
    chromox: {
      embedding: new Array(256).fill(0).map(() => Math.random()),
      pitch_hz: 130,
      pitch_variance: 25,
    },
  });

  console.log('  ✓ Has audio DNA:', !!enhanced.dna.audio);
  console.log('  ✓ Has taste vector:', enhanced.dna.visual?.taste_vector?.length === 768);
  console.log('  ✓ Has voice embedding:', enhanced.dna.voice?.embedding?.length === 256);
  console.log('');

  // Test 4: Validate for use cases
  console.log('Test 4: Validate for Use Cases');

  const gamingCheck = validateIdentityForUseCase(o8Identity, 'gaming');
  console.log('  Gaming (before audio):', gamingCheck.valid ? '✓ Valid' : `✗ Missing: ${gamingCheck.missing.join(', ')}`);

  const gamingCheckEnhanced = validateIdentityForUseCase(enhanced, 'gaming');
  console.log('  Gaming (after audio):', gamingCheckEnhanced.valid ? '✓ Valid' : `✗ Missing: ${gamingCheckEnhanced.missing.join(', ')}`);

  const fashionCheck = validateIdentityForUseCase(enhanced, 'fashion');
  console.log('  Fashion:', fashionCheck.valid ? '✓ Valid' : `✗ Missing: ${fashionCheck.missing.join(', ')}`);

  const musicCheck = validateIdentityForUseCase(enhanced, 'music');
  console.log('  Music:', musicCheck.valid ? '✓ Valid' : `✗ Missing: ${musicCheck.missing.join(', ')}`);
  console.log('');

  // Output sample
  console.log('=== Sample o8 Identity Output ===\n');
  console.log(JSON.stringify(enhanced, null, 2));
}

// Run if executed directly
runTests();
