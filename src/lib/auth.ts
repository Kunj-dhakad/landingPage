import { auth } from "@/auth";
import { db, databaseReady } from "./db";
import { hashToken } from "./security";
export async function currentAdmin() {
  if (!databaseReady()) return null;
  const value = (await auth())?.user?.name;
  if (!value) return null;
  const session = await db.adminSession.findUnique({
    where: { tokenHash: hashToken(value) },
    include: { admin: true },
  });
  if (
    !session ||
    session.expiresAt < new Date() ||
    !session.admin.enabled ||
    !["ADMIN", "EDITOR"].includes(session.admin.role)
  )
    return null;
  return session.admin;
}
export async function requireAdmin(owner = false) {
  const admin = await currentAdmin();
  if (!admin || (owner && admin.role !== "ADMIN")) throw Error("UNAUTHORIZED");
  return admin;
}
