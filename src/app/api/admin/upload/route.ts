import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";
import { guard, apiError } from "@/lib/api";
import { approvedAsset } from "@/lib/security";
import { db } from "@/lib/db";
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const blocked = await guard(request, "upload", 10);
    if (blocked) return blocked;
    if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.BLOB_PUBLIC_HOST)
      return NextResponse.json(
        {
          error:
            "Persistent uploads need Vercel Blob configuration. Add BLOB_READ_WRITE_TOKEN and BLOB_PUBLIC_HOST.",
        },
        { status: 503 },
      );
    if (
      Number(request.headers.get("content-length") || 0) >
      5 * 1024 * 1024 + 10000
    )
      return NextResponse.json(
        { error: "Maximum file size is 5 MB." },
        { status: 413 },
      );
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024)
      return NextResponse.json(
        { error: "Choose a PDF, PNG, JPEG, or WEBP up to 5 MB." },
        { status: 400 },
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    const valid =
      file.type === "application/pdf"
        ? bytes.subarray(0, 5).toString() === "%PDF-"
        : file.type === "image/png"
          ? bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          : file.type === "image/jpeg"
            ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
            : file.type === "image/webp"
              ? bytes.subarray(0, 4).toString() === "RIFF" &&
                bytes.subarray(8, 12).toString() === "WEBP"
              : false;
    if (!valid)
      return NextResponse.json(
        { error: "File content does not match an allowed format." },
        { status: 400 },
      );
    const extension = {
      "application/pdf": "pdf",
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
    }[file.type]!;
    const result = await put(
      `resources/${crypto.randomUUID()}.${extension}`,
      bytes,
      {
        access: "public",
        contentType: file.type,
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      },
    );
    if (!approvedAsset(result.url))
      return NextResponse.json(
        {
          error:
            "Uploaded host does not match BLOB_PUBLIC_HOST. Check configuration.",
        },
        { status: 503 },
      );
    await db.adminAuditLog.create({
      data: { adminId: admin.id, action: "UPLOAD", entity: "assets" },
    });
    return NextResponse.json({ url: result.url, type: file.type });
  } catch (e) {
    return apiError(e);
  }
}
