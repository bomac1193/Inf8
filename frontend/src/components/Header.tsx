"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span
              className="text-2xl font-medium text-[#F5F3F0] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ø8
            </span>
            <span className="hidden sm:block text-xs text-[#8A8A8A] uppercase tracking-widest">
              Protocol
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/gallery"
              className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              Gallery
            </Link>
            <Link
              href="/new"
              className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              Create
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              Dashboard
            </Link>
          </nav>

          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </header>
  );
}
