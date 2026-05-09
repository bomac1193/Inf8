"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Full-screen hero. Wordmark, one line, one action. */}
      <section className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-[640px] text-center">
          <h1 className="font-display text-[88px] md:text-[128px] font-light text-[#F5F3F0] tracking-tight leading-none mb-12">
            Nsibidi
          </h1>

          <p className="font-display text-xl md:text-2xl text-[#F5F3F0] font-light leading-snug mb-16">
            A record of relationships and origin.
          </p>

          <Link
            href="/new"
            className="inline-block px-8 py-3 border border-[#F5F3F0] text-[#F5F3F0] text-sm tracking-[0.04em] hover:bg-[#F5F3F0] hover:text-[#0A0A0A] transition-colors duration-150"
          >
            Begin
          </Link>
        </div>
      </section>

      {/* Quiet footer band. No noise. */}
      <footer className="px-6 py-8 border-t border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between text-[11px] tracking-[0.04em] text-[#5A5A5A]">
          <span>Cross-media provenance</span>
          <Link href="/protocol" className="hover:text-[#8A8A8A] transition-colors">
            Protocol
          </Link>
        </div>
      </footer>
    </div>
  );
}
