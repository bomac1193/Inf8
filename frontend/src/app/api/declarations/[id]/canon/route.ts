import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/declarations/[id]/canon
// Walk a declaration's curation state forward: sandbox -> promoted -> canon.
// Only the artist wallet that signed the declaration can promote.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const callerWallet = (body.wallet || "").toLowerCase();

    if (!callerWallet) {
      return NextResponse.json(
        { error: "Connected wallet required" },
        { status: 401 }
      );
    }

    const declaration = await prisma.declaration.findUnique({ where: { id } });
    if (!declaration) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!declaration.artistWallet) {
      return NextResponse.json(
        { error: "Anonymous declarations cannot be promoted" },
        { status: 403 }
      );
    }

    if (declaration.artistWallet.toLowerCase() !== callerWallet) {
      return NextResponse.json(
        { error: "Only the artist wallet can promote this declaration" },
        { status: 403 }
      );
    }

    const next: Record<string, string> = {
      sandbox: "promoted",
      promoted: "canon",
      canon: "canon",
    };
    const nextState = next[declaration.canonState] ?? "promoted";

    const updated = await prisma.declaration.update({
      where: { id },
      data: { canonState: nextState },
    });

    return NextResponse.json({
      id: updated.id,
      canonState: updated.canonState,
      previous: declaration.canonState,
    });
  } catch (error) {
    console.error("Error promoting declaration:", error);
    return NextResponse.json(
      { error: "Failed to promote" },
      { status: 500 }
    );
  }
}

// DELETE /api/declarations/[id]/canon
// Demote one step: canon -> promoted -> sandbox.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const callerWallet = (body.wallet || "").toLowerCase();

    if (!callerWallet) {
      return NextResponse.json(
        { error: "Connected wallet required" },
        { status: 401 }
      );
    }

    const declaration = await prisma.declaration.findUnique({ where: { id } });
    if (!declaration) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (
      !declaration.artistWallet ||
      declaration.artistWallet.toLowerCase() !== callerWallet
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prev: Record<string, string> = {
      canon: "promoted",
      promoted: "sandbox",
      sandbox: "sandbox",
    };
    const nextState = prev[declaration.canonState] ?? "sandbox";

    const updated = await prisma.declaration.update({
      where: { id },
      data: { canonState: nextState },
    });

    return NextResponse.json({
      id: updated.id,
      canonState: updated.canonState,
      previous: declaration.canonState,
    });
  } catch (error) {
    console.error("Error demoting declaration:", error);
    return NextResponse.json({ error: "Failed to demote" }, { status: 500 });
  }
}
