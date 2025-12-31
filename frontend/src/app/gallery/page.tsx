"use client";

import { useState } from "react";
import Link from "next/link";

// Demo data - will be replaced with IPFS declarations
const DEMO_DECLARATIONS = [
  {
    id: "demo-1",
    title: "Midnight Synthesis",
    artist: "Neural Echo",
    ai_contribution: {
      composition: 0.05,
      arrangement: 0.1,
      production: 0.15,
      mixing: 0.0,
      mastering: 0.1,
    },
    transparency_score: 93,
    methodology: "AI-assisted melody exploration with human production",
    created_at: "2024-12-15",
  },
  {
    id: "demo-2",
    title: "Circuit Dreams",
    artist: "Analog Heart",
    ai_contribution: {
      composition: 0.3,
      arrangement: 0.25,
      production: 0.2,
      mixing: 0.05,
      mastering: 0.1,
    },
    transparency_score: 84,
    methodology: "Collaborative AI composition with manual mixing",
    created_at: "2024-12-10",
  },
  {
    id: "demo-3",
    title: "Human Touch",
    artist: "Organic Waves",
    ai_contribution: {
      composition: 0.0,
      arrangement: 0.0,
      production: 0.0,
      mixing: 0.0,
      mastering: 0.05,
    },
    transparency_score: 100,
    methodology: "Fully human-crafted with AI mastering assistance",
    created_at: "2024-12-08",
  },
  {
    id: "demo-4",
    title: "Sovereign Sound",
    artist: "No AI Please",
    ai_contribution: {
      composition: 0.0,
      arrangement: 0.0,
      production: 0.0,
      mixing: 0.0,
      mastering: 0.0,
    },
    transparency_score: 100,
    methodology: "100% human creation, no AI tools used",
    created_at: "2024-12-05",
  },
  {
    id: "demo-5",
    title: "Full Consent EP",
    artist: "Open Source Music",
    ai_contribution: {
      composition: 0.45,
      arrangement: 0.4,
      production: 0.35,
      mixing: 0.1,
      mastering: 0.2,
    },
    transparency_score: 70,
    methodology: "Heavy AI collaboration across all phases",
    created_at: "2024-12-01",
  },
];

type FilterType = "all" | "humanOnly" | "aiAssisted" | "highScore";

function calculateAverageAI(contrib: typeof DEMO_DECLARATIONS[0]["ai_contribution"]) {
  return (
    (contrib.composition +
      contrib.arrangement +
      contrib.production +
      contrib.mixing +
      contrib.mastering) /
    5
  );
}

export default function Gallery() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDeclarations = DEMO_DECLARATIONS.filter((dec) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !dec.title.toLowerCase().includes(query) &&
        !dec.artist.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    const avgAI = calculateAverageAI(dec.ai_contribution);

    switch (filter) {
      case "humanOnly":
        return avgAI < 0.2;
      case "aiAssisted":
        return avgAI >= 0.2;
      case "highScore":
        return dec.transparency_score >= 90;
      default:
        return true;
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
            Browse verified creative provenance declarations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search declarations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
          />
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "humanOnly", label: "Human-Crafted" },
              { key: "aiAssisted", label: "AI-Assisted" },
              { key: "highScore", label: "Score 90+" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-100 ${
                  filter === key
                    ? "bg-[#F5F3F0] text-[#0A0A0A]"
                    : "bg-transparent border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Declarations Grid */}
        <div className="space-y-4">
          {filteredDeclarations.map((dec) => {
            const avgAI = calculateAverageAI(dec.ai_contribution);
            return (
              <Link key={dec.id} href={`/verify/${dec.id}`}>
                <div className="group p-6 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100 cursor-pointer">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-[#F5F3F0] mb-1">
                        {dec.title}
                      </h3>
                      <p className="text-sm text-[#8A8A8A]">{dec.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#8A8A8A]">Score</p>
                      <p className="text-lg font-medium text-[#F5F3F0]">
                        {dec.transparency_score}
                      </p>
                    </div>
                  </div>

                  {/* AI Contribution Bars */}
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {[
                      { label: "Comp", value: dec.ai_contribution.composition },
                      { label: "Arr", value: dec.ai_contribution.arrangement },
                      { label: "Prod", value: dec.ai_contribution.production },
                      { label: "Mix", value: dec.ai_contribution.mixing },
                      { label: "Master", value: dec.ai_contribution.mastering },
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
                    <p className="text-xs text-[#8A8A8A]">{dec.created_at}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredDeclarations.length === 0 && (
          <div className="text-center py-16 text-[#8A8A8A]">
            No declarations found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
