"use client";

export function DeclarationBadge({ declared }: { declared: boolean }) {
  if (declared) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-[0.04em] font-medium bg-[#F5F3F0] text-[#0A0A0A]">
        <span style={{ fontFamily: "'Söhne', var(--font-space-grotesk), sans-serif" }}>Nsibidi</span>
        Declared
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-[0.04em] text-[#8A8A8A] border border-[#2A2A2A]">
      Unverified
    </span>
  );
}
