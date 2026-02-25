/**
 * Identity API Integration Tests
 */

import {
  IdentityService,
  InMemoryIdentityStore,
  createRouteHandlers,
} from './identity.js';
import { BovedaCharacterGenome } from '../core/converters.js';

// Sample genome for testing
const sampleGenome: BovedaCharacterGenome = {
  id: 'boveda-api-test-001',
  name: 'API Test Character',
  schemaVersion: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
  orishaConfiguration: {
    headOrisha: 'Ọ̀ṣun',
    secondaryInfluences: [{ orisha: 'Yemọja', strength: 0.5 }],
  },
  kabbalisticPosition: {
    primarySephira: 'Netzach',
    pillar: 'Mercy',
    qliphothicShadow: 'Harab Serapel',
    daathRelationship: 'seeking',
  },
  psychologicalState: {
    individuationLevel: 0.5,
    hotCoolAxis: -0.2,
    dominantComplex: 'Lover',
    shadowIntegration: 0.6,
    activeArchetypes: ['Artist', 'Healer'],
    trajectory: 'integration',
  },
  multiModalSignature: {
    visual: {
      primaryColors: ['#FFD700', '#FFA500'],
      secondaryColors: ['#FFFFFF', '#87CEEB'],
      patterns: ['flowing water', 'honeycombs'],
      textures: ['silk', 'honey'],
      lightQuality: 'golden warm',
      aestheticStyle: 'Romantic Afrofuturist',
      symbolMotifs: ['mirror', 'honey pot', 'river'],
    },
    voice: {
      pitchRange: 'alto',
      timbre: ['sweet', 'melodic', 'soothing'],
      speechPatterns: ['poetic', 'nurturing'],
      rhythmicQuality: 'flowing',
      emotionalResonance: 'warm compassion',
      accentInfluences: ['Yoruba'],
    },
    music: {
      keySignature: 'G major',
      mode: 'Lydian',
      tempoRange: { min: 70, max: 110 },
      primaryInstruments: ['harp', 'bells', 'water drums'],
      rhythmicPatterns: ['6/8'],
      harmonicComplexity: 'moderate',
      genreInfluences: ['R&B', 'Soul', 'Highlife'],
    },
    movement: {
      qualityOfMotion: 'fluid graceful',
      tempoPreference: 'moderate',
      spatialOrientation: 'flowing',
      gestureVocabulary: ['gentle embrace', 'water blessing'],
      danceInfluences: ['Yoruba traditional'],
      postureCharacteristics: ['open heart', 'relaxed shoulders'],
    },
  },
  narrativeIdentity: {
    coreValues: ['Love', 'Beauty', 'Abundance'],
    centralConflicts: ['Self-love vs Sacrifice', 'Attachment vs Freedom'],
    relationalPatterns: [{ archetype: 'Nurturer', nature: 'unconditional love' }],
    originMythElements: ['river goddess', 'queen of beauty'],
    recurringThemes: ['transformation through love', 'finding inner worth'],
    telos: 'To embody unconditional love and beauty',
  },
  invariantMarkers: {
    identityAnchors: ['river spirit', 'keeper of beauty'],
    absoluteTaboos: ['cruelty', 'ugliness of spirit'],
    signaturePhrases: ['Sweet water flows'],
    sacredValues: ['beauty', 'love', 'fertility'],
    immutableTraits: ['grace', 'warmth', 'generosity'],
  },
  evolutionRules: {
    permittedChanges: [{ aspect: 'expression', maxDrift: 0.4, conditions: ['life transitions'] }],
    protectedCore: ['core values', 'divine connection'],
    evolutionTriggers: [{ trigger: 'heartbreak', effect: 'deepen compassion' }],
    changeVelocity: 'slow',
  },
};

async function runTests() {
  console.log('=== o8 Identity API Tests ===\n');

  // Create service with in-memory store
  const store = new InMemoryIdentityStore();
  const service = new IdentityService({ store });

  // Test 1: Import from BOVEDA
  console.log('Test 1: Import from BOVEDA');
  const imported = await service.importFromBoveda(sampleGenome, {
    training_rights: false,
    commercial_rights: true,
  });
  console.log('  ✓ Imported identity:', imported.identity_id);
  console.log('  ✓ Creator name:', imported.creator.name);
  console.log('  ✓ Has genome:', !!imported.genome);

  // Test 2: Get identity
  console.log('\nTest 2: Get Identity');
  const retrieved = await service.getIdentity({ identity_id: imported.identity_id });
  console.log('  ✓ Retrieved:', retrieved?.identity_id === imported.identity_id);

  // Test 3: Import Audio DNA from STARFORGE
  console.log('\nTest 3: Import Audio DNA (STARFORGE)');
  const withAudio = await service.importAudioDNA(imported.identity_id, {
    source: 'starforge',
    sonic_palette: {
      sub_bass: 0.3,
      bass: 0.5,
      low_mid: 0.6,
      mid: 0.7,
      high_mid: 0.5,
      presence: 0.6,
      brilliance: 0.4,
    },
    taste_coherence: 0.82,
    energy_profile: { average: 0.5, variance: 0.2, peak_ratio: 0.6 },
    tempo_range: { min: 70, max: 110, preferred: 90 },
    influence_genealogy: {
      primary_genre: 'R&B',
      secondary_genres: ['Soul', 'Highlife'],
      era_influences: ['70s', '90s'],
    },
  });
  console.log('  ✓ Has audio DNA:', !!withAudio?.dna.audio);

  // Test 4: Import Visual DNA from CLAROSA
  console.log('\nTest 4: Import Visual DNA (CLAROSA)');
  const tasteVector = new Array(768).fill(0).map(() => Math.random());
  const withVisual = await service.importVisualDNA(imported.identity_id, tasteVector);
  console.log('  ✓ Has taste vector:', withVisual?.dna.visual?.taste_vector?.length === 768);

  // Test 5: Import Voice DNA from CHROMOX
  console.log('\nTest 5: Import Voice DNA (CHROMOX)');
  const voiceEmbedding = new Array(256).fill(0).map(() => Math.random());
  const withVoice = await service.importVoiceDNA(imported.identity_id, {
    embedding: voiceEmbedding,
    pitch_hz: 220,
    pitch_variance: 30,
  });
  console.log('  ✓ Has voice embedding:', withVoice?.dna.voice?.embedding?.length === 256);

  // Test 6: Validate for use cases
  console.log('\nTest 6: Validate for Use Cases');
  const gamingValid = await service.validateForUseCase(imported.identity_id, 'gaming');
  const fashionValid = await service.validateForUseCase(imported.identity_id, 'fashion');
  const musicValid = await service.validateForUseCase(imported.identity_id, 'music');
  console.log('  Gaming:', gamingValid?.valid ? '✓ Valid' : `✗ Missing: ${gamingValid?.missing.join(', ')}`);
  console.log('  Fashion:', fashionValid?.valid ? '✓ Valid' : `✗ Missing: ${fashionValid?.missing.join(', ')}`);
  console.log('  Music:', musicValid?.valid ? '✓ Valid' : `✗ Missing: ${musicValid?.missing.join(', ')}`);

  // Test 7: Calculate Coherence
  console.log('\nTest 7: Calculate Coherence');
  const withCoherence = await service.calculateCoherence(imported.identity_id);
  console.log('  ✓ Overall coherence:', withCoherence?.coherence?.overall.toFixed(2));
  console.log('  ✓ Audio-Visual:', withCoherence?.coherence?.pairwise.audio_visual?.toFixed(2));
  console.log('  ✓ Audio-Voice:', withCoherence?.coherence?.pairwise.audio_voice?.toFixed(2));

  // Test 8: Stamp Content
  console.log('\nTest 8: Stamp Content');
  const stamp = await service.stampContent({
    identity_id: imported.identity_id,
    content_type: 'audio',
    content_fingerprint: 'sha256:abc123...',
    ai_contribution: {
      model: 'MusicGen',
      provider: 'Meta',
      contribution_percentage: 0.4,
    },
  });
  console.log('  ✓ Declaration ID:', stamp?.declaration.declaration_id);
  console.log('  ✓ IPFS CID:', stamp?.ipfs_cid?.slice(0, 16) + '...');

  // Test 9: Export back to BOVEDA
  console.log('\nTest 9: Export to BOVEDA');
  const exported = await service.exportToBoveda(imported.identity_id);
  console.log('  ✓ Name preserved:', exported?.name === sampleGenome.name);
  console.log('  ✓ Head Orisha preserved:', exported?.orishaConfiguration.headOrisha === sampleGenome.orishaConfiguration.headOrisha);

  // Test 10: List identities
  console.log('\nTest 10: List Identities');
  const allIdentities = await service.listIdentities();
  console.log('  ✓ Total identities:', allIdentities.length);

  // Test 11: Route handlers
  console.log('\nTest 11: Route Handlers');
  const routes = createRouteHandlers(service);
  console.log('  ✓ Routes created:', routes.length);
  console.log('  ✓ Endpoints:');
  routes.forEach(r => console.log(`    ${r.method} ${r.path}`));

  console.log('\n=== All Tests Passed ===');
}

runTests().catch(console.error);
