"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBadges } from "@/lib/badges";

interface Declaration {
  id: string;
  title: string;
  artistName: string;
  artistWallet: string | null;
  tokenId: number | null;
  aiComposition: number;
  aiArrangement: number;
  aiProduction: number;
  aiMixing: number;
  aiMastering: number;
  transparencyScore: number;
  badge: string | null;
  ipfsCID: string;
  methodology: string | null;
  daws: string | null;
  plugins: string | null;
  aiModels: string | null;
  createdAt: string;
}

function calculateAverageAI(dec: Declaration) {
  return (
    (dec.aiComposition + dec.aiArrangement + dec.aiProduction + dec.aiMixing + dec.aiMastering) / 5
  );
}

export default function ProfilePage() {
  const params = useParams();
  const artistSlug = decodeURIComponent(params.artist as string);

  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeclarations() {
      setLoading(true);
      try {
        const res = await fetch(`/api/declarations?artistName=${encodeURIComponent(artistSlug)}&limit=100`);
        if (res.ok) {
          const data = await res.json();
          setDeclarations(data.declarations);
        }
      } catch (err) {
        console.error("Failed to fetch declarations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeclarations();
  }, [artistSlug]);

  // Compute stats
  const totalDeclarations = declarations.length;
  const onChainCount = declarations.filter(d => d.tokenId).length;
  const withAudioCount = declarations.filter(d => d.ipfsCID).length;

  // Collect all unique tools
  const allTools = new Set<string>();
  declarations.forEach(d => {
    [d.daws, d.plugins, d.aiModels].forEach(field => {
      field?.split(",").map(t => t.trim()).filter(Boolean).forEach(t => allTools.add(t));
    });
  });

  // Collect all unique badges
  const allBadges = new Set<string>();
  declarations.forEach(d => {
    if (d.badge) d.badge.split(",").forEach(b => allBadges.add(b));
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[960px] mx-auto">
        {/* Profile Header */}
        <div className="mb-12">
          <Link href="/gallery" className="text-xs text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100 mb-6 inline-block">
            &larr; Gallery
          </Link>
          <h1 className="text-3xl font-medium text-[#F5F3F0] mb-2">
            {artistSlug}
          </h1>
          <p className="text-[#8A8A8A]">
            {totalDeclarations} declaration{totalDeclarations !== 1 ? "s" : ""} on ∞8 ARCH
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#8A8A8A]">
            Loading...
          </div>
        ) : totalDeclarations === 0 ? (
          <div className="text-center py-16 text-[#8A8A8A]">
            No declarations found for this artist.
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">Declarations</p>
                <p className="text-2xl font-mono text-[#F5F3F0]">{totalDeclarations}</p>
              </div>
              <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">With Audio</p>
                <p className="text-2xl font-mono text-[#F5F3F0]">{withAudioCount}</p>
              </div>
              <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
                <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">On-Chain</p>
                <p className="text-2xl font-mono text-[#F5F3F0]">{onChainCount}</p>
              </div>
            </div>

            {/* Creative Stack & Badges */}
            {(allTools.size > 0 || allBadges.size > 0) && (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {allTools.size > 0 && (
                  <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
                    <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">Creative Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(allTools).map(tool => (
                        <span key={tool} className="px-2 py-1 text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-[#8A8A8A]">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {allBadges.size > 0 && (
                  <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
                    <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">Badges Earned</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(allBadges).map(badge => (
                        <span key={badge} className="px-2 py-1 text-xs bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] font-mono">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Declarations List */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">All Declarations</p>
              {declarations.map((dec) => {
                const ai = calculateAverageAI(dec);
                const aiLabel = ai === 0 ? "Human" : ai <= 25 ? "AI-Assisted" : ai <= 75 ? "AI-Native" : "Full AI";
                return (
                  <Link key={dec.id} href={`/verify/${dec.id}`}>
                    <div className="p-4 bg-black border border-[#3A3A3A] hover:border-[#F5F3F0] transition-colors duration-100 cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#F5F3F0] truncate">
                            {dec.title || "Untitled"}
                          </h3>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] font-mono shrink-0 ml-4">
                          {aiLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {[
                          { label: "C", value: dec.aiComposition / 100 },
                          { label: "A", value: dec.aiArrangement / 100 },
                          { label: "P", value: dec.aiProduction / 100 },
                          { label: "M", value: dec.aiMixing / 100 },
                          { label: "Ms", value: dec.aiMastering / 100 },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex-1">
                            <div className="h-1 bg-[#1A1A1A]">
                              <div
                                className="h-full bg-[#F5F3F0] transition-all duration-300"
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] font-mono">
                        <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
