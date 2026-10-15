import { PrismaClient } from "@navonixx/prisma-client";
import { databaseConnectionUrl } from "./database-connection";
const globalDb = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalDb.prisma ?? new PrismaClient({
  datasources: { db: { url: databaseConnectionUrl(process.env.DATABASE_URL) } },
});
if (process.env.NODE_ENV !== "production") globalDb.prisma = db;
export const databaseReady = () => Boolean(process.env.DATABASE_URL);
