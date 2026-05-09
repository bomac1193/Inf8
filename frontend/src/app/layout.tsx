import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Nsibidi",
  description:
    "Cross-media provenance protocol. Every artifact gets one machine-readable declaration. Walk back from a final video to the LoRA, the audio, the canon photos, the training corpus.",
  keywords: ["nsibidi", "provenance", "lineage", "ai-native", "cross-media", "protocol"],
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
