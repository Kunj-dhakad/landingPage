import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { mkdir, writeFile } from "node:fs/promises";
import { content } from "../src/lib/content";
const pdf = await PDFDocument.create();
pdf.setTitle("NavoNixx — AI Business Growth Toolkit");
pdf.setAuthor("NavoNixx");
pdf.setSubject(
  "Practical prompts, templates, workflows, and freelancer resources",
);
const regular = await pdf.embedFont(StandardFonts.Helvetica),
  bold = await pdf.embedFont(StandardFonts.HelveticaBold);
let page = pdf.addPage([595, 842]),
  y = 760;
const navy = rgb(0.03, 0.08, 0.19),
  blue = rgb(0.15, 0.39, 0.92),
  muted = rgb(0.34, 0.4, 0.5);
function newPage() {
  page = pdf.addPage([595, 842]);
  y = 765;
  page.drawText("NAVONIXX  /  AI BUSINESS GROWTH TOOLKIT", {
    x: 48,
    y: 802,
    size: 8,
    font: bold,
    color: blue,
  });
}
const clean = (s: string) =>
  s
    .replaceAll("→", " > ")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7e\n]/g, "");
const body = content.find((c) => c.kind === "toolkit")!.body;
for (const raw of body.split("\n")) {
  const line = clean(raw);
  if (!line.trim()) {
    y -= 9;
    continue;
  }
  const heading = line.startsWith("#");
  const level = line.match(/^#+/)?.[0].length || 0;
  const size = level === 1 ? 28 : level === 2 ? 18 : level === 3 ? 12 : 10;
  const font = heading ? bold : regular;
  if (heading) y -= level === 1 ? 0 : 14;
  const words = line.replace(/^#+\s*/, "").split(/\s+/);
  let wrapped = "";
  const rows: string[] = [];
  for (const word of words) {
    const next = wrapped ? wrapped + " " + word : word;
    if (font.widthOfTextAtSize(next, size) > 499 && wrapped) {
      rows.push(wrapped);
      wrapped = word;
    } else wrapped = next;
  }
  if (wrapped) rows.push(wrapped);
  if (y < 65 + rows.length * (size + 5)) newPage();
  for (const row of rows) {
    page.drawText(row, { x: 48, y, size, font, color: heading ? navy : muted });
    y -= size + 5;
  }
}
for (const [i, p] of pdf.getPages().entries()) {
  p.drawLine({
    start: { x: 48, y: 43 },
    end: { x: 547, y: 43 },
    thickness: 0.5,
    color: rgb(0.87, 0.9, 0.95),
  });
  p.drawText("Smarter Tools. Better Work. Bigger Growth.", {
    x: 48,
    y: 28,
    size: 8,
    font: regular,
    color: muted,
  });
  p.drawText(`${i + 1} / ${pdf.getPageCount()}`, {
    x: 520,
    y: 28,
    size: 8,
    font: regular,
    color: muted,
  });
}
await mkdir("public/downloads", { recursive: true });
await writeFile(
  "public/downloads/navonixx-ai-business-toolkit.pdf",
  await pdf.save(),
);
console.log(
  `Generated toolkit: ${pdf.getPageCount()} pages of actionable resources.`,
);
