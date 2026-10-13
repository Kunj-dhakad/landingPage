import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getContent } from "@/lib/catalog";
import { databaseReady, db } from "@/lib/db";
import { approvedAsset } from "@/lib/security";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const resource = (await getContent()).find((r) => r.slug === slug);
  if (!resource?.assetPath || !approvedAsset(resource.assetPath))
    return NextResponse.json(
      { error: "Resource unavailable." },
      { status: 404 },
    );
  try {
    let bytes: Uint8Array;
    if (resource.assetPath.startsWith("/"))
      bytes = await readFile(
        path.join(process.cwd(), "public", resource.assetPath),
      );
    else {
      const response = await fetch(resource.assetPath, {
        redirect: "error",
        signal: AbortSignal.timeout(10000),
      });
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/pdf") ||
        Number(response.headers.get("content-length") || 0) > 5 * 1024 * 1024
      )
        throw Error("Invalid asset.");
      bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length > 5 * 1024 * 1024) throw Error("Asset too large.");
    }
    if (databaseReady() && "id" in resource)
      await db.resourceDownload
        .create({ data: { resourceId: resource.id as string } })
        .catch(() => {});
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Download temporarily unavailable." },
      { status: 503 },
    );
  }
}
