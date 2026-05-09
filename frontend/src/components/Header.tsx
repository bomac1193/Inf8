"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-display text-2xl font-light text-[#F5F3F0] tracking-tight">
              Nsibidi
            </span>
            <span className="hidden sm:block text-[11px] text-[#8A8A8A] tracking-[0.04em]">
              Provenance
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
              href="/my-declarations"
              className="text-sm text-[#8A8A8A] hover:text-[#F5F3F0] transition-opacity duration-100"
            >
              My Declarations
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

          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const connected = mounted && account && chain;

              return (
                <div
                  {...(!mounted && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none" as const,
                      userSelect: "none" as const,
                    },
                  })}
                  className="flex items-center gap-3"
                >
                  {connected ? (
                    <>
                      {chain.unsupported ? (
                        <button
                          onClick={openChainModal}
                          className="px-3 py-1.5 text-xs tracking-[0.04em] border border-[#8B4049] text-[#8B4049] hover:bg-[#8B4049] hover:text-[#F5F3F0] transition-colors duration-100"
                        >
                          Wrong network
                        </button>
                      ) : (
                        <button
                          onClick={openChainModal}
                          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-xs text-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain"}
                              src={chain.iconUrl}
                              className="w-3 h-3"
                              style={{ background: chain.iconBackground }}
                            />
                          )}
                        </button>
                      )}
                      <button
                        onClick={openAccountModal}
                        className="px-3 py-1.5 text-xs font-mono text-[#8A8A8A] border border-[#2A2A2A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
                      >
                        {account.displayName}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={openConnectModal}
                      className="px-3 py-1.5 text-xs tracking-[0.04em] text-[#8A8A8A] border border-[#2A2A2A] hover:border-[#8A8A8A] hover:text-[#F5F3F0] transition-colors duration-100"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  );
}
