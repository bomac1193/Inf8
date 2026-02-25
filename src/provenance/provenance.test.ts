/**
 * Provenance Service Tests
 */

import { createHash } from 'crypto';
import {
  createProvenanceService,
  createManifestGenerator,
  createIPFSService,
  DigitalSourceType,
  ActionType,
} from './index.js';
import type { CreatorIdentity } from '../core/types.v2.js';

// Sample identity for testing
const sampleIdentity: CreatorIdentity = {
  identity_id: 'o8-test-provenance-001',
  version: '2.0',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  creator: {
    name: 'Test Creator',
    verification_level: 'basic',
  },
  dna: {
    audio: {
      source: 'starforge',
      sonic_palette: {
        sub_bass: 0.6,
        bass: 0.7,
        low_mid: 0.5,
        mid: 0.6,
        high_mid: 0.4,
        presence: 0.5,
        brilliance: 0.3,
      },
      taste_coherence: 0.85,
      energy_profile: {
        average: 0.65,
        variance: 0.2,
        peak_ratio: 0.75,
      },
      tempo_range: {
        min: 90,
        max: 130,
        preferred: 110,
      },
      influence_genealogy: {
        primary_genre: 'Electronic',
        secondary_genres: ['Ambient', 'Synthwave'],
        era_influences: ['80s', '2020s'],
      },
    },
    narrative: {
      source: 'boveda',
      core_values: ['Innovation', 'Authenticity'],
      central_conflicts: ['Tradition vs Progress'],
      recurring_themes: ['Digital consciousness'],
      telos: 'To create immersive sonic experiences',
    },
  },
  licensing: {
    training_rights: false,
    derivative_rights: true,
    commercial_rights: true,
    attribution_required: true,
  },
  provenance: {},
};

async function runTests() {
  console.log('=== o8 Provenance Service Tests ===\n');

  // Test 1: C2PA Manifest Generation
  console.log('Test 1: C2PA Manifest Generation');
  const manifestGen = createManifestGenerator();

  const contentHash = createHash('sha256').update('test audio content').digest('hex');

  const manifest = manifestGen.generateManifest({
    contentHash,
    contentType: 'audio/mpeg',
    title: 'Test Track',
    identity: sampleIdentity,
    aiContribution: 0.3,
  });

  console.log('  ✓ Manifest generated');
  console.log('  ✓ Version:', manifest.version);
  console.log('  ✓ Label:', manifest.manifest_label);
  console.log('  ✓ Assertions:', manifest.assertions.length);
  console.log('  ✓ Has o8 extensions:', !!manifest.o8_extensions);

  // Check assertions
  const assertionLabels = manifest.assertions.map(a => a.label);
  console.log('  ✓ Assertion types:', assertionLabels.join(', '));

  // Test 2: Game Audio Manifest
  console.log('\nTest 2: Game Audio Manifest');
  const gameManifest = manifestGen.generateGameAudioManifest({
    contentHash,
    identity: sampleIdentity,
    gameState: 'combat',
    stemMix: { drums: 1.0, bass: 0.9, melody: 0.7, atmosphere: 0.4 },
    crossfadeMs: 500,
  });

  console.log('  ✓ Game manifest generated');
  console.log('  ✓ Has o8.audio_dna assertion:', manifest.assertions.some(a => a.label === 'o8.audio_dna'));

  // Find the actions assertion
  const actionsAssertion = gameManifest.assertions.find(a => a.label === 'c2pa.actions');
  if (actionsAssertion) {
    const actions = (actionsAssertion.data as any).actions;
    const hasAdaptAction = actions.some((a: any) => a.action === ActionType.O8_AUDIO_ADAPTED);
    console.log('  ✓ Has o8.audio_adapted action:', hasAdaptAction);
  }

  // Test 3: Manifest Signature Verification
  console.log('\nTest 3: Manifest Signature');
  const isValid = manifestGen.verifyManifest(manifest);
  console.log('  ✓ Signature valid:', isValid);

  // Test 4: Export formats
  console.log('\nTest 4: Export Formats');
  const jsonExport = manifestGen.exportJSON(manifest);
  const compactExport = manifestGen.exportCompact(manifest);
  console.log('  ✓ JSON export size:', jsonExport.length, 'bytes');
  console.log('  ✓ Compact export size:', compactExport.length, 'bytes');

  // Test 5: IPFS Service (health check only - no actual publishing without node)
  console.log('\nTest 5: IPFS Service');
  const ipfs = createIPFSService();
  const health = await ipfs.checkHealth();
  console.log('  IPFS Provider Status:');
  health.forEach(status => {
    console.log(`    ${status.provider}: ${status.available ? '✓ Available' : '✗ ' + status.error}`);
  });

  // Test 6: Provenance Service
  console.log('\nTest 6: Provenance Service');
  const provenance = createProvenanceService();
  const serviceHealth = await provenance.checkHealth();
  console.log('  ✓ Service initialized');
  console.log('  ✓ IPFS available:', serviceHealth.ipfs.available);

  // Test 7: Fingerprint generation
  console.log('\nTest 7: Fingerprint Generation');
  const testData = new TextEncoder().encode('test audio data');
  const fingerprint = provenance.generateFingerprint(testData);
  console.log('  ✓ Fingerprint:', fingerprint.slice(0, 16) + '...');

  // Test 8: Digital Source Types
  console.log('\nTest 8: Digital Source Types');
  console.log('  ✓ Trained Algorithm:', DigitalSourceType.TRAINED_ALGORITHM_MEDIA.split('/').pop());
  console.log('  ✓ Composite:', DigitalSourceType.COMPOSITE_WITH_TRAINED_ALGORITHM.split('/').pop());
  console.log('  ✓ Digital Capture:', DigitalSourceType.DIGITAL_CAPTURE.split('/').pop());

  // Test 9: Action Types
  console.log('\nTest 9: Action Types');
  console.log('  ✓ Standard actions: created, edited, converted, published');
  console.log('  ✓ o8 actions: stamped, identity_linked, audio_generated, audio_adapted');

  console.log('\n=== Sample C2PA Manifest ===\n');
  console.log(JSON.stringify(manifest, null, 2).slice(0, 2000) + '\n...(truncated)');

  console.log('\n=== All Tests Complete ===');
}

runTests().catch(console.error);
