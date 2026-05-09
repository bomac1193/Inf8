"use client";

import { useState } from "react";

interface DeclarationLite {
  id: string;
  artistWallet: string | null;
  canonState?: string;
}

const STATES = ["sandbox", "promoted", "canon"] as const;
type State = (typeof STATES)[number];

const LABELS: Record<State, string> = {
  sandbox: "Sandbox",
  promoted: "Promoted",
  canon: "Canon",
};

const HELP: Record<State, string> = {
  sandbox: "Private to your feed. Not visible on the gallery.",
  promoted: "Public. Listed on the gallery.",
  canon: "Public and surfaced as a canon work on the home page.",
};

export function CanonStrip<T extends DeclarationLite>({
  declaration,
  address,
  onChange,
}: {
  declaration: T;
  address: string | undefined;
  onChange: (next: T) => void;
}) {
  const [busy, setBusy] = useState<"promote" | "demote" | null>(null);

  const isOwner =
    !!address &&
    !!declaration.artistWallet &&
    address.toLowerCase() === declaration.artistWallet.toLowerCase();

  if (!isOwner) return null;

  const current = (declaration.canonState as State) || "sandbox";
  const idx = STATES.indexOf(current);
  const canPromote = idx < STATES.length - 1;
  const canDemote = idx > 0;

  const move = async (direction: "promote" | "demote") => {
    setBusy(direction);
    try {
      const res = await fetch(`/api/declarations/${declaration.id}/canon`, {
        method: direction === "promote" ? "POST" : "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || res.statusText);
      }
      const j = await res.json();
      onChange({ ...declaration, canonState: j.canonState });
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-4 bg-[#141414] border border-[#1F1F1F] mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <p className="text-[10px] tracking-[0.04em] text-[#8A8A8A] shrink-0">
            Curation
          </p>
          <div className="flex items-center gap-1">
            {STATES.map((s, i) => (
              <span
                key={s}
                className="text-[10px] tracking-[0.04em]"
                style={{
                  color: i <= idx ? "#F5F3F0" : "#5A5A5A",
                }}
              >
                {LABELS[s]}
                {i < STATES.length - 1 && (
                  <span className="text-[#3A3A3A] mx-1.5">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canDemote && (
            <button
              onClick={() => move("demote")}
              disabled={busy !== null}
              className="px-3 py-1.5 text-[10px] tracking-[0.04em] text-[#8A8A8A] border border-[#2A2A2A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100 disabled:opacity-50"
            >
              {busy === "demote" ? "..." : "Demote"}
            </button>
          )}
          {canPromote && (
            <button
              onClick={() => move("promote")}
              disabled={busy !== null}
              className="px-3 py-1.5 text-[10px] tracking-[0.04em] text-[#0A0A0A] bg-[#F5F3F0] hover:opacity-85 transition-opacity duration-100 disabled:opacity-50"
            >
              {busy === "promote"
                ? "..."
                : current === "sandbox"
                ? "Promote"
                : "Canonize"}
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] text-[#5A5A5A] mt-2 leading-relaxed">
        {HELP[current]}
      </p>
    </div>
  );
}
