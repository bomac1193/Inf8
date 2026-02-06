"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
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
  createdAt: string;
}

function calculateAverageAI(dec: Declaration) {
  return (
    (dec.aiComposition + dec.aiArrangement + dec.aiProduction + dec.aiMixing + dec.aiMastering) / 5 / 100
  );
}

export default function MyDeclarations() {
  const { address, isConnected } = useAccount();
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    async function fetchMyDeclarations() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ artist: address! });
        const res = await fetch(`/api/declarations?${params.toString()}`);
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

    fetchMyDeclarations();
  }, [address]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this declaration? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/declarations/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeclarations(declarations.filter(d => d.id !== id));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete declaration');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete declaration');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-2">
            My Declarations
          </h1>
          <p className="text-[#8A8A8A]">
            Declarations from your connected wallet.
          </p>
        </div>

        {/* Connect Wallet Prompt */}
        {!isConnected ? (
          <div className="text-center py-16">
            <p className="text-[#8A8A8A] mb-6">
              Connect your wallet to view your declarations.
            </p>
            <ConnectButton />
          </div>
        ) : loading ? (
          <div className="text-center py-16 text-[#8A8A8A]">
            Loading your declarations...
          </div>
        ) : declarations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#8A8A8A] mb-6">
              You haven't created any declarations yet.
            </p>
            <Link
              href="/new"
              className="inline-block px-6 py-3 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 transition-opacity duration-100"
            >
              Create Declaration
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
                <p className="text-xs text-[#8A8A8A] mb-1">Total</p>
                <p className="text-2xl font-medium text-[#F5F3F0]">{declarations.length}</p>
              </div>
              <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
                <p className="text-xs text-[#8A8A8A] mb-1">Avg Transparency</p>
                <p className="text-2xl font-medium text-[#F5F3F0]">
                  {Math.round(declarations.reduce((sum, d) => sum + d.transparencyScore, 0) / declarations.length)}
                </p>
              </div>
              <div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
                <p className="text-xs text-[#8A8A8A] mb-1">Minted</p>
                <p className="text-2xl font-medium text-[#F5F3F0]">
                  {declarations.filter(d => d.tokenId).length}
                </p>
              </div>
            </div>

            {/* Declarations List */}
            <div className="space-y-4">
              {declarations.map((dec) => {
                const avgAI = calculateAverageAI(dec);
                const badges = getBadges(dec.badge);
                const canDelete = !dec.artistWallet && !dec.tokenId;
                return (
                  <div key={dec.id} className="relative">
                    <Link href={`/verify/${dec.id}`}>
                      <div className="group p-6 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100 cursor-pointer">
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-medium text-[#F5F3F0]">
                                {dec.title || "Untitled"}
                              </h3>
                              {badges.map((badge) => (
                                <span
                                  key={badge.key}
                                  className="px-2 py-0.5 text-xs uppercase tracking-widest"
                                  style={{ backgroundColor: badge.color, color: badge.textColor }}
                                >
                                  {badge.label}
                                </span>
                              ))}
                              {dec.tokenId && (
                                <span className="px-2 py-0.5 text-xs uppercase tracking-widest bg-[#5A5A5A] text-[#F5F3F0]">
                                  MINTED
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#8A8A8A]">{dec.artistName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#8A8A8A]">Score</p>
                            <p className="text-lg font-medium text-[#F5F3F0]">
                              {dec.transparencyScore}
                            </p>
                          </div>
                        </div>

                        {/* AI Contribution Bars */}
                        <div className="grid grid-cols-5 gap-4 mb-4">
                          {[
                            { label: "Comp", value: dec.aiComposition / 100 },
                            { label: "Arr", value: dec.aiArrangement / 100 },
                            { label: "Prod", value: dec.aiProduction / 100 },
                            { label: "Mix", value: dec.aiMixing / 100 },
                            { label: "Master", value: dec.aiMastering / 100 },
                          ].map(({ label, value }) => (
                            <div key={label} className="text-center">
                              <div className="h-1 bg-[#2A2A2A] mb-2">
                                <div
                                  className="h-full bg-[#8A8A8A] transition-all duration-300"
                                  style={{ width: `${value * 100}%` }}
                                />
                              </div>
                              <p className="text-xs text-[#8A8A8A]">{label}</p>
                              <p className="text-xs text-[#F5F3F0]">
                                {Math.round(value * 100)}%
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                          <p className="text-xs text-[#8A8A8A]">
                            Avg AI: {Math.round(avgAI * 100)}%
                          </p>
                          <p className="text-xs text-[#8A8A8A]">
                            {new Date(dec.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Delete Button (Beta - Anonymous Only) */}
                    {canDelete && (
                      <button
                        onClick={(e) => handleDelete(dec.id, e)}
                        disabled={deleting === dec.id}
                        className="absolute top-2 right-2 px-3 py-1 text-xs bg-[#2A2A2A] text-[#8A8A8A] hover:bg-[#3A3A3A] hover:text-[#F5F3F0] border border-[#3A3A3A] transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                        title="Delete this anonymous declaration (beta testing only)"
                      >
                        {deleting === dec.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
