import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emailSchema } from "@/lib/validation";
import { guard, readJson, apiError } from "@/lib/api";
export async function POST(request: Request) {
  try {
    const blocked = await guard(request, "contact", 5);
    if (blocked) return blocked;
    const data = z
      .object({
        name: z.string().trim().min(2).max(100),
        email: emailSchema,
        message: z.string().trim().min(10).max(5000),
        website: z.string().max(0).optional(),
      })
      .strict()
      .parse(await readJson(request));
    await db.contactSubmission.create({
      data: { name: data.name, email: data.email, message: data.message },
    });
    return NextResponse.json({
      message: "Your message was received. Thank you for getting in touch.",
    });
  } catch (e) {
    return apiError(e);
  }
}
