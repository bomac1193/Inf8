import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

// Cormorant Garamond is the closest free serif to Canela. It loads via
// next/font and slots into the --font-display fallback chain via the
// CSS variable below. When the real Canela .woff2 files are dropped
// into /public/fonts/canela/, the browser automatically prefers them
// (Canela is first in the cascade in globals.css).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
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
    <html lang="en" className={cormorant.variable}>
      <body className="antialiased min-h-screen">
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
