import { z } from "zod";
import { eventNames } from "./events";
import { safeDestination, approvedAsset } from "./security";
export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
export const leadSchema = z
  .object({
    email: emailSchema,
    marketing: z.boolean().default(false),
    newsletter: z.boolean().default(false),
    website: z.string().max(200).optional(),
    resourceSlug: slugSchema.optional(),
    source: z.string().max(100).optional(),
    campaign: z.string().max(100).optional(),
  })
  .strict()
  .refine((v) => !v.newsletter || v.marketing, {
    message: "Newsletter subscription requires explicit marketing consent.",
  })
  .refine((v) => Boolean(v.resourceSlug) || v.newsletter, {
    message: "Choose a resource or newsletter.",
  });
export const eventsSchema = z
  .object({
    attribution: z
      .object({
        source: z
          .string()
          .regex(/^[a-zA-Z0-9_. -]*$/)
          .max(100)
          .optional(),
        medium: z
          .string()
          .regex(/^[a-zA-Z0-9_. -]*$/)
          .max(100)
          .optional(),
        campaign: z
          .string()
          .regex(/^[a-zA-Z0-9_. -]*$/)
          .max(100)
          .optional(),
        content: z
          .string()
          .regex(/^[a-zA-Z0-9_. -]*$/)
          .max(100)
          .optional(),
        term: z
          .string()
          .regex(/^[a-zA-Z0-9_. -]*$/)
          .max(100)
          .optional(),
        referrerDomain: z
          .string()
          .regex(/^[a-z0-9.-]+$/i)
          .max(253)
          .optional(),
      })
      .strict()
      .optional(),
    events: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            name: z.enum(eventNames),
            path: z
              .string()
              .regex(/^\/(?!\/)[a-zA-Z0-9/_-]*$/)
              .max(200),
            slug: slugSchema.optional(),
            category: z.string().max(60).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(20),
  })
  .strict();
export const httpUrl = z
  .string()
  .max(2000)
  .refine((v) => Boolean(safeDestination(v)), {
    message: "Use a valid HTTP/HTTPS URL without embedded credentials.",
  });
export const assetUrl = z
  .string()
  .max(2000)
  .refine(approvedAsset, {
    message: "Use a local download path or your configured Blob storage host.",
  })
  .nullable()
  .optional();
export const resourceSchema = z
  .object({
    slug: slugSchema,
    kind: z.enum([
      "blog",
      "prompts",
      "templates",
      "workflows",
      "toolkit",
      "faq",
    ]),
    title: z.string().min(3).max(150),
    description: z.string().min(10).max(500),
    body: z.string().min(10).max(100000),
    category: z.string().min(2).max(80),
    assetPath: assetUrl,
    coverUrl: assetUrl,
    published: z.boolean(),
    featured: z.boolean().default(false),
    emailCapture: z.boolean().default(false),
    seoTitle: z.string().max(150).nullable().optional(),
    seoDescription: z.string().max(300).nullable().optional(),
  })
  .strict();
export const affiliateSchema = z
  .object({
    slug: slugSchema,
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    body: z.string().min(10).max(20000),
    category: z.string().min(2).max(80),
    officialUrl: httpUrl,
    destinationUrl: httpUrl.nullable().optional(),
    logoUrl: assetUrl,
    affiliate: z.boolean(),
    published: z.boolean(),
    featured: z.boolean().default(false),
    pricingModel: z.enum(["FREE", "FREEMIUM", "PAID", "UNVERIFIED"]),
    pricingDescription: z.string().max(1000),
    freePlan: z.string().max(200),
    features: z.array(z.string().max(300)).max(30),
    advantages: z.array(z.string().max(300)).max(20),
    limitations: z.array(z.string().max(300)).max(20),
    platforms: z.array(z.string().max(100)).max(15),
    useCases: z.array(z.string().max(150)).max(20),
  })
  .strict();
export const freeToolSchema = z
  .object({
    title: z.string().min(2).max(150),
    description: z.string().min(10).max(500),
    category: z.enum(["Writing", "Development", "Business", "Marketing"]),
    enabled: z.boolean(),
    featured: z.boolean(),
    seoTitle: z.string().max(150).nullable().optional(),
    seoDescription: z.string().max(300).nullable().optional(),
    iconUrl: assetUrl,
  })
  .strict();
