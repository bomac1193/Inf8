"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBadges, GALLERY_FILTERS, type GalleryFilterKey } from "@/lib/badges";

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

function getAILabel(dec: Declaration) {
  const avg = (dec.aiComposition + dec.aiArrangement + dec.aiProduction + dec.aiMixing + dec.aiMastering) / 5;
  if (avg === 0) return "Human";
  if (avg <= 25) return "AI-Assisted";
  if (avg <= 75) return "AI-Native";
  return "Full AI";
}

type SortOption = "date-desc" | "date-asc";

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  useEffect(() => {
    async function fetchDeclarations() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== "all") {
          params.set("badge", filter);
        }
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
    fetchDeclarations();
  }, [filter]);

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

  const filteredDeclarations = declarations
    .filter((dec) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !dec.title.toLowerCase().includes(query) &&
          !dec.artistName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-2">
            Declarations
          </h1>
          <p className="text-[#8A8A8A]">
            Browse creative provenance declarations.
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 text-xs bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] focus:border-[#8A8A8A] outline-none cursor-pointer"
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
          </select>
        </div>

        {/* Badge Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {GALLERY_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 text-xs font-medium transition-colors duration-100 ${
                filter === key
                  ? "bg-[#F5F3F0] text-[#0A0A0A]"
                  : "bg-transparent border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Declarations Grid */}
        {loading ? (
          <div className="text-center py-16 text-[#8A8A8A]">
            Loading declarations...
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeclarations.map((dec) => {
              const aiLabel = getAILabel(dec);
              const badges = getBadges(dec.badge);
              const canDelete = !dec.artistWallet && !dec.tokenId;
              return (
                <div key={dec.id} className="relative group">
                  <Link href={`/verify/${dec.id}`}>
                    <div className="p-4 bg-black border border-[#3A3A3A] hover:border-[#F5F3F0] transition-colors duration-100 cursor-pointer">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-medium text-[#F5F3F0] truncate">
                              {dec.title || "Untitled"}
                            </h3>
                          </div>
                          <p className="text-xs text-[#8A8A8A]">
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = `/profile/${encodeURIComponent(dec.artistName)}`;
                              }}
                              className="hover:text-[#F5F3F0] hover:underline cursor-pointer transition-colors duration-100"
                            >
                              {dec.artistName}
                            </span>
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-[#8A8A8A] font-mono shrink-0 ml-4">
                          {aiLabel}
                        </span>
                      </div>

                      {/* AI Contribution - Phase Bars */}
                      <div className="flex items-center gap-2 mb-2">
                        {[
                          { label: "C", value: dec.aiComposition / 100, title: "Composition" },
                          { label: "A", value: dec.aiArrangement / 100, title: "Arrangement" },
                          { label: "P", value: dec.aiProduction / 100, title: "Production" },
                          { label: "M", value: dec.aiMixing / 100, title: "Mixing" },
                          { label: "Ms", value: dec.aiMastering / 100, title: "Mastering" },
                        ].map(({ label, value, title }) => (
                          <div key={label} className="flex-1" title={`${title}: ${Math.round(value * 100)}%`}>
                            <div className="h-1 bg-[#1A1A1A]">
                              <div
                                className="h-full bg-[#F5F3F0] transition-all duration-300"
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] font-mono">
                        <div className="flex items-center gap-2">
                          {badges.slice(0, 3).map((badge) => (
                            <span key={badge.key} className="uppercase tracking-wider">
                              {badge.label}
                            </span>
                          ))}
                        </div>
                        <span>{new Date(dec.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Delete Button */}
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm(`Delete "${dec.title || 'Untitled'}"?\n\nThis cannot be undone.`)) {
                          handleDelete(dec.id, e);
                        }
                      }}
                      disabled={deleting === dec.id}
                      className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#8A8A8A] hover:text-[#F5F3F0] bg-black/80 border border-[#3A3A3A] hover:border-[#F5F3F0] transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 z-10"
                      title="Delete declaration"
                    >
                      {deleting === dec.id ? '...' : '×'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredDeclarations.length === 0 && (
          <div className="text-center py-16 text-[#8A8A8A]">
            No declarations found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
