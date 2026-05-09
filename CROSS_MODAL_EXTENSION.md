# o8 Cross-Modal Extension (v2 spec)

Extension of o8 declarations beyond music to cover image, video, and composite (music video) media. v1's previous "not cross-modal" scoping decision is revisited here. v2 stays backwards compatible: every v1 declaration is a valid v2 declaration with `media_type: "audio"`.

Status: proposal
Last updated: 2026-05-01

---

## Motivation

1. AI-native creative work spans modalities. A single artist's deliverable in 2026 is rarely just audio. Music videos, brand campaigns, synthetic talent, AR/VR scenes all combine audio + image + video.
2. **TizitaCapture** (the ComfyUI provenance hook) is being designed now. Embedding o8 fields in image generation captures is cheap if done early and expensive to retrofit.
3. **Sembla brand pilots** will require composite provenance. Brand counsel will ask: "for this campaign asset, who contributed, what tools, what AI portion, what rights cleared." A music-only o8 can't answer for the visual half.
4. **C2PA is the industry manifest** but it's shallow on creative workflow. o8 v2 lives inside C2PA assertions while preserving the process-rich detail brands need.

---

## Backwards compatibility

Every existing v1 declaration validates as v2 if treated as `media_type: "audio"`. Migration is purely additive — no breaking changes to identity, creative_stack, production_intelligence, provenance, or revision_history.

The only field rename:
- `audio_fingerprint` → `media_fingerprint` (with optional alias kept for one major version).

---

## v2 schema (top-level)

```json
{
  "version": "2.0",
  "declaration_id": "o8-...",
  "media_type": "audio" | "image" | "video" | "composite",
  "created_at": "...",
  "updated_at": "...",

  "identity": { ... },                    // unchanged from v1
  "creative_stack": { ... },              // extended: now polymorphic by media_type
  "production_intelligence": { ... },     // extended: phases vary by media_type
  "provenance": { ... },                  // extended: source types vary by media_type
  "revision_history": [ ... ],            // unchanged

  "media_fingerprint": { ... },           // extended: shape varies by media_type

  // composite-only:
  "components": [ ... ],                  // links to other o8 declarations
  "composition": { ... }                  // how the components combine
}
```

---

## creative_stack by media_type

### media_type: "audio" (v1 behavior)
```json
"creative_stack": {
  "daws": ["Ableton Live 12"],
  "plugins": ["Serum", "FabFilter Pro-Q 3"],
  "ai_models": [{ "name": "Suno v3", "provider": "Suno" }],
  "hardware": ["Prophet Rev2"],
  "samples": [{ "name": "808 Kit", "source": "Splice", "license": "Royalty-free" }]
}
```

### media_type: "image"
```json
"creative_stack": {
  "image_tools": ["ComfyUI 0.20.1", "Photoshop 2026"],
  "ai_models": [
    { "name": "FLUX.1 dev", "provider": "Black Forest Labs", "version": "fp8_e4m3fn", "usage": "base generation" },
    { "name": "alabo_eye_v1", "provider": "self", "version": "1.0", "usage": "style LoRA" },
    { "name": "ubani_v2",    "provider": "self", "version": "2.0", "usage": "character LoRA" },
    { "name": "PuLID-FLUX",  "provider": "ByteDance", "usage": "face identity" },
    { "name": "XLabs FLUX IP-Adapter", "provider": "XLabs-AI", "usage": "outfit reference" }
  ],
  "references": [
    { "kind": "face",   "path": "_alabo/face/ubani_canonical_001.png", "rights": "owner_self" },
    { "kind": "outfit", "path": "_alabo/garments_top/silk_shirt_black_01.png", "rights": "owner_self" },
    { "kind": "style",  "path": "_alabo/style_refs/margiela_ss94_03.jpg", "rights": "fair_use_research" }
  ],
  "workflow_sha256": "...",
  "workflow_name": "IMG_local_main"
}
```

### media_type: "video"
```json
"creative_stack": {
  "video_tools": ["DaVinci Resolve 19", "After Effects 2026"],
  "ai_models": [
    { "name": "Kling v3 Omni", "provider": "Kling AI", "usage": "image-to-video" },
    { "name": "LatentSync 1.5", "provider": "ByteDance", "usage": "lip sync" },
    { "name": "RIFE 4.7", "provider": "open source", "usage": "frame interpolation" }
  ],
  "references": [
    { "kind": "starting_frame", "path": "...", "rights": "owner_self" },
    { "kind": "audio_track",    "declaration_id": "o8-audio-...", "rights": "owner_self" }
  ]
}
```

### media_type: "composite" (e.g. music video)
```json
"creative_stack": {
  "orchestration_tool": "gen.py orchestrator",
  "components": [
    { "declaration_id": "o8-audio-master-2026-05",  "role": "master_song" },
    { "declaration_id": "o8-image-frame-001",       "role": "visual_anchor", "anchor_id": "a_intro_logo" },
    { "declaration_id": "o8-image-frame-002",       "role": "visual_anchor", "anchor_id": "a_hero_chorus" },
    { "declaration_id": "o8-text-lyrics-doc-5821",  "role": "lyric_source"  }
  ]
}
```

---

## production_intelligence by media_type

`ai_contribution` becomes a polymorphic block. Phases differ per medium.

### audio (v1)
```json
"ai_contribution": {
  "composition": 0.6,
  "arrangement": 0.3,
  "production": 0.2,
  "mixing": 0,
  "mastering": 0
}
```

### image
```json
"ai_contribution": {
  "composition": 0.7,
  "lighting": 0.5,
  "pose": 0.3,
  "style": 0.8,
  "inpainting": 0,
  "upscaling": 0.4
}
```

### video
```json
"ai_contribution": {
  "frame_generation": 0.9,
  "motion": 0.8,
  "lip_sync": 0.95,
  "color_grade": 0.2,
  "editing": 0
}
```

### composite (music video)
```json
"ai_contribution": {
  "audio_share":  { ...declaration.production_intelligence.ai_contribution },
  "visual_share": { ...declaration.production_intelligence.ai_contribution },
  "weighted_overall": 0.65
}
```

---

## provenance.source_material by media_type

```json
// audio
"source_material": [
  { "kind": "stem",   "ipfs_cid": "Qm..." },
  { "kind": "sample", "ipfs_cid": "Qm..." }
]

// image
"source_material": [
  { "kind": "training_dataset",  "name": "ubani_v2_real_only_23",  "rights_proof": "ipfs://Qm..." },
  { "kind": "reference_face",    "ipfs_cid": "Qm..." },
  { "kind": "reference_outfit",  "ipfs_cid": "Qm..." }
]

// video
"source_material": [
  { "kind": "starting_frame", "ipfs_cid": "Qm..." },
  { "kind": "audio_master",   "declaration_id": "o8-..." }
]
```

---

## media_fingerprint by media_type

```json
// audio (v1)
"media_fingerprint": {
  "type": "audio",
  "sha256": "...",
  "duration_ms": 213450,
  "format": "wav",
  "sample_rate": 48000,
  "bit_depth": 24
}

// image
"media_fingerprint": {
  "type": "image",
  "sha256": "...",
  "perceptual_hash": "...",       // pHash or aHash
  "embedding_hash": "...",         // hash of DINOv2 embedding for semantic dedup
  "format": "png",
  "width": 832,
  "height": 1216,
  "color_profile": "sRGB"
}

// video
"media_fingerprint": {
  "type": "video",
  "sha256": "...",
  "duration_ms": 30000,
  "frame_rate": 24,
  "width": 1080,
  "height": 1920,
  "codec": "h264",
  "audio_track_sha256": "..."
}

// composite
"media_fingerprint": {
  "type": "composite",
  "sha256": "...",                 // hash of the rendered final
  "components_sha256": ["...", "..."]  // member declarations' fingerprints
}
```

---

## Composite-only fields

For music videos and similar combined media:

```json
"components": [
  { "declaration_id": "o8-audio-...", "role": "master_song" },
  { "declaration_id": "o8-image-...", "role": "anchor", "anchor_id": "a_intro_logo", "appears_at_seconds": [0, 12] },
  { "declaration_id": "o8-image-...", "role": "anchor", "anchor_id": "a_hero_chorus", "appears_at_seconds": [36, 60, 84, 108, 132, 156] }
],
"composition": {
  "schema_ref": "MUSIC_VIDEO_SCHEMA.md",
  "cut_id": "full_mv",
  "render_engine": "gen.py orchestrator",
  "watermark_method": "exif+stego"
}
```

This makes a music video declaration **lossless** — every component declaration is reachable, every anchor's contribution is timestamped, the composition rule (from MUSIC_VIDEO_SCHEMA) is referenced, the render engine and watermark method are pinned.

---

## Relationship to C2PA

Not competition. C2PA defines a manifest format embedded in media files that says "this content is signed by X with these edit/origin assertions." o8 v2 is much richer on the *creative process* but C2PA has industry adoption.

**Recommended posture: o8 v2 declarations are embedded in C2PA manifests as a custom assertion.** You get C2PA's industry-wide verification surface AND o8's process richness.

```
C2PA manifest
├── standard assertions (signed origin, edits, hash)
└── custom assertion: "io.inf8.declaration"
    └── full o8 v2 JSON
```

Adobe / Microsoft / BBC verify the C2PA half. Brands' legal teams read the o8 half.

---

## Relationship to Vaulted

Vaulted's `LoraArtifact.consent_attestation` JSONB field is naturally an o8 v2 fragment. A LoRA's o8 declaration goes inside that field. Inference outputs (`GeneratedOutput`) carry their own o8 declaration referencing the LoRA's.

This means: the moment a Sembla brand buyer runs an inference, the resulting image has a complete o8 chain — the LoRA's declaration, the inference call's declaration, optionally a composite declaration if multiple LoRAs stacked. Audit-grade by default.

---

## Adoption sequence

| Phase | Action | Effort |
|---|---|---|
| 0 | Embed v2 fields in TizitaCapture sidecar JSON for every ComfyUI generation | Free, part of TizitaCapture build |
| 1 | Add v2 schema validation to o8 backend | 2-3 days |
| 2 | Update o8 frontend to handle non-audio media types in declaration view | 2-3 days |
| 3 | Composite declaration support (music video, brand campaigns) | 3-5 days |
| 4 | C2PA integration: embed o8 declarations as custom assertions in PNG/MP4 metadata | 3-5 days |

Phase 0 unblocks the rest. The TizitaCapture node being built next can write o8 v2 JSON natively, even before the o8 backend understands the new fields. Backfill becomes trivial later.

---

## Open questions

1. Should `references` be inline (full JSON of each ref) or by IPFS CID only? Inline is bigger but self-describing offline.
2. Do composite declarations sign their components, or just reference them? Signing creates a tamper-evident bundle.
3. Should `ai_contribution` use percentages (0.0-1.0) for image phases too, or move to a categorical scale (none / minor / co-author / primary)?
4. Where does `consent_attestation` live for face LoRAs — in `provenance` or as a top-level v2 field? (Argument for top-level: legally distinct from creative provenance.)

---

## Net move

Tag every Tizita / ComfyUI generation with o8 v2 from Phase 0 of TizitaCapture. Cost is zero. Benefit compounds. By the time Sembla runs its first brand pilot, every output already carries audit-grade provenance. No retrofit. No manual reconstruction.
