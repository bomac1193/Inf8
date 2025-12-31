import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Ø8 | The Origin Layer",
  description:
    "Creative provenance protocol for AI-native music. Process is provenance. Mastery is transparent.",
  keywords: ["music", "provenance", "AI", "declaration", "IPFS", "protocol"],
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
