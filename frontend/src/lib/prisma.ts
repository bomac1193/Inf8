import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Prisma 7.x with Neon serverless adapter for Vercel deployment
// Reuse pool and client across requests in serverless environment
function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Reuse pool if it exists
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  const adapter = new PrismaNeon(globalForPrisma.pool as any);
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
