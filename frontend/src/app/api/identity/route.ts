import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * o8 Identity API
 * Creates and manages CreatorIdentity records with VoiceDNA
 * Used by Vòxā for voice provenance registration
 */

// Types matching o8 core types.v2.ts
interface VoiceDNA {
  source: "chromox";
  embedding: number[];
  pitch: {
    range: "bass" | "baritone" | "tenor" | "alto" | "soprano";
    average_hz: number;
    variance: number;
  };
  timbre: {
    qualities: string[];
    formant_signature: number[];
  };
  speech_patterns: string[];
  rhythmic_quality: string;
  emotional_resonance: string;
  accent_category?: string;
  voice_type: "speech" | "singing" | "mixed";
  provider_ids: {
    chromox: string;
    rvc?: string;
    elevenlabs?: string;
    camb_ai?: string;
  };
}

interface LicensingTerms {
  training_rights: boolean;
  derivative_rights: boolean;
  commercial_rights: boolean;
  attribution_required: boolean;
  revenue_split: number;
  rate_per_second_cents?: number;
}

interface AudioFingerprint {
  sha256: string;
  duration_ms: number;
  format: string;
}

interface CreateIdentityRequest {
  creator: {
    name: string;
    wallet?: string;
    signature?: string;
    verification_level: "none" | "basic" | "enhanced" | "verified";
  };
  dna: {
    voice: VoiceDNA;
  };
  licensing: LicensingTerms;
  provenance: {
    audio_fingerprint: AudioFingerprint;
  };
}

function generateIdentityId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const hash = crypto
    .createHash("sha256")
    .update(timestamp + random)
    .digest("hex")
    .slice(0, 16);
  return `o8-${hash}`;
}

// GET /api/identity - List identities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hasVoice = searchParams.get("has_voice") === "true";
    const creatorName = searchParams.get("creator_name");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Record<string, unknown> = {};

    if (hasVoice) {
      where.voiceDNA = { not: null };
    }

    if (creatorName) {
      where.creatorName = { contains: creatorName };
    }

    const [identities, total] = await Promise.all([
      prisma.creatorIdentity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.creatorIdentity.count({ where }),
    ]);

    return NextResponse.json({
      identities,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching identities:", error);
    return NextResponse.json(
      { error: "Failed to fetch identities" },
      { status: 500 }
    );
  }
}

// POST /api/identity - Create new identity (called by Vòxā)
export async function POST(request: NextRequest) {
  try {
    const body: CreateIdentityRequest = await request.json();

    // Validate required fields
    if (!body.creator?.name) {
      return NextResponse.json(
        { error: "Creator name is required" },
        { status: 400 }
      );
    }

    if (!body.dna?.voice) {
      return NextResponse.json(
        { error: "Voice DNA is required" },
        { status: 400 }
      );
    }

    const identityId = generateIdentityId();
    const now = new Date();

    // Create the identity record
    const identity = await prisma.creatorIdentity.create({
      data: {
        identityId,
        version: "2.0",
        createdAt: now,
        updatedAt: now,

        // Creator info
        creatorName: body.creator.name,
        creatorWallet: body.creator.wallet || null,
        creatorSignature: body.creator.signature || null,
        verificationLevel: body.creator.verification_level,

        // Voice DNA (stored as JSON)
        voiceDNA: body.dna.voice as unknown as Record<string, unknown>,

        // Licensing terms
        trainingRights: body.licensing.training_rights,
        derivativeRights: body.licensing.derivative_rights,
        commercialRights: body.licensing.commercial_rights,
        attributionRequired: body.licensing.attribution_required,
        revenueSplit: body.licensing.revenue_split,
        ratePerSecondCents: body.licensing.rate_per_second_cents || null,

        // Provenance
        audioFingerprint: body.provenance.audio_fingerprint.sha256,
        audioDurationMs: body.provenance.audio_fingerprint.duration_ms,
        audioFormat: body.provenance.audio_fingerprint.format,

        // Provider reference
        chromoxPersonaId: body.dna.voice.provider_ids.chromox,
      },
    });

    // Generate a mock IPFS CID (in production, would actually upload to IPFS)
    const ipfsCid = `Qm${crypto
      .createHash("sha256")
      .update(JSON.stringify(identity))
      .digest("hex")
      .slice(0, 44)}`;

    console.log(`[o8] Created identity: ${identityId} for ${body.creator.name}`);

    return NextResponse.json(
      {
        identity: {
          identity_id: identityId,
          version: "2.0",
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
          creator: body.creator,
          dna: body.dna,
          licensing: body.licensing,
          provenance: {
            ...body.provenance,
            ipfs_cid: ipfsCid,
          },
        },
        ipfs_cid: ipfsCid,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating identity:", error);
    return NextResponse.json(
      { error: "Failed to create identity", details: String(error) },
      { status: 500 }
    );
  }
}
