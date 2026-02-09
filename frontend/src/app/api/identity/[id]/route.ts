import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/identity/[id] - Get identity by ID
 * Used by Boveda and other services to fetch licensing terms
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find by identityId first, then by cuid
    const identity = await prisma.creatorIdentity.findFirst({
      where: {
        OR: [{ identityId: id }, { id: id }],
      },
    });

    if (!identity) {
      return NextResponse.json(
        { error: "Identity not found" },
        { status: 404 }
      );
    }

    // Format response to match o8 types.v2.ts CreatorIdentity
    const response = {
      identity_id: identity.identityId,
      version: identity.version,
      created_at: identity.createdAt.toISOString(),
      updated_at: identity.updatedAt.toISOString(),
      creator: {
        name: identity.creatorName,
        wallet: identity.creatorWallet,
        signature: identity.creatorSignature,
        verification_level: identity.verificationLevel,
      },
      dna: {
        voice: identity.voiceDNA,
        audio: identity.audioDNA,
        visual: identity.visualDNA,
        narrative: identity.narrativeDNA,
      },
      genome: identity.genome,
      licensing: {
        training_rights: identity.trainingRights,
        derivative_rights: identity.derivativeRights,
        commercial_rights: identity.commercialRights,
        attribution_required: identity.attributionRequired,
        revenue_split: identity.revenueSplit,
        rate_per_second_cents: identity.ratePerSecondCents,
      },
      provenance: {
        audio_fingerprint: identity.audioFingerprint
          ? {
              sha256: identity.audioFingerprint,
              duration_ms: identity.audioDurationMs,
              format: identity.audioFormat,
            }
          : undefined,
        ipfs_cid: identity.ipfsCid,
        blockchain_tx: identity.blockchainTx,
      },
      coherence: identity.coherenceOverall
        ? {
            overall: identity.coherenceOverall,
            pairwise: identity.coherencePairwise,
            computed_at: identity.updatedAt.toISOString(),
          }
        : undefined,
      // Provider references
      provider_refs: {
        chromox_persona_id: identity.chromoxPersonaId,
        boveda_genome_id: identity.bovedaGenomeId,
        starforge_catalog_id: identity.starforgeCatalogId,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching identity:", error);
    return NextResponse.json(
      { error: "Failed to fetch identity" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/identity/[id] - Update identity
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Find existing identity
    const existing = await prisma.creatorIdentity.findFirst({
      where: {
        OR: [{ identityId: id }, { id: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Identity not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    const updated = await prisma.creatorIdentity.update({
      where: { id: existing.id },
      data: {
        // Creator info (only name can be updated)
        creatorName: body.creator?.name ?? existing.creatorName,

        // DNA updates
        voiceDNA: body.dna?.voice ?? existing.voiceDNA,
        audioDNA: body.dna?.audio ?? existing.audioDNA,
        visualDNA: body.dna?.visual ?? existing.visualDNA,
        narrativeDNA: body.dna?.narrative ?? existing.narrativeDNA,
        genome: body.genome ?? existing.genome,

        // Licensing updates
        trainingRights: body.licensing?.training_rights ?? existing.trainingRights,
        derivativeRights: body.licensing?.derivative_rights ?? existing.derivativeRights,
        commercialRights: body.licensing?.commercial_rights ?? existing.commercialRights,
        attributionRequired: body.licensing?.attribution_required ?? existing.attributionRequired,
        revenueSplit: body.licensing?.revenue_split ?? existing.revenueSplit,
        ratePerSecondCents: body.licensing?.rate_per_second_cents ?? existing.ratePerSecondCents,

        // Provider refs
        chromoxPersonaId: body.provider_refs?.chromox_persona_id ?? existing.chromoxPersonaId,
        bovedaGenomeId: body.provider_refs?.boveda_genome_id ?? existing.bovedaGenomeId,
        starforgeCatalogId: body.provider_refs?.starforge_catalog_id ?? existing.starforgeCatalogId,

        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      identity_id: updated.identityId,
      updated_at: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating identity:", error);
    return NextResponse.json(
      { error: "Failed to update identity" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/identity/[id] - Delete identity
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find existing identity
    const existing = await prisma.creatorIdentity.findFirst({
      where: {
        OR: [{ identityId: id }, { id: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Identity not found" },
        { status: 404 }
      );
    }

    await prisma.creatorIdentity.delete({
      where: { id: existing.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting identity:", error);
    return NextResponse.json(
      { error: "Failed to delete identity" },
      { status: 500 }
    );
  }
}
