import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/declarations/[id]/badge - Returns an SVG badge image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const declaration = await prisma.declaration.findUnique({
    where: { id },
  });

  if (!declaration) {
    // Return a minimal "not found" SVG
    const notFoundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="60" viewBox="0 0 280 60">
  <rect width="280" height="60" fill="#0A0A0A"/>
  <text x="140" y="35" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#8A8A8A">Declaration not found</text>
</svg>`;
    return new Response(notFoundSvg, {
      status: 404,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache",
      },
    });
  }

  const avgAI = Math.round(
    (declaration.aiComposition +
      declaration.aiArrangement +
      declaration.aiProduction +
      declaration.aiMixing +
      declaration.aiMastering) /
      5
  );

  // Truncate title for badge display
  const maxTitleLen = 28;
  const title =
    (declaration.title || "Untitled").length > maxTitleLen
      ? (declaration.title || "Untitled").substring(0, maxTitleLen) + "..."
      : declaration.title || "Untitled";

  // Truncate artist name
  const maxArtistLen = 24;
  const artist =
    declaration.artistName.length > maxArtistLen
      ? declaration.artistName.substring(0, maxArtistLen) + "..."
      : declaration.artistName;

  // Escape XML entities
  const escXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const safeTitle = escXml(title);
  const safeArtist = escXml(artist);

  const score = declaration.transparencyScore;

  // Score bar width (max 120px for the bar area)
  const barWidth = Math.round((score / 100) * 120);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="120" viewBox="0 0 340 120">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&amp;family=IBM+Plex+Mono&amp;display=swap');
    </style>
  </defs>

  <!-- Background -->
  <rect width="340" height="120" fill="#0A0A0A"/>

  <!-- Border -->
  <rect x="0.5" y="0.5" width="339" height="119" fill="none" stroke="#2A2A2A" stroke-width="1"/>

  <!-- Top section: Logo + DECLARED badge -->
  <g transform="translate(16, 16)">
    <!-- Infinity-8 symbol -->
    <text font-family="'Space Grotesk', system-ui, sans-serif" font-size="18" font-weight="500" fill="#F5F3F0">
      <tspan>&#x221E;8</tspan>
    </text>
    <text x="32" font-family="'Space Grotesk', system-ui, sans-serif" font-size="9" fill="#8A8A8A" letter-spacing="0.15em" dominant-baseline="middle" y="1">
      ARCH
    </text>

    <!-- DECLARED pill -->
    <rect x="232" y="-8" width="76" height="22" fill="#F5F3F0"/>
    <text x="270" y="7" text-anchor="middle" font-family="'Space Grotesk', system-ui, sans-serif" font-size="9" font-weight="500" fill="#0A0A0A" letter-spacing="0.12em">DECLARED</text>
  </g>

  <!-- Track title -->
  <text x="16" y="52" font-family="'Space Grotesk', system-ui, sans-serif" font-size="15" font-weight="500" fill="#F5F3F0">${safeTitle}</text>

  <!-- Artist name -->
  <text x="16" y="68" font-family="'Space Grotesk', system-ui, sans-serif" font-size="11" fill="#8A8A8A">${safeArtist}</text>

  <!-- Bottom section: Score + AI % -->
  <line x1="16" y1="80" x2="324" y2="80" stroke="#2A2A2A" stroke-width="1"/>

  <g transform="translate(16, 90)">
    <!-- Transparency Score -->
    <text font-family="'Space Grotesk', system-ui, sans-serif" font-size="8" fill="#8A8A8A" letter-spacing="0.12em">TRANSPARENCY</text>
    <text y="16" font-family="'IBM Plex Mono', monospace" font-size="16" font-weight="500" fill="#F5F3F0">${score}</text>
    <text x="28" y="16" font-family="'IBM Plex Mono', monospace" font-size="10" fill="#8A8A8A">/100</text>

    <!-- Score bar -->
    <rect x="72" y="8" width="120" height="4" fill="#1A1A1A"/>
    <rect x="72" y="8" width="${barWidth}" height="4" fill="#F5F3F0"/>

    <!-- AI % -->
    <text x="220" font-family="'Space Grotesk', system-ui, sans-serif" font-size="8" fill="#8A8A8A" letter-spacing="0.12em">AVG AI</text>
    <text x="220" y="16" font-family="'IBM Plex Mono', monospace" font-size="16" font-weight="500" fill="#F5F3F0">${avgAI}%</text>
  </g>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
