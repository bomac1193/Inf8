"use client";

import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem";
import { O8TokenABI, O8RegistryABI } from "@/contracts/abis";
import { O8_CONTRACTS } from "@/lib/wagmi";

// Demo data for user's declarations
const USER_DECLARATIONS = [
  {
    id: "demo-1",
    title: "Midnight Synthesis",
    ai_contribution: {
      composition: 0.05,
      arrangement: 0.1,
      production: 0.15,
      mixing: 0.0,
      mastering: 0.1,
    },
    transparency_score: 93,
    created_at: "2024-12-30T12:00:00Z",
    rewards_earned: "150",
  },
  {
    id: "demo-2",
    title: "Circuit Dreams",
    ai_contribution: {
      composition: 0.3,
      arrangement: 0.25,
      production: 0.2,
      mixing: 0.05,
      mastering: 0.1,
    },
    transparency_score: 84,
    created_at: "2024-12-29T15:30:00Z",
    rewards_earned: "50",
  },
];

// Demo reward history
const REWARD_HISTORY = [
  {
    date: "Dec 30, 2024",
    track: "Midnight Synthesis",
    type: "Human-Crafted",
    typeColor: "text-[#4A7C59]",
    amount: "+100 O8",
  },
  {
    date: "Dec 30, 2024",
    track: "Midnight Synthesis",
    type: "Early Adopter",
    typeColor: "text-[#8B7355]",
    amount: "+50 O8",
  },
  {
    date: "Dec 29, 2024",
    track: "Circuit Dreams",
    type: "Transparent",
    typeColor: "text-[#8A8A8A]",
    amount: "+50 O8",
  },
];

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

export default function Dashboard() {
  const { address, isConnected } = useAccount();

  const { data: tokenBalance } = useReadContract({
    address: O8_CONTRACTS.token as `0x${string}`,
    abi: O8TokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: artistRewards } = useReadContract({
    address: O8_CONTRACTS.token as `0x${string}`,
    abi: O8TokenABI,
    functionName: "getArtistRewards",
    args: address ? [address] : undefined,
  });

  const { data: userTracks } = useReadContract({
    address: O8_CONTRACTS.registry as `0x${string}`,
    abi: O8RegistryABI,
    functionName: "getCreatorTracks",
    args: address ? [address] : undefined,
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
            Dashboard
          </p>
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-4">
            Connect to Continue
          </h1>
          <p className="text-[#8A8A8A] mb-8">
            Connect your wallet to view your declarations, token balance, and
            rewards.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6 md:px-16">
      <div className="max-w-[1120px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-2">
            Dashboard
          </p>
          <h1 className="text-2xl font-medium text-[#F5F3F0] mb-2">
            Your Declarations
          </h1>
          <p className="text-[#8A8A8A] font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Token Balance */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              O8 Token Balance
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-medium text-[#F5F3F0]">
                {tokenBalance ? formatEther(tokenBalance).slice(0, 8) : "0"}
              </span>
              <span className="text-[#8A8A8A]">O8</span>
            </div>
          </div>

          {/* Total Rewards */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              Total Rewards Earned
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-medium text-[#4A7C59]">
                {artistRewards ? formatEther(artistRewards).slice(0, 8) : "200"}
              </span>
              <span className="text-[#8A8A8A]">O8</span>
            </div>
          </div>

          {/* Tracks Verified */}
          <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A]">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-4">
              Declarations Published
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-medium text-[#F5F3F0]">
                {userTracks?.length || USER_DECLARATIONS.length}
              </span>
              <span className="text-[#8A8A8A]">on-chain</span>
            </div>
          </div>
        </div>

        {/* Your Declarations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs uppercase tracking-widest text-[#8A8A8A]">
              Published Declarations
            </p>
            <Link
              href="/new"
              className="px-4 py-2 bg-[#F5F3F0] text-[#0A0A0A] text-sm font-medium hover:opacity-85 transition-opacity duration-100"
            >
              New Declaration
            </Link>
          </div>

          {USER_DECLARATIONS.length === 0 ? (
            <div className="text-center py-16 bg-[#1A1A1A] border border-[#2A2A2A]">
              <p className="text-[#8A8A8A] mb-6">
                You haven&apos;t published any declarations yet.
              </p>
              <Link
                href="/new"
                className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
              >
                Create your first declaration
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {USER_DECLARATIONS.map((dec) => {
                const avgAI = calculateAverageAI(dec.ai_contribution);
                const badge = getBadge(avgAI);
                return (
                  <Link key={dec.id} href={`/verify/${dec.id}`}>
                    <div className="group p-6 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8A8A8A] transition-colors duration-100 cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-[#F5F3F0]">
                              {dec.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs uppercase tracking-widest text-[#F5F3F0] ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-sm text-[#8A8A8A]">
                            Published{" "}
                            {new Date(dec.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs text-[#8A8A8A]">Score</p>
                            <p className="text-lg font-medium text-[#F5F3F0]">
                              {dec.transparency_score}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#8A8A8A]">AI</p>
                            <p className="text-lg font-medium text-[#F5F3F0]">
                              {Math.round(avgAI * 100)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#8A8A8A]">Rewards</p>
                            <p className="text-lg font-medium text-[#4A7C59]">
                              +{dec.rewards_earned}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Reward History */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8A8A8A] mb-6">
            Reward History
          </p>
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0A0A0A]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-[#8A8A8A] font-normal">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-[#8A8A8A] font-normal">
                    Declaration
                  </th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-widest text-[#8A8A8A] font-normal">
                    Type
                  </th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-widest text-[#8A8A8A] font-normal">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {REWARD_HISTORY.map((reward, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-[#8A8A8A]">{reward.date}</td>
                    <td className="px-6 py-4 text-[#F5F3F0]">{reward.track}</td>
                    <td className="px-6 py-4">
                      <span className={reward.typeColor}>{reward.type}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-[#4A7C59] font-mono">
                      {reward.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
