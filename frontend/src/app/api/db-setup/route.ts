import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/db-setup - Check database connection and table status
export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();

    // Try to count declarations (will fail if table doesn't exist)
    const count = await prisma.declaration.count();

    return NextResponse.json({
      status: "connected",
      message: "Database is set up correctly",
      declarationsCount: count,
    });
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    let errorStack = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || "";
    } else if (typeof error === "object" && error !== null) {
      errorMessage = JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }

    console.error("Database setup error:", { errorMessage, errorStack });

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed or tables don't exist",
        error: errorMessage,
        hasEnvVar: !!process.env.DATABASE_URL,
        fix: "Run: DATABASE_URL='your-neon-url' npx prisma db push",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
