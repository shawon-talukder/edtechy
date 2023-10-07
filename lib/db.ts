import { PrismaClient } from "@prisma/client";

// inserting prisma into globalthis
declare global {
  var prisma: PrismaClient | undefined;
}

// the global database is either prisma from global or new prisma client
// trying to cancel hot reloading db every time
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
