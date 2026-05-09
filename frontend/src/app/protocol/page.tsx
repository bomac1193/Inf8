"use client";

import Link from "next/link";

export default function Protocol() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <article className="max-w-[800px] mx-auto px-6 md:px-16 py-24">
        <header className="mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#5A5A5A] mb-6">
            Nsibidi
          </p>
          <h1 className="font-display text-[48px] md:text-[64px] font-light text-[#F5F3F0] tracking-tight leading-tight mb-6">
            Cross-media provenance protocol.
          </h1>
          <p className="text-lg text-[#8A8A8A] leading-relaxed max-w-[560px]">
            Every artifact a tool produces gets one machine-readable
            declaration. Walk back from a final video to the LoRA, the
            audio, the canon photos, the training corpus.
          </p>
        </header>

        <section className="mb-20">
          <h2 className="font-display text-2xl md:text-3xl font-light text-[#F5F3F0] mb-8">
            What it records.
          </h2>
          <dl className="space-y-8">
            <Field
              label="Identity"
              body="Cryptographically verifiable creator. Producing system slug. Optional wallet for downstream settlement."
            />
            <Field
              label="Workflow"
              body="Content-addressed workflow blob. Every parameter that produced this artifact, hashed once, dedupe-friendly, replayable."
            />
            <Field
              label="Lineage"
              body="Parents with kind. derived_from, replaces, trained_on, sampled_from, mix_of, remix_of, cover_of. Walk the graph back to source canon material."
            />
            <Field
              label="Cross-media"
              body="cover_for, soundtrack_for, lyric_of, voice_of, scored_by, paired_with. The LoRA cites its training corpus. The synth cites the LoRA. The video cites everything."
            />
          </dl>
        </section>

        <section className="mb-20">
          <h2 className="font-display text-2xl md:text-3xl font-light text-[#F5F3F0] mb-8">
            How it works.
          </h2>
          <ol className="space-y-8 text-[#F5F3F0] leading-relaxed">
            <Step
              n="1"
              body="A tool produces an artifact. It writes a declaration to the lake at $NSIBIDI_LAKE/declarations/<media_sha>.json. No user action required."
            />
            <Step
              n="2"
              body="Declarations are content-addressed by media sha256 and indexed in SQLite. The graph is walkable in any direction by the SDK."
            />
            <Step
              n="3"
              body="Apps read the same shape from the same lake. Verify, walk lineage, settle royalties along the chain, retrain on cleanly attributed corpora."
            />
          </ol>
        </section>

        <section className="mb-20">
          <h2 className="font-display text-2xl md:text-3xl font-light text-[#F5F3F0] mb-8">
            Why.
          </h2>
          <div className="space-y-6 text-[#F5F3F0] leading-relaxed">
            <p>
              The name comes from the southeastern Nigerian writing system
              used to record clan history, contracts, and lineage on cloth,
              calabash, and skin. A record of relationships and origin.
            </p>
            <p>
              Without a shared protocol, AI-native creative work degrades
              into a pile of opaque outputs. You cannot prove which canon
              photo birthed which generation, which LoRA voiced which song,
              which storyboard slot a final-video frame came from.
            </p>
            <p>
              Nsibidi makes the graph machine-readable. Roll a slot back to
              a previous render. Settle royalties along the chain. Train
              new models on cleanly attributed corpora.
            </p>
          </div>
        </section>

        <footer className="pt-12 border-t border-[#1A1A1A]">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.25em] text-[#5A5A5A] hover:text-[#8A8A8A] transition-colors"
          >
            Back
          </Link>
        </footer>
      </article>
    </div>
  );
}


function Field({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-8">
      <dt className="text-[11px] uppercase tracking-[0.25em] text-[#5A5A5A] pt-1">
        {label}
      </dt>
      <dd className="text-[#F5F3F0] leading-relaxed">{body}</dd>
    </div>
  );
}

function Step({ n, body }: { n: string; body: string }) {
  return (
    <li className="grid grid-cols-[40px_1fr] gap-6">
      <span className="font-display text-2xl font-light text-[#5A5A5A] leading-none pt-1">
        {n}
      </span>
      <p className="text-[#F5F3F0] leading-relaxed">{body}</p>
    </li>
  );
}
