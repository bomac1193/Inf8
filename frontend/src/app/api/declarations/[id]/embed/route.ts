import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/declarations/[id]/embed - Returns a self-contained HTML widget for iframe embedding
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const declaration = await prisma.declaration.findUnique({
    where: { id },
  });

  if (!declaration) {
    const notFoundHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Not Found</title></head>
<body style="margin:0;background:#0A0A0A;color:#8A8A8A;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<p>Declaration not found</p>
</body></html>`;
    return new Response(notFoundHtml, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
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

  // Determine the base URL from the request
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("host") || "inf8.vercel.app";
  const baseUrl = `${proto}://${host}`;

  const verifyUrl = `${baseUrl}/verify/${declaration.id}`;
  const score = declaration.transparencyScore;

  // Escape HTML entities
  const escHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const title = escHtml(declaration.title || "Untitled");
  const artist = escHtml(declaration.artistName);

  // Date formatting
  const date = new Date(declaration.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // AI contribution breakdown
  const phases = [
    { label: "Comp", value: declaration.aiComposition },
    { label: "Arr", value: declaration.aiArrangement },
    { label: "Prod", value: declaration.aiProduction },
    { label: "Mix", value: declaration.aiMixing },
    { label: "Mstr", value: declaration.aiMastering },
  ];

  const phaseBarsHtml = phases
    .map(
      (p) => `
      <div style="flex:1;text-align:center;">
        <div style="font-size:11px;color:#F5F3F0;font-family:'IBM Plex Mono',monospace;margin-bottom:2px;">${p.value}%</div>
        <div style="height:2px;background:#1A1A1A;margin-bottom:3px;">
          <div style="height:2px;background:#F5F3F0;width:${p.value}%;"></div>
        </div>
        <div style="font-size:8px;color:#8A8A8A;letter-spacing:0.05em;text-transform:uppercase;">${p.label}</div>
      </div>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} - &#x221E;8 Declaration</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&family=IBM+Plex+Mono&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0A0A0A;
      font-family: 'Space Grotesk', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>
  <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" style="display:block;">
    <div style="
      background: #0A0A0A;
      border: 1px solid #2A2A2A;
      padding: 16px;
      max-width: 400px;
      transition: border-color 0.1s;
    " onmouseover="this.style.borderColor='#8A8A8A'" onmouseout="this.style.borderColor='#2A2A2A'">

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-size:16px;font-weight:500;color:#F5F3F0;">&#x221E;8</span>
          <span style="font-size:8px;color:#8A8A8A;letter-spacing:0.15em;text-transform:uppercase;">ARCH</span>
        </div>
        <div style="
          background: #F5F3F0;
          color: #0A0A0A;
          padding: 3px 10px;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        ">DECLARED</div>
      </div>

      <!-- Title & Artist -->
      <div style="margin-bottom:12px;">
        <div style="font-size:16px;font-weight:500;color:#F5F3F0;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title}</div>
        <div style="font-size:12px;color:#8A8A8A;">${artist}</div>
      </div>

      <!-- Score row -->
      <div style="display:flex;gap:24px;margin-bottom:12px;">
        <div>
          <div style="font-size:8px;color:#8A8A8A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:2px;">Transparency</div>
          <div style="display:flex;align-items:baseline;gap:3px;">
            <span style="font-size:20px;font-weight:500;color:#F5F3F0;font-family:'IBM Plex Mono',monospace;">${score}</span>
            <span style="font-size:10px;color:#8A8A8A;font-family:'IBM Plex Mono',monospace;">/100</span>
          </div>
        </div>
        <div>
          <div style="font-size:8px;color:#8A8A8A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:2px;">Avg AI</div>
          <div style="display:flex;align-items:baseline;gap:2px;">
            <span style="font-size:20px;font-weight:500;color:#F5F3F0;font-family:'IBM Plex Mono',monospace;">${avgAI}</span>
            <span style="font-size:10px;color:#8A8A8A;font-family:'IBM Plex Mono',monospace;">%</span>
          </div>
        </div>
      </div>

      <!-- AI Phase Breakdown -->
      <div style="border-top:1px solid #2A2A2A;padding-top:10px;margin-bottom:10px;">
        <div style="display:flex;gap:4px;">
          ${phaseBarsHtml}
        </div>
      </div>

      <!-- Footer -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #2A2A2A;padding-top:8px;">
        <span style="font-size:9px;color:#8A8A8A;font-family:'IBM Plex Mono',monospace;">${date}</span>
        <span style="font-size:9px;color:#8A8A8A;letter-spacing:0.05em;">Verify on &#x221E;8 &#x2192;</span>
      </div>
    </div>
  </a>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
      // Allow iframe embedding from any origin
      "X-Frame-Options": "ALLOWALL",
    },
  });
}
