"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <section className="min-h-[100vh] flex flex-col items-center justify-center px-6 md:px-16">
        <div className="max-w-[720px] text-center">
          <h1 className="font-display text-[64px] md:text-[88px] font-light text-[#F5F3F0] tracking-tight mb-8 leading-none">
            Nsibidi
          </h1>

          <p className="text-base uppercase tracking-[0.25em] text-[#8A8A8A] mb-10">
            Cross-media provenance protocol
          </p>

          <p className="text-lg md:text-xl text-[#F5F3F0] leading-relaxed mb-6">
            Every artifact across Ikenga, Swanblade, Sankoré, mmuo and Boveda
            gets one machine-readable Nsibidi declaration.
          </p>

          <p className="text-base text-[#8A8A8A] leading-relaxed mb-16">
            Walk back from a final video to the LoRA, the audio, the canon
            photos, the training corpus. One protocol, lossless graph.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/new"
              className="px-6 py-3 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 transition-opacity duration-100"
            >
              Create declaration
            </Link>
            <Link
              href="/gallery"
              className="px-6 py-3 border border-[#2A2A2A] text-[#F5F3F0] font-medium text-sm tracking-wide hover:border-[#8A8A8A] transition-colors duration-100"
            >
              Browse the lake
            </Link>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-light text-[#F5F3F0] mb-4">
            What Nsibidi records
          </h2>
          <p className="text-[#8A8A8A] mb-12 max-w-[640px] leading-relaxed">
            One JSON shape every tool emits when it produces a media artifact.
            Content-addressed, byte-for-byte, queryable across modalities.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] mb-4">
                Identity
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Cryptographically verifiable creator. Producing system slug
                (ikenga, swanblade, sankore, mmuo, boveda, comfyui).
                Optional wallet for downstream settlement.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] mb-4">
                Workflow
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Content-addressed workflow blob. Every parameter that
                produced this artifact, hashed once, dedupe-friendly,
                replayable.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] mb-4">
                Lineage
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                Parents with kind. derived_from, replaces, trained_on,
                sampled_from, mix_of, remix_of, cover_of. Walk the graph
                back to source canon material.
              </p>
            </div>

            <div className="p-8 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] mb-4">
                Cross-media binding
              </p>
              <p className="text-[#F5F3F0] leading-relaxed">
                cover_for, soundtrack_for, lyric_of, voice_of, scored_by,
                paired_with. The LoRA cites its training corpus. The synth
                cites the LoRA. The cover image cites the audio. The video
                cites everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem stack */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-light text-[#F5F3F0] mb-4">
            The Alabo stack writes Nsibidi
          </h2>
          <p className="text-[#8A8A8A] mb-12 max-w-[640px] leading-relaxed">
            Every tool in the ecosystem emits declarations on render.
            No third-party plugin, no bookmarklet, no manual logging.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Cell title="Ikenga" sub="Visual DNA + photo curation. Writes a declaration on every imported photo and every rendered keyframe. Carries the canon-vs-sandbox state." />
            <Cell title="Swanblade" sub="Music + LoRAs. Writes a declaration on every audio render and every LoRA training completion, with the corpus cited as parents." />
            <Cell title="Sankoré" sub="Timeline + finishing. Writes a final-video declaration on export, with the storyboard composite + audio master listed as mix_of parents." />
            <Cell title="mmuo" sub="Voice synthesis. Writes a declaration on every Modal training run + every synth render, citing the persona's reference clips." />
            <Cell title="Boveda" sub="Living character OS. Writes a declaration when a character genome is forged or remixed, citing the source identities." />
            <Cell title="ComfyUI" sub="Generation. The IkengaCapture node dual-writes the Nsibidi declaration alongside its existing provenance sidecar. Runs invisibly during normal renders." />
          </div>
        </div>
      </section>

      {/* Why this exists */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-light text-[#F5F3F0] mb-8">
            Why this protocol
          </h2>
          <div className="space-y-6 text-[#F5F3F0] leading-relaxed">
            <p>
              The name Nsibidi comes from the southeastern Nigerian writing
              system used to record clan history, contracts, and lineage on
              cloth, calabash, and skin. It is, by design, a record of
              relationships and origin.
            </p>
            <p>
              Without a shared protocol, AI-native creative work degrades
              into a pile of opaque outputs. You cannot prove which canon
              photo birthed which generation, which LoRA voiced which song,
              which storyboard slot a final-video frame came from.
            </p>
            <p>
              Nsibidi makes the graph machine-readable. Walk forward to find
              every derivative of a canon photo. Walk backward to find every
              ancestor of a final video. Settle royalties along the chain.
              Roll a slot back to a previous render. Train new models on
              cleanly attributed corpora.
            </p>
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section className="py-24 px-6 md:px-16 border-t border-[#2A2A2A]">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-light text-[#F5F3F0] mb-12">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Step n="1" title="Tools emit" body="When a tool in the Alabo stack produces an artifact, it writes a declaration to the lake at $NSIBIDI_LAKE/declarations/<media_sha>.json. No user action required." />
            <Step n="2" title="Lake aggregates" body="Declarations are content-addressed by media sha256 and indexed in SQLite. The graph is walkable in any direction by the SDK." />
            <Step n="3" title="Apps read" body="Browse, verify, walk lineage, settle, retrain. Every consumer reads the same protocol shape from the same lake." />
          </div>
        </div>
      </section>
    </div>
  );
}


function Cell({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
      <p className="font-display text-xl text-[#F5F3F0] mb-3">{title}</p>
      <p className="text-sm text-[#8A8A8A] leading-relaxed">{sub}</p>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
      <div className="font-display text-3xl font-light text-[#F5F3F0] mb-4">{n}</div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#8A8A8A] mb-3">
        {title}
      </p>
      <p className="text-[#8A8A8A] text-sm leading-relaxed">{body}</p>
    </div>
  );
}
