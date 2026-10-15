import { db } from "../src/lib/db";
import { content } from "../src/lib/content";

// Update known starter copy without replacing unrelated administrator edits.
async function main() {
  const guide = content.find((item) => item.slug === "gst-invoice-guide-for-freelancers")!;
  const records = await db.resource.findMany({
    where: { slug: { in: [guide.slug, "payment-reminder-template", "invoice-to-payment"] } },
  });
  let changed = 0;
  for (const record of records) {
    const data: Record<string, string> = {};
    if (record.slug === guide.slug) {
      if (record.title === "GST and invoices for Indian freelancers: a plain-language guide") data.title = guide.title;
      if (record.description === "When GST applies, what an invoice should include, and how to calculate it correctly.") data.description = guide.description;
      if (record.seoTitle === "GST for Freelancers in India: Invoices & Calculation Guide") data.seoTitle = guide.seoTitle!;
      if (record.seoDescription === "A plain-language guide for Indian freelancers on GST invoices and calculating GST-inclusive and exclusive amounts.") data.seoDescription = guide.seoDescription!;
      if (record.body.startsWith("# GST and invoices for Indian freelancers\n")) data.body = guide.body;
    } else {
      const body = record.body
        .replace("Indian freelancers: calculate tax correctly with the [GST calculator](/free-tools/gst-calculator).", "Use the [tax calculator](/free-tools/gst-calculator) with a rate confirmed for your transaction.")
        .replace("Indian freelancers can add tax with the [GST calculator](/free-tools/gst-calculator).", "Use USD, GBP, or CAD as agreed with your client, and confirm any applicable tax before adding it with the [tax calculator](/free-tools/gst-calculator).");
      if (body !== record.body) data.body = body;
    }
    if (Object.keys(data).length) {
      await db.resource.update({ where: { id: record.id }, data });
      changed++;
    }
  }
  const tool = await db.freeTool.findUnique({ where: { slug: "gst-calculator" } });
  if (tool) {
    const data: Record<string, string> = {};
    if (tool.title === "GST Calculator") data.title = "VAT, GST & Sales Tax Calculator";
    if (tool.description === "Add or extract GST at a rate you choose.") data.description = "Add or extract tax at a rate you choose for your transaction.";
    if (Object.keys(data).length) await db.freeTool.update({ where: { id: tool.id }, data });
  }
  console.log(`Updated ${changed} starter resources; tax tool copy synchronized.`);
}
main().catch(() => { console.error("Market copy update failed; check database connectivity."); process.exitCode = 1; }).finally(() => db.$disconnect());
