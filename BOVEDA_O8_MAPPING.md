# BOVEDA → o8 Schema Mapping

**Date:** 2026-02-07
**Purpose:** Map BOVEDA Character Genome to o8 Creative Identity Protocol v2.0

---

## The Core Insight

BOVEDA's `CharacterGenome` is essentially **o8's identity specification in a different structure**. The mapping is conceptual, not just syntactic.

---

## Schema Comparison

### BOVEDA CharacterGenome

```typescript
CharacterGenome {
  id: string
  name: string
  schemaVersion: string
  createdAt: Date
  updatedAt: Date

  // Archetypal
  orishaConfiguration: OrishaConfiguration
  kabbalisticPosition: KabbalisticPosition

  // Psychological
  psychologicalState: PsychologicalState

  // Expression
  multiModalSignature: MultiModalSignature {
    visual: VisualSignature
    voice: VoiceSignature
    music: MusicSignature
    movement: MovementSignature
  }

  // Narrative
  narrativeIdentity: NarrativeIdentity
  invariantMarkers: InvariantMarkers

  // Evolution
  evolutionRules: EvolutionRules
}
```

### o8 CreatorIdentity v2.0

```typescript
CreatorIdentity {
  identity_id: string
  version: "2.0"
  created_at: string
  updated_at: string

  // Creator
  creator: CreatorInfo

  // Multi-Modal DNA
  dna: CreativeDNA {
    audio?: AudioDNA      // from STARFORGE
    visual?: VisualDNA    // from CLAROSA
    voice?: VoiceDNA      // from CHROMOX
    narrative?: NarrativeDNA  // from BOVEDA
    movement?: MovementDNA    // from BOVEDA
  }

  // Full Genome (optional)
  genome?: CharacterGenome  // from BOVEDA

  // Licensing
  licensing: LicensingTerms

  // Provenance
  provenance: ProvenanceChain

  // Coherence
  coherence?: CoherenceMetrics
}
```

---

## Field-by-Field Mapping

### Core Identity

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `id` | `genome.genome_id` | Direct copy |
| `name` | `creator.name` | Direct copy |
| `schemaVersion` | `genome.schema_version` | Direct copy |
| `createdAt` | `created_at` | Date → ISO string |
| `updatedAt` | `updated_at` | Date → ISO string |

### Orisha Configuration → genome.orisha

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `orishaConfiguration.headOrisha` | `genome.orisha.head_orisha` | camelCase → snake_case |
| `orishaConfiguration.camino` | `genome.orisha.camino` | Direct |
| `orishaConfiguration.secondaryInfluences` | `genome.orisha.secondary_influences` | Array copy |
| `orishaConfiguration.shadowForm` | `genome.orisha.shadow_form` | Direct |

### Kabbalistic Position → genome.kabbalah

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `kabbalisticPosition.primarySephira` | `genome.kabbalah.primary_sephira` | camelCase → snake_case |
| `kabbalisticPosition.pillar` | `genome.kabbalah.pillar` | Direct |
| `kabbalisticPosition.qliphothicShadow` | `genome.kabbalah.qliphothic_shadow` | camelCase → snake_case |
| `kabbalisticPosition.activePath` | `genome.kabbalah.active_path` | Direct |
| `kabbalisticPosition.daathRelationship` | `genome.kabbalah.daath_relationship` | Direct |

### Psychological State → genome.psychological_state

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `psychologicalState.individuationLevel` | `genome.psychological_state.individuation_level` | Direct |
| `psychologicalState.hotCoolAxis` | `genome.psychological_state.hot_cool_axis` | Direct |
| `psychologicalState.dominantComplex` | `genome.psychological_state.dominant_complex` | Direct |
| `psychologicalState.shadowIntegration` | `genome.psychological_state.shadow_integration` | Direct |
| `psychologicalState.activeArchetypes` | `genome.psychological_state.active_archetypes` | Direct |
| `psychologicalState.trajectory` | `genome.psychological_state.trajectory` | Direct |

### Multi-Modal Signature → dna.*

#### Visual Signature → dna.visual

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `multiModalSignature.visual.primaryColors` | `dna.visual.color_palette.primary` | Direct |
| `multiModalSignature.visual.secondaryColors` | `dna.visual.color_palette.secondary` | Direct |
| `multiModalSignature.visual.patterns` | `dna.visual.style.patterns` | Direct |
| `multiModalSignature.visual.textures` | `dna.visual.style.textures` | Direct |
| `multiModalSignature.visual.lightQuality` | `dna.visual.style.light_quality` | Direct |
| `multiModalSignature.visual.aestheticStyle` | `dna.visual.style.aesthetic` | Direct |
| `multiModalSignature.visual.symbolMotifs` | `dna.visual.symbol_motifs` | Direct |

#### Voice Signature → dna.voice

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `multiModalSignature.voice.pitchRange` | `dna.voice.pitch.range` | Direct |
| `multiModalSignature.voice.timbre` | `dna.voice.timbre.qualities` | Direct |
| `multiModalSignature.voice.speechPatterns` | `dna.voice.speech_patterns` | Direct |
| `multiModalSignature.voice.rhythmicQuality` | `dna.voice.rhythmic_quality` | Direct |
| `multiModalSignature.voice.emotionalResonance` | `dna.voice.emotional_resonance` | Direct |
| `multiModalSignature.voice.accentInfluences` | (extend) | Add to metadata |

#### Music Signature → dna.audio

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `multiModalSignature.music.keySignature` | `dna.audio.influence_genealogy.primary_genre` | Contextual |
| `multiModalSignature.music.mode` | (extend) | Add as metadata |
| `multiModalSignature.music.tempoRange` | `dna.audio.tempo_range` | Direct |
| `multiModalSignature.music.primaryInstruments` | (extend) | Add as metadata |
| `multiModalSignature.music.rhythmicPatterns` | (extend) | Add as metadata |
| `multiModalSignature.music.harmonicComplexity` | (extend) | Add as metadata |
| `multiModalSignature.music.genreInfluences` | `dna.audio.influence_genealogy.secondary_genres` | Direct |

#### Movement Signature → dna.movement

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `multiModalSignature.movement.qualityOfMotion` | `dna.movement.quality_of_motion` | Direct |
| `multiModalSignature.movement.tempoPreference` | `dna.movement.tempo_preference` | Direct |
| `multiModalSignature.movement.spatialOrientation` | `dna.movement.spatial_orientation` | Direct |
| `multiModalSignature.movement.gestureVocabulary` | `dna.movement.gesture_vocabulary` | Direct |
| `multiModalSignature.movement.danceInfluences` | `dna.movement.dance_influences` | Direct |
| `multiModalSignature.movement.postureCharacteristics` | `dna.movement.posture_characteristics` | Direct |

### Narrative Identity → dna.narrative

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `narrativeIdentity.coreValues` | `dna.narrative.core_values` | Direct |
| `narrativeIdentity.centralConflicts` | `dna.narrative.central_conflicts` | Direct |
| `narrativeIdentity.relationalPatterns` | `dna.narrative.relational_patterns` | Direct |
| `narrativeIdentity.originMythElements` | `dna.narrative.origin_elements` | Direct |
| `narrativeIdentity.recurringThemes` | `dna.narrative.recurring_themes` | Direct |
| `narrativeIdentity.telos` | `dna.narrative.telos` | Direct |

### Invariant Markers → genome.invariants

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `invariantMarkers.identityAnchors` | `genome.invariants.identity_anchors` | Direct |
| `invariantMarkers.absoluteTaboos` | `genome.invariants.absolute_taboos` | Direct |
| `invariantMarkers.signaturePhrases` | `genome.invariants.signature_phrases` | Direct |
| `invariantMarkers.sacredValues` | `genome.invariants.sacred_values` | Direct |
| `invariantMarkers.immutableTraits` | `genome.invariants.immutable_traits` | Direct |

### Evolution Rules → genome.evolution_rules

| BOVEDA Field | o8 Field | Transform |
|--------------|----------|-----------|
| `evolutionRules.permittedChanges` | `genome.evolution_rules.permitted_changes` | Direct |
| `evolutionRules.protectedCore` | `genome.evolution_rules.protected_core` | Direct |
| `evolutionRules.evolutionTriggers` | `genome.evolution_rules.evolution_triggers` | Direct |
| `evolutionRules.changeVelocity` | `genome.evolution_rules.change_velocity` | Direct |

---

## Integration with Other DNA Sources

### STARFORGE → dna.audio

STARFORGE provides Audio DNA that BOVEDA doesn't capture:

| STARFORGE Field | o8 Field |
|-----------------|----------|
| `sonicPalette.subBass` | `dna.audio.sonic_palette.sub_bass` |
| `sonicPalette.bass` | `dna.audio.sonic_palette.bass` |
| `sonicPalette.lowMid` | `dna.audio.sonic_palette.low_mid` |
| `sonicPalette.mid` | `dna.audio.sonic_palette.mid` |
| `sonicPalette.highMid` | `dna.audio.sonic_palette.high_mid` |
| `sonicPalette.presence` | `dna.audio.sonic_palette.presence` |
| `sonicPalette.brilliance` | `dna.audio.sonic_palette.brilliance` |
| `tasteCoherence` | `dna.audio.taste_coherence` |
| `influenceGenealogy` | `dna.audio.influence_genealogy` |

### CLAROSA → dna.visual

CLAROSA provides Visual DNA embeddings:

| CLAROSA Field | o8 Field |
|---------------|----------|
| `tasteVector` | `dna.visual.taste_vector` (768-dim) |
| `globalScore` | (metadata) |
| `personalScore` | (metadata) |

### CHROMOX → dna.voice

CHROMOX provides Voice DNA embeddings:

| CHROMOX Field | o8 Field |
|---------------|----------|
| `voiceEmbedding` | `dna.voice.embedding` (256-dim) |
| `pitchHz` | `dna.voice.pitch.average_hz` |
| `pitchVariance` | `dna.voice.pitch.variance` |
| `formantSignature` | `dna.voice.timbre.formant_signature` |
| `elevenlabsId` | `dna.voice.provider_ids.elevenlabs` |

---

## Licensing Mapping

BOVEDA has implicit licensing via rights module. Map to explicit o8 terms:

| BOVEDA Rights | o8 Licensing |
|---------------|--------------|
| `license.synthesis` | `licensing.derivative_rights` |
| `license.training` | `licensing.training_rights` |
| `license.commercial` | `licensing.commercial_rights` |
| `royaltySplit` | `licensing.revenue_split` |
| Consent flags | `licensing.platform_permissions` |

---

## Provenance Mapping

| BOVEDA | o8 Provenance |
|--------|---------------|
| `characterId` | `provenance.source_materials[].cid` |
| Usage ledger | `provenance.revisions` |
| Export as JSON | `provenance.ipfs_cid` (store on IPFS) |

---

## Conversion Functions

### BOVEDA → o8

```typescript
function bovedaToO8(genome: CharacterGenome): CreatorIdentity {
  return {
    identity_id: `o8-${generateHash(genome.id)}`,
    version: "2.0",
    created_at: genome.createdAt.toISOString(),
    updated_at: genome.updatedAt.toISOString(),

    creator: {
      name: genome.name,
      verification_level: "none",
    },

    dna: {
      visual: mapVisualSignature(genome.multiModalSignature.visual),
      voice: mapVoiceSignature(genome.multiModalSignature.voice),
      narrative: mapNarrativeIdentity(genome.narrativeIdentity),
      movement: mapMovementSignature(genome.multiModalSignature.movement),
      // audio comes from STARFORGE, not BOVEDA
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
    },

    provenance: {},
  };
}
```

### o8 → BOVEDA

```typescript
function o8ToBoveda(identity: CreatorIdentity): CharacterGenome {
  const genome = identity.genome;
  if (!genome) throw new Error("No genome data in identity");

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
```

---

## API Endpoints

### Unified Identity API

```
POST /api/identity
  - Create new identity from any DNA source
  - Accepts: BOVEDA genome, STARFORGE catalog, CLAROSA user, CHROMOX persona
  - Returns: o8 CreatorIdentity

GET /api/identity/:id
  - Retrieve identity with all DNA layers
  - Query params: include_dna, include_genome, include_coherence

PUT /api/identity/:id
  - Update identity (add DNA, update licensing, etc.)

POST /api/identity/:id/stamp
  - Stamp content with identity provenance
  - Returns: CreativeDeclaration

POST /api/identity/from-boveda
  - Convert BOVEDA genome to o8 identity

POST /api/identity/from-starforge
  - Import STARFORGE audio DNA into identity

POST /api/identity/from-clarosa
  - Import CLAROSA visual DNA into identity

POST /api/identity/from-chromox
  - Import CHROMOX voice DNA into identity
```

---

## Implementation Priority

### Week 1-2: Core Mapping ✅ COMPLETE (2026-02-07)
1. [x] Implement `bovedaToO8()` converter → `/src/core/converters.ts`
2. [x] Implement `o8ToBoveda()` converter → `/src/core/converters.ts`
3. [x] Create unified identity API endpoints → `/src/api/identity.ts`
4. [x] Test with sample BOVEDA genomes → `/src/core/converters.test.ts`, `/src/api/identity.test.ts`

### Week 3-4: DNA Integration ✅ COMPLETE (2026-02-07)
1. [x] Add STARFORGE → AudioDNA importer → `IdentityService.importAudioDNA()`
2. [x] Add CLAROSA → VisualDNA importer → `IdentityService.importVisualDNA()`
3. [x] Add CHROMOX → VoiceDNA importer → `IdentityService.importVoiceDNA()`
4. [x] Compute cross-modal coherence scores → `IdentityService.calculateCoherence()`

### Week 5-6: Provenance Layer ✅ COMPLETE (2026-02-07)
1. [x] Content stamping API → `IdentityService.stampContent()`
2. [x] IPFS storage → `IPFSService` with local, Pinata, Web3.storage support
3. [x] C2PA manifest generation → `C2PAManifestGenerator` with o8 extensions
4. [x] Unified provenance service → `ProvenanceService.stampContent()`, `verifyProvenance()`

---

## Files Created

### o8 Core
- `/home/sphinxy/o8/src/core/types.v2.ts` - o8 v2.0 TypeScript schema
- `/home/sphinxy/o8/src/core/converters.ts` - BOVEDA ↔ o8 bidirectional converters
- `/home/sphinxy/o8/src/core/converters.test.ts` - Converter unit tests

### o8 API
- `/home/sphinxy/o8/src/api/identity.ts` - Unified Identity API service
- `/home/sphinxy/o8/src/api/identity.test.ts` - API integration tests
- `/home/sphinxy/o8/src/api/index.ts` - API module exports

### o8 IPFS
- `/home/sphinxy/o8/src/ipfs/identity.ts` - v2 identity/declaration publishing

### o8 Provenance (NEW)
- `/home/sphinxy/o8/src/provenance/index.ts` - Provenance module exports
- `/home/sphinxy/o8/src/provenance/ipfs-service.ts` - Multi-provider IPFS service (local, Pinata, Web3.storage)
- `/home/sphinxy/o8/src/provenance/c2pa-manifest.ts` - C2PA 1.3 manifest generator with o8 extensions
- `/home/sphinxy/o8/src/provenance/provenance-service.ts` - Unified provenance stamping & verification
- `/home/sphinxy/o8/src/provenance/provenance.test.ts` - Provenance service tests

### BURN THE SQUARE Integration
- `/home/sphinxy/burn-the-square/lib/o8/index.ts` - o8 integration module
- `/home/sphinxy/burn-the-square/lib/o8/use-o8-audio.ts` - React hook for o8-powered audio

### Documentation
- `/home/sphinxy/o8/BOVEDA_O8_MAPPING.md` - This mapping document

## Next Steps

1. Implement the converter functions
2. Create the unified API
3. Connect BURN THE SQUARE to use o8 identity for game audio

---

**The BOVEDA genome IS the o8 identity. We just need to connect them.**
