"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { keccak256, toBytes } from "viem";
import { O8RegistryABI } from "@/contracts/abis";
import { O8_CONTRACTS } from "@/lib/wagmi";

interface AIContribution {
  composition: number;
  arrangement: number;
  production: number;
  mixing: number;
  mastering: number;
}

export default function NewDeclaration() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Form state
  const [artistName, setArtistName] = useState("");
  const [daws, setDaws] = useState("");
  const [plugins, setPlugins] = useState("");
  const [aiModels, setAiModels] = useState("");
  const [ipfsCID, setIpfsCID] = useState("");
  const [methodology, setMethodology] = useState("");
  const [aiContribution, setAiContribution] = useState<AIContribution>({
    composition: 0,
    arrangement: 0,
    production: 0,
    mixing: 0,
    mastering: 0,
  });

  const updateAI = (key: keyof AIContribution, value: number) => {
    setAiContribution({ ...aiContribution, [key]: value });
  };

  // Calculate average AI and transparency score
  const avgAI =
    (aiContribution.composition +
      aiContribution.arrangement +
      aiContribution.production +
      aiContribution.mixing +
      aiContribution.mastering) /
    5;

  const transparencyScore = useCallback(() => {
    let score = 50;
    score += Math.min(methodology.length / 10, 20);
    const stackItems = daws.split(",").filter(Boolean).length + plugins.split(",").filter(Boolean).length;
    score += Math.min(stackItems * 2, 15);
    return Math.round(Math.min(score, 100));
  }, [methodology, daws, plugins]);

  const handleMint = async () => {
    if (!address || !ipfsCID || !artistName) return;

    const sha256Hash = keccak256(toBytes(ipfsCID + artistName + Date.now()));
    const tokenURI = `ipfs://${ipfsCID}`;

    writeContract({
      address: O8_CONTRACTS.registry as `0x${string}`,
      abi: O8RegistryABI,
      functionName: "mintTrack",
      args: [
        artistName, // title (using artist name for now)
        artistName,
        Math.round(aiContribution.composition * 100),
        Math.round(aiContribution.arrangement * 100),
        Math.round(aiContribution.production * 100),
        Math.round(aiContribution.mastering * 100),
        ipfsCID,
        sha256Hash,
        false, // trainingRights
        true,  // derivativeRights
        true,  // remixRights
        tokenURI,
      ],
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[640px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-2">
            Create Declaration
          </h1>
          <p className="text-[#8A8A8A]">
            Document the creative provenance of your music.
          </p>
        </div>

        {!isConnected ? (
          <div className="text-center py-16 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-[#8A8A8A] mb-6">Connect wallet to continue</p>
            <ConnectButton />
          </div>
        ) : isSuccess ? (
          <div className="text-center py-16 bg-[#1A1A1A] border border-[#4A7C59]">
            <p className="text-xs uppercase tracking-widest text-[#4A7C59] mb-4">
              Declaration Published
            </p>
            <p className="text-[#F5F3F0] mb-6">
              Your declaration has been minted on-chain.
            </p>
            <a
              href={`https://amoy.polygonscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A8A8A] hover:text-[#F5F3F0] text-sm"
            >
              View transaction
            </a>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleMint();
            }}
            className="space-y-8"
          >
            {/* Identity */}
            <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
                Identity
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                    placeholder="Your name or alias"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                    Wallet
                  </label>
                  <div
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#8A8A8A] font-mono text-sm"
                  >
                    {address}
                  </div>
                </div>
              </div>
            </section>

            {/* Creative Stack */}
            <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
                Creative Stack
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                    DAWs
                  </label>
                  <input
                    type="text"
                    value={daws}
                    onChange={(e) => setDaws(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                    placeholder="Ableton, Logic, FL Studio..."
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                    Plugins
                  </label>
                  <input
                    type="text"
                    value={plugins}
                    onChange={(e) => setPlugins(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                    placeholder="Serum, Omnisphere, FabFilter..."
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                    AI Models
                  </label>
                  <input
                    type="text"
                    value={aiModels}
                    onChange={(e) => setAiModels(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none"
                    placeholder="Suno, Udio, none..."
                  />
                </div>
              </div>
            </section>

            {/* Production Intelligence */}
            <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
                Production Intelligence
              </p>
              <p className="text-sm text-[#8A8A8A] mb-6">
                Estimate AI contribution for each phase (0-100%)
              </p>
              <div className="space-y-6">
                {[
                  { key: "composition", label: "Composition" },
                  { key: "arrangement", label: "Arrangement" },
                  { key: "production", label: "Production" },
                  { key: "mixing", label: "Mixing" },
                  { key: "mastering", label: "Mastering" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-[#8A8A8A]">{label}</label>
                      <span className="text-sm text-[#F5F3F0] font-mono">
                        {Math.round(aiContribution[key as keyof AIContribution] * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={aiContribution[key as keyof AIContribution] * 100}
                      onChange={(e) =>
                        updateAI(key as keyof AIContribution, Number(e.target.value) / 100)
                      }
                      className="w-full h-1 bg-[#2A2A2A] appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8A8A8A 0%, #8A8A8A ${aiContribution[key as keyof AIContribution] * 100}%, #2A2A2A ${aiContribution[key as keyof AIContribution] * 100}%, #2A2A2A 100%)`,
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  Methodology
                </label>
                <textarea
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none resize-none"
                  placeholder="Describe your creative process..."
                />
              </div>

              {/* Score Preview */}
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#8A8A8A]">Average AI</p>
                  <p className="text-lg text-[#F5F3F0] font-mono">
                    {Math.round(avgAI * 100)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#8A8A8A]">Transparency Score</p>
                  <p className="text-lg text-[#F5F3F0] font-mono">
                    {transparencyScore()}
                  </p>
                </div>
              </div>
            </section>

            {/* Provenance */}
            <section className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
                Provenance
              </p>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
                  IPFS CID
                </label>
                <input
                  type="text"
                  value={ipfsCID}
                  onChange={(e) => setIpfsCID(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] text-[#F5F3F0] placeholder-[#8A8A8A] focus:border-[#8A8A8A] outline-none font-mono text-sm"
                  placeholder="Qm... or bafk..."
                />
                <p className="text-xs text-[#8A8A8A] mt-2">
                  Upload your audio to IPFS first (Pinata, NFT.Storage, etc.)
                </p>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || isConfirming || !artistName || !ipfsCID}
              className="w-full py-3 px-6 bg-[#F5F3F0] text-[#0A0A0A] font-medium text-sm tracking-wide hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-100"
            >
              {isPending
                ? "Confirm in wallet..."
                : isConfirming
                ? "Publishing..."
                : "Publish Declaration"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
