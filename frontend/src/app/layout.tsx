import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Nsibidi | Cross-media provenance protocol",
  description:
    "Cross-media provenance + lineage protocol for the Alabo ecosystem. Every artifact made across Ikenga, Swanblade, Sankoré, mmuo, Boveda gets one machine-readable Nsibidi declaration. Walk back from a final video to the LoRA, the audio, the canon photos.",
  keywords: ["nsibidi", "provenance", "lineage", "alabo", "ikenga", "swanblade", "sankore", "mmuo", "boveda", "ai-native", "cross-media", "protocol"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
