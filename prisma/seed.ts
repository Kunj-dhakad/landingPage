import { PrismaClient } from "@navonixx/prisma-client";
import { tools } from "../src/lib/tools";
import { content } from "../src/lib/content";
import { affiliateContent } from "../src/lib/affiliate-content";
import { hashPassword } from "../src/lib/security";
const prisma = new PrismaClient();
async function main() {
  for (const t of tools)
    await prisma.freeTool.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        slug: t.slug,
        title: t.name,
        description: t.description,
        category: t.category,
        featured: [
          "word-counter",
          "json-formatter",
          "freelance-hourly-rate-calculator",
          "password-generator",
          "utm-link-builder",
          "color-palette-generator",
        ].includes(t.slug),
      },
    });
  for (const c of content)
    await prisma.resource.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, published: true },
    });
  for (const a of affiliateContent)
    await prisma.affiliateTool.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase(),
    password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12)
      throw Error("ADMIN_PASSWORD must contain at least 12 characters.");
    await prisma.adminUser.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash: hashPassword(password) },
    });
  } else
    console.log(
      "No administrator created. Set ADMIN_EMAIL and ADMIN_PASSWORD to seed one.",
    );
  await prisma.siteSetting.upsert({
    where: { key: "retentionDays" },
    update: {},
    create: { key: "retentionDays", value: "90" },
  });
  console.log(
    "Seed complete. Existing content and administrator passwords were preserved.",
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
