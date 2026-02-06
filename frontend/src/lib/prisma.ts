import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7.x with config system - database URL configured in prisma.config.ts
// Simple singleton pattern for database connections
// Type assertion needed due to Prisma 7 config system - URL comes from prisma.config.ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient({} as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
