import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

// Fraunces is a free Canela-alike. Variable font, high contrast, used
// the same way Boveda uses it. Exposes a CSS variable consumed by
// --font-heading in globals.css.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

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
    <html lang="en" className={fraunces.variable}>
      <body className="antialiased min-h-screen">
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
