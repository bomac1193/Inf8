"use client";

import { use, useState } from "react";
import Link from "next/link";

// Demo data matching the new declaration schema
const DEMO_DECLARATIONS: Record<
  string,
  {
    id: string;
    title: string;
    artist: string;
    wallet: string;
    ai_contribution: {
      composition: number;
      arrangement: number;
      production: number;
      mixing: number;
      mastering: number;
    };
    transparency_score: number;
    methodology: string;
    creative_stack: {
      daws: string[];
      plugins: string[];
      ai_models: string[];
    };
    provenance: {
      ipfs_cid: string;
      sha256: string;
    };
    consent: {
      training_rights: boolean;
      derivative_rights: boolean;
      remix_rights: boolean;
    };
    created_at: string;
  }
> = {
  "demo-1": {
    id: "demo-1",
    title: "Midnight Synthesis",
    artist: "Neural Echo",
    wallet: "0x1234567890abcdef1234567890abcdef12345678",
    ai_contribution: {
      composition: 0.05,
      arrangement: 0.1,
      production: 0.15,
      mixing: 0.0,
      mastering: 0.1,
    },
    transparency_score: 93,
    methodology:
      "AI-assisted melody exploration using Suno for initial sketches. All production, arrangement, and mixing done manually in Ableton. Mastering used iZotope Ozone with AI-assisted EQ suggestions.",
    creative_stack: {
      daws: ["Ableton Live 12"],
      plugins: ["Serum", "Omnisphere", "FabFilter Pro-Q 3", "iZotope Ozone"],
      ai_models: ["Suno v3.5"],
    },
    provenance: {
      ipfs_cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
      sha256:
        "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    consent: {
      training_rights: false,
      derivative_rights: true,
      remix_rights: true,
    },
    created_at: "2024-12-30T12:00:00Z",
  },
  "demo-2": {
    id: "demo-2",
    title: "Circuit Dreams",
    artist: "Analog Heart",
    wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    ai_contribution: {
      composition: 0.3,
      arrangement: 0.25,
      production: 0.2,
      mixing: 0.05,
      mastering: 0.1,
    },
    transparency_score: 84,
    methodology:
      "Collaborative AI composition using Udio for initial chord progressions and melodic ideas. Human-directed arrangement with AI-suggested transitions. Manual mixing with light AI assistance on mastering chain.",
    creative_stack: {
      daws: ["Logic Pro X", "Ableton Live 12"],
      plugins: ["Arturia V Collection", "Native Instruments Komplete"],
      ai_models: ["Udio", "AIVA"],
    },
    provenance: {
      ipfs_cid: "QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX",
      sha256:
        "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    },
    consent: {
      training_rights: true,
      derivative_rights: true,
      remix_rights: true,
    },
    created_at: "2024-12-29T15:30:00Z",
  },
  "demo-3": {
    id: "demo-3",
    title: "Human Touch",
    artist: "Organic Waves",
    wallet: "0x7890abcdef1234567890abcdef1234567890abcd",
    ai_contribution: {
      composition: 0.0,
      arrangement: 0.0,
      production: 0.0,
      mixing: 0.0,
      mastering: 0.05,
    },
    transparency_score: 100,
    methodology:
      "Fully human-crafted composition and production. Only AI involvement was automated gain staging during mastering preparation.",
    creative_stack: {
      daws: ["Pro Tools"],
      plugins: ["Waves SSL Bundle", "UAD Neve"],
      ai_models: [],
    },
    provenance: {
      ipfs_cid: "QmR4nFjTu18TyANgC65ArLMJFHZBf5GQMX4QbY5mDEFvN1",
      sha256:
        "0xa591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    },
    consent: {
      training_rights: false,
      derivative_rights: false,
      remix_rights: true,
    },
    created_at: "2024-12-08T09:15:00Z",
  },
  "demo-4": {
    id: "demo-4",
    title: "Sovereign Sound",
    artist: "No AI Please",
    wallet: "0xdef1234567890abcdef1234567890abcdef123456",
    ai_contribution: {
      composition: 0.0,
      arrangement: 0.0,
      production: 0.0,
      mixing: 0.0,
      mastering: 0.0,
    },
    transparency_score: 100,
    methodology: "100% human creation. No AI tools used at any stage.",
    creative_stack: {
      daws: ["Ableton Live 11"],
      plugins: ["Analog hardware only"],
      ai_models: [],
    },
    provenance: {
      ipfs_cid: "QmP8jTG1m9GSDJLCbeWhVSVgEzCPNwE9h5vcvTfzEyGN3j",
      sha256:
        "0x6dcd4ce23d88e2ee9568ba546c007c63d9131c1b",
    },
    consent: {
      training_rights: false,
      derivative_rights: false,
      remix_rights: false,
    },
    created_at: "2024-12-05T18:00:00Z",
  },
  "demo-5": {
    id: "demo-5",
    title: "Full Consent EP",
    artist: "Open Source Music",
    wallet: "0x567890abcdef1234567890abcdef1234567890ab",
    ai_contribution: {
      composition: 0.45,
      arrangement: 0.4,
      production: 0.35,
      mixing: 0.1,
      mastering: 0.2,
    },
    transparency_score: 70,
    methodology:
      "Heavy AI collaboration across all phases. Used multiple generative models for composition and arrangement. Human curation and selection of AI outputs. AI-assisted mixing with manual fine-tuning.",
    creative_stack: {
      daws: ["FL Studio", "Ableton Live 12"],
      plugins: ["Serum", "Vital", "Splice samples"],
      ai_models: ["Suno", "Udio", "Stable Audio"],
    },
    provenance: {
      ipfs_cid: "QmVHi8TRMVoF7f4YJwKZSPPVXVBK8QhMvCLNmJQk7NSmKE",
      sha256:
        "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    },
    consent: {
      training_rights: true,
      derivative_rights: true,
      remix_rights: true,
    },
    created_at: "2024-12-01T21:45:00Z",
  },
};

function calculateAverageAI(contrib: {
  composition: number;
  arrangement: number;
  production: number;
  mixing: number;
  mastering: number;
}) {
  return (
    (contrib.composition +
      contrib.arrangement +
      contrib.production +
      contrib.mixing +
      contrib.mastering) /
    5
  );
}

function getBadge(avgAI: number): { label: string; color: string } {
  if (avgAI === 0) return { label: "SOVEREIGN", color: "bg-[#4A7C59]" };
  if (avgAI < 0.1) return { label: "HUMAN-CRAFTED", color: "bg-[#4A7C59]" };
  if (avgAI < 0.3) return { label: "AI-ASSISTED", color: "bg-[#8B7355]" };
  return { label: "AI-COLLABORATIVE", color: "bg-[#8A8A8A]" };
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const declaration = DEMO_DECLARATIONS[id];
  const [copied, setCopied] = useState(false);

  if (!declaration) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
            Not Found
          </p>
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-4">
            Declaration Not Found
          </h1>
          <p className="text-[#8A8A8A] mb-8">
            This declaration does not exist or has been removed.
          </p>
          <Link
            href="/gallery"
            className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
          >
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const avgAI = calculateAverageAI(declaration.ai_contribution);
  const badge = getBadge(avgAI);

  const exportData = {
    version: "1.0",
    declaration_id: `o8-${declaration.provenance.ipfs_cid.slice(0, 12)}`,
    identity: {
      primary_artist: {
        name: declaration.artist,
        wallet: declaration.wallet,
      },
    },
    creative_stack: declaration.creative_stack,
    production_intelligence: {
      ai_contribution: declaration.ai_contribution,
      methodology: declaration.methodology,
    },
    provenance: declaration.provenance,
    transparency_score: declaration.transparency_score,
    created_at: declaration.created_at,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[960px] mx-auto">
        {/* Back link */}
        <Link
          href="/gallery"
          className="inline-block text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100 mb-12"
        >
          ← Back to Gallery
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
              Declaration
            </p>
            <h1 className="text-3xl font-medium text-[#F5F3F0] mb-2">
              {declaration.title}
            </h1>
            <p className="text-[#8A8A8A]">{declaration.artist}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span
              className={`px-3 py-1 text-xs uppercase tracking-widest text-[#F5F3F0] ${badge.color}`}
            >
              {badge.label}
            </span>
            <p className="text-xs text-[#8A8A8A]">
              {new Date(declaration.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Transparency Score */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              Transparency Score
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-medium text-[#F5F3F0]">
                {declaration.transparency_score}
              </span>
              <span className="text-[#8A8A8A]">/ 100</span>
            </div>
            <div className="h-1 bg-[#2A2A2A]">
              <div
                className="h-full bg-[#8A8A8A] transition-all duration-300"
                style={{ width: `${declaration.transparency_score}%` }}
              />
            </div>
          </div>

          {/* Average AI */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              Average AI Contribution
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-medium text-[#F5F3F0]">
                {Math.round(avgAI * 100)}
              </span>
              <span className="text-[#8A8A8A]">%</span>
            </div>
            <div className="h-1 bg-[#2A2A2A]">
              <div
                className="h-full bg-[#8A8A8A] transition-all duration-300"
                style={{ width: `${avgAI * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Contribution Breakdown */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] mb-8">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
            Production Intelligence
          </p>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { label: "Composition", value: declaration.ai_contribution.composition },
              { label: "Arrangement", value: declaration.ai_contribution.arrangement },
              { label: "Production", value: declaration.ai_contribution.production },
              { label: "Mixing", value: declaration.ai_contribution.mixing },
              { label: "Mastering", value: declaration.ai_contribution.mastering },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-medium text-[#F5F3F0] mb-1">
                  {Math.round(value * 100)}%
                </p>
                <p className="text-xs text-[#8A8A8A]">{label}</p>
                <div className="h-1 bg-[#2A2A2A] mt-2">
                  <div
                    className="h-full bg-[#8A8A8A] transition-all duration-300"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Methodology */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
              Methodology
            </p>
            <p className="text-[#F5F3F0] leading-relaxed">
              {declaration.methodology}
            </p>
          </div>
        </div>

        {/* Creative Stack & Consent - Side by side on desktop */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Creative Stack */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Creative Stack
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#8A8A8A] mb-1">DAWs</p>
                <p className="text-[#F5F3F0]">
                  {declaration.creative_stack.daws.join(", ") || "None specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8A8A8A] mb-1">Plugins</p>
                <p className="text-[#F5F3F0]">
                  {declaration.creative_stack.plugins.join(", ") || "None specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8A8A8A] mb-1">AI Models</p>
                <p className="text-[#F5F3F0]">
                  {declaration.creative_stack.ai_models.length > 0
                    ? declaration.creative_stack.ai_models.join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
              Usage Consent
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">AI Training</span>
                <span
                  className={
                    declaration.consent.training_rights
                      ? "text-[#4A7C59]"
                      : "text-[#8B4049]"
                  }
                >
                  {declaration.consent.training_rights ? "Allowed" : "Denied"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">Derivatives</span>
                <span
                  className={
                    declaration.consent.derivative_rights
                      ? "text-[#4A7C59]"
                      : "text-[#8B4049]"
                  }
                >
                  {declaration.consent.derivative_rights ? "Allowed" : "Denied"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8A8A]">Remixes</span>
                <span
                  className={
                    declaration.consent.remix_rights
                      ? "text-[#4A7C59]"
                      : "text-[#8B4049]"
                  }
                >
                  {declaration.consent.remix_rights ? "Allowed" : "Denied"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Provenance */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] mb-8">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
            Provenance
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#8A8A8A] mb-1">Artist Wallet</p>
              <p className="text-[#F5F3F0] font-mono text-sm break-all">
                {declaration.wallet}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#8A8A8A] mb-1">IPFS CID</p>
              <a
                href={`https://ipfs.io/ipfs/${declaration.provenance.ipfs_cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F3F0] font-mono text-sm hover:text-[#8A8A8A] transition-colors duration-100"
              >
                {declaration.provenance.ipfs_cid}
              </a>
            </div>
            <div>
              <p className="text-xs text-[#8A8A8A] mb-1">SHA-256 Hash</p>
              <p className="text-[#F5F3F0] font-mono text-sm break-all">
                {declaration.provenance.sha256}
              </p>
            </div>
          </div>
        </div>

        {/* JSON Export */}
        <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
              Declaration Export
            </p>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs uppercase tracking-widest border border-[#2A2A2A] text-[#8A8A8A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
            >
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>
          <pre
            className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] overflow-x-auto text-xs text-[#8A8A8A]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {JSON.stringify(exportData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
