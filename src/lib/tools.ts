import { createUUID } from "./browser-utils";
export type Field = {
  key: string;
  label: string;
  value: string;
  type?: "number" | "text" | "textarea" | "select";
  min?: number;
  options?: string[];
};
export type Tool = {
  slug: string;
  name: string;
  category: string;
  description: string;
  fields: Field[];
  iconUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featured?: boolean;
};
const text = (
  value = "Smarter tools. Better work. Bigger growth.",
): Field[] => [{ key: "text", label: "Your text", value, type: "textarea" }];
const nums = (...fields: [string, string, string][]): Field[] =>
  fields.map(([key, label, value]) => ({
    key,
    label,
    value,
    type: "number",
    min: 0,
  }));
const entries: [string, string, string, string, Field[]][] = [
  [
    "word-counter",
    "Word Counter",
    "Writing",
    "Count words, sentences, and paragraphs as you write.",
    text(),
  ],
  [
    "character-counter",
    "Character Counter",
    "Writing",
    "Count characters with and without spaces.",
    text(),
  ],
  [
    "text-case-converter",
    "Text Case Converter",
    "Writing",
    "Convert text into upper, lower, title, or sentence case.",
    [
      ...text(),
      {
        key: "mode",
        label: "Case",
        value: "title",
        type: "select",
        options: ["upper", "lower", "title", "sentence"],
      },
    ],
  ],
  [
    "text-cleaner",
    "Text Cleaner",
    "Writing",
    "Remove extra spaces and tidy up line breaks.",
    text("  A cleaner   way to work.  "),
  ],
  [
    "duplicate-line-remover",
    "Duplicate Line Remover",
    "Writing",
    "Keep unique lines in their original order.",
    text("Ideas\nProjects\nIdeas\nClients"),
  ],
  [
    "reading-time-calculator",
    "Reading Time Calculator",
    "Writing",
    "Estimate reading time at your preferred pace.",
    [...text(), ...nums(["speed", "Words per minute", "200"])],
  ],
  [
    "slug-generator",
    "Slug Generator",
    "Writing",
    "Turn a title into a readable URL slug.",
    text("Your next big idea!"),
  ],
  [
    "social-media-character-limit-checker",
    "Social Character Checker",
    "Writing",
    "Check text against common social post limits.",
    [
      ...text(),
      ...nums(["limit", "Character limit (X: 280, Instagram: 2200)", "280"]),
    ],
  ],
  [
    "hashtag-organizer",
    "Hashtag Organizer",
    "Writing",
    "Clean and deduplicate your hashtag collection.",
    text("#growth #AI #growth productivity"),
  ],
  [
    "markdown-previewer",
    "Markdown Previewer",
    "Writing",
    "Preview Markdown safely, without executing HTML.",
    text("# Your next project\n\n**Start here.**\n\n- Plan\n- Create\n- Share"),
  ],
  [
    "json-formatter",
    "JSON Formatter & Validator",
    "Development",
    "Validate JSON and format it for easy reading.",
    text('{"brand":"NavoNixx","free":true}'),
  ],
  [
    "base64-encoder-decoder",
    "Base64 Encoder / Decoder",
    "Development",
    "Encode or decode Unicode text as Base64.",
    [
      ...text(),
      { key: "mode", label: "Mode", value: "encode", type: "select", options: ["encode", "decode"] },
    ],
  ],
  [
    "url-encoder-decoder",
    "URL Encoder / Decoder",
    "Development",
    "Safely encode and decode URL components.",
    [
      ...text("hello world & AI"),
      { key: "mode", label: "Mode", value: "encode", type: "select", options: ["encode", "decode"] },
    ],
  ],
  [
    "uuid-generator",
    "UUID Generator",
    "Development",
    "Generate cryptographically random version 4 UUIDs.",
    nums(["count", "Number of UUIDs (1–100)", "5"]),
  ],
  [
    "password-generator",
    "Password Generator",
    "Development",
    "Create random passwords locally with Web Crypto.",
    nums(["length", "Password length (8–128)", "24"]),
  ],
  [
    "color-palette-generator",
    "Color Palette Generator",
    "Development",
    "Create a coordinated palette from a base color.",
    [{ key: "color", label: "Base HEX color", value: "#2563eb" }],
  ],
  [
    "color-converter",
    "HEX / RGB / HSL Converter",
    "Development",
    "Convert HEX, RGB, or HSL colors to all three formats.",
    [{ key: "color", label: "Color (HEX, rgb(), or hsl())", value: "#2563eb" }],
  ],
  [
    "css-gradient-generator",
    "CSS Gradient Generator",
    "Development",
    "Build a CSS linear gradient with a live preview.",
    [
      { key: "start", label: "Start HEX", value: "#2563eb" },
      { key: "end", label: "End HEX", value: "#a78bfa" },
      ...nums(["angle", "Angle in degrees", "135"]),
    ],
  ],
  [
    "timestamp-converter",
    "Timestamp Converter",
    "Development",
    "Convert Unix seconds, milliseconds, and ISO dates.",
    [
      {
        key: "text",
        label: "Unix timestamp or ISO date",
        value: "2026-01-01T00:00:00Z",
      },
    ],
  ],
  [
    "regex-tester",
    "Regex Tester",
    "Development",
    "Test bounded text against a regular expression.",
    [
      ...text("hello@navonixx.com"),
      {
        key: "pattern",
        label: "Pattern (without slashes)",
        value: "[a-z]+@[^ ]+",
      },
      { key: "flags", label: "Flags", value: "gi" },
    ],
  ],
  [
    "freelance-hourly-rate-calculator",
    "Freelance Hourly Rate",
    "Business",
    "Find a sustainable hourly rate for your business.",
    nums(
      ["income", "Annual income target", "60000"],
      ["expenses", "Annual business expenses", "12000"],
      ["weeks", "Working weeks per year", "46"],
      ["hours", "Billable hours per week", "25"],
    ),
  ],
  [
    "project-pricing-calculator",
    "Project Pricing Calculator",
    "Business",
    "Estimate project fees with expenses and contingency.",
    nums(
      ["hours", "Estimated hours", "40"],
      ["rate", "Hourly rate", "60"],
      ["expenses", "Project expenses", "200"],
      ["buffer", "Contingency (%)", "15"],
    ),
  ],
  [
    "profit-margin-calculator",
    "Profit Margin Calculator",
    "Business",
    "Calculate profit, margin, and markup.",
    nums(["revenue", "Revenue", "10000"], ["cost", "Total costs", "6500"]),
  ],
  [
    "discount-calculator",
    "Discount Calculator",
    "Business",
    "Calculate a discount and the final price.",
    nums(
      ["price", "Original price", "1000"],
      ["discount", "Discount (%)", "20"],
    ),
  ],
  [
    "gst-calculator",
    "VAT, GST & Sales Tax Calculator",
    "Business",
    "Add or extract tax at a rate you choose for your transaction.",
    [
      ...nums(["amount", "Amount", "1000"], ["rate", "Tax rate (%)", "10"]),
      { key: "mode", label: "Tax is", value: "add", type: "select", options: ["add", "extract"] },
    ],
  ],
  [
    "roi-calculator",
    "ROI Calculator",
    "Business",
    "Measure return against your original investment.",
    nums(
      ["return", "Total return", "15000"],
      ["investment", "Investment", "10000"],
    ),
  ],
  [
    "break-even-calculator",
    "Break-even Calculator",
    "Business",
    "Find the units needed to cover fixed costs.",
    nums(
      ["fixed", "Fixed costs", "5000"],
      ["price", "Price per unit", "50"],
      ["variable", "Variable cost per unit", "20"],
    ),
  ],
  [
    "invoice-generator",
    "Invoice Generator",
    "Business",
    "Create a printable invoice with calculated tax.",
    [
      { key: "business", label: "Your business", value: "Your Studio" },
      { key: "client", label: "Client", value: "Client Company" },
      { key: "number", label: "Invoice number", value: "INV-001" },
      { key: "item", label: "Service or product", value: "Design services" },
      ...nums(
        ["quantity", "Quantity", "10"],
        ["rate", "Unit price", "60"],
        ["tax", "Tax (%)", "0"],
      ),
      { key: "currency", label: "Currency code", value: "USD" },
    ],
  ],
  [
    "meeting-cost-calculator",
    "Meeting Cost Calculator",
    "Business",
    "Understand the estimated cost of your next meeting.",
    nums(
      ["people", "Participants", "6"],
      ["rate", "Average hourly cost", "40"],
      ["minutes", "Meeting duration in minutes", "60"],
    ),
  ],
  [
    "engagement-rate-calculator",
    "Engagement Rate Calculator",
    "Business",
    "Calculate engagement relative to audience size.",
    nums(
      ["engagements", "Total interactions", "420"],
      ["audience", "Followers or impressions", "10000"],
    ),
  ],
  [
    "utm-link-builder",
    "UTM Link Builder",
    "Marketing",
    "Build consistent, trackable campaign links.",
    [
      {
        key: "url",
        label: "Website URL",
        value: "https://navonixx.vercel.app/free-tools",
      },
      { key: "source", label: "Campaign source", value: "instagram" },
      { key: "medium", label: "Campaign medium", value: "social" },
      { key: "campaign", label: "Campaign name", value: "bio" },
      { key: "content", label: "Content (optional)", value: "" },
      { key: "term", label: "Term (optional)", value: "" },
    ],
  ],
  [
    "seo-title-checker",
    "SEO Title Checker",
    "Marketing",
    "Check a title against a useful length guideline.",
    text("Free productivity tools for your next big idea | NavoNixx"),
  ],
  [
    "meta-description-checker",
    "Meta Description Checker",
    "Marketing",
    "Review description length before publishing.",
    text(
      "Discover genuinely free tools, practical AI prompts, and useful workflows for freelancers, creators, and small businesses.",
    ),
  ],
  [
    "open-graph-preview",
    "Open Graph Preview",
    "Marketing",
    "Preview the title and description of a social share.",
    [
      {
        key: "title",
        label: "Page title",
        value: "Work smarter with NavoNixx",
      },
      {
        key: "description",
        label: "Description",
        value: "Free tools for your next big idea.",
      },
      { key: "url", label: "Page URL", value: "https://navonixx.vercel.app" },
    ],
  ],
  [
    "email-subject-checker",
    "Email Subject Line Checker",
    "Marketing",
    "Keep email subjects concise and readable.",
    text("Your free AI business toolkit is ready"),
  ],
];
export const tools: Tool[] = entries.map(
  ([slug, name, category, description, fields]) => ({
    slug,
    name,
    category,
    description,
    fields,
  }),
);
export const categories = [
  "All tools",
  "Writing",
  "Development",
  "Business",
  "Marketing",
];
export function parseColor(input: string): [number, number, number] {
  let hex = input.trim().replace(/^#/, "");
  if (/^[\da-f]{3}$/i.test(hex))
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  if (/^[\da-f]{6}$/i.test(hex))
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ];
  const rgb = input.match(
    /^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i,
  );
  if (rgb) {
    const v = rgb.slice(1).map(Number);
    if (v.some((n) => n > 255)) throw Error("RGB channels must be 0–255.");
    return v.map(Math.round) as [number, number, number];
  }
  const hsl = input.match(
    /^hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/i,
  );
  if (hsl) {
    const [h, s, l] = hsl.slice(1).map(Number);
    if (h > 360 || s > 100 || l > 100)
      throw Error("Use H: 0–360, S and L: 0–100.");
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    return [0, 8, 4].map((n) => {
      const k = (n + h / 30) % 12;
      return Math.round(
        255 * (l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))),
      );
    }) as [number, number, number];
  }
  throw Error("Enter a valid HEX, rgb(), or hsl() color.");
}
const hexColor = (v: number[]) =>
  "#" + v.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
export function runTool(slug: string, v: Record<string, string>): string {
  const t = v.text || "";
  const num = (key: string, positive = false) => {
    const n = Number(v[key]);
    if (
      !v[key]?.trim() ||
      !Number.isFinite(n) ||
      n < 0 ||
      (positive && n === 0)
    )
      throw Error(
        `${key}: enter a ${positive ? "positive" : "non-negative"} number.`,
      );
    return n;
  };
  const percent = (key: string) => {
    const n = num(key);
    if (n > 100) throw Error(`${key} must be between 0 and 100.`);
    return n;
  };
  const f = (n: number) =>
    new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(n);
  const words = t.trim() ? t.trim().split(/\s+/u).length : 0;
  const chars = Array.from(t).length;
  switch (slug) {
    case "word-counter":
      return `${words} words\n${chars} characters\n${t.trim() ? t.split(/[.!?]+/).filter((s) => s.trim()).length : 0} sentences\n${t.trim() ? t.split(/\n\s*\n/).filter((s) => s.trim()).length : 0} paragraphs`;
    case "character-counter":
      return `${chars} characters\n${Array.from(t.replace(/\s/g, "")).length} without spaces`;
    case "text-case-converter": {
      if (!["upper", "lower", "title", "sentence"].includes(v.mode))
        throw Error("Choose upper, lower, title, or sentence.");
      return v.mode === "upper"
        ? t.toUpperCase()
        : v.mode === "lower"
          ? t.toLowerCase()
          : v.mode === "title"
            ? t.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase())
            : t
                .toLowerCase()
                .replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (c) => c.toUpperCase());
    }
    case "text-cleaner":
      return t
        .split("\n")
        .map((s) => s.trim().replace(/[\t ]+/g, " "))
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    case "duplicate-line-remover":
      return [...new Set(t.split(/\r?\n/).map((s) => s.trim()))].join("\n");
    case "reading-time-calculator":
      return `${f(words / num("speed", true))} minutes (${words} words)\nReading time is an estimate.`;
    case "slug-generator":
      return t
        .normalize("NFKD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "");
    case "social-media-character-limit-checker":
      return `${chars} / ${num("limit", true)} characters\n${chars <= num("limit") ? `${num("limit") - chars} remaining` : `${chars - num("limit")} over the limit`}`;
    case "hashtag-organizer":
      return [
        ...new Set(
          t
            .split(/[\s,]+/)
            .map((s) => s.replace(/^#+/, "").toLowerCase())
            .filter(Boolean),
        ),
      ]
        .map((s) => "#" + s)
        .join(" ");
    case "markdown-previewer":
      return t;
    case "json-formatter":
      return JSON.stringify(JSON.parse(t), null, 2);
    case "base64-encoder-decoder": {
      if (!["encode", "decode"].includes(v.mode))
        throw Error("Choose encode or decode.");
      return v.mode === "decode"
        ? new TextDecoder("utf-8", { fatal: true }).decode(
            Uint8Array.from(atob(t), (c) => c.charCodeAt(0)),
          )
        : btoa(
            Array.from(new TextEncoder().encode(t), (c) =>
              String.fromCharCode(c),
            ).join(""),
          );
    }
    case "url-encoder-decoder": {
      if (!["encode", "decode"].includes(v.mode))
        throw Error("Choose encode or decode.");
      return v.mode === "decode"
        ? decodeURIComponent(t)
        : encodeURIComponent(t);
    }
    case "uuid-generator": {
      const n = num("count", true);
      if (n > 100 || !Number.isInteger(n))
        throw Error("Choose an integer from 1 to 100.");
      return Array.from({ length: n }, () => createUUID()).join("\n");
    }
    case "password-generator": {
      const n = num("length", true);
      if (n < 8 || n > 128 || !Number.isInteger(n))
        throw Error("Choose a length from 8 to 128.");
      const alphabet =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?";
      let result = "";
      while (result.length < n) {
        const b = crypto.getRandomValues(new Uint8Array(n));
        for (const x of b)
          if (
            x < Math.floor(256 / alphabet.length) * alphabet.length &&
            result.length < n
          )
            result += alphabet[x % alphabet.length];
      }
      return result;
    }
    case "color-palette-generator": {
      const c = parseColor(v.color);
      return [0, 0.2, 0.4, 0.65, 0.85]
        .map((a) => hexColor(c.map((n) => n + (255 - n) * a)))
        .join("\n");
    }
    case "color-converter": {
      const [r, g, b] = parseColor(v.color),
        c = [r, g, b].map((n) => n / 255),
        max = Math.max(...c),
        min = Math.min(...c),
        d = max - min,
        l = (max + min) / 2;
      let h = 0;
      if (d)
        h =
          (max === c[0]
            ? (c[1] - c[2]) / d + (c[1] < c[2] ? 6 : 0)
            : max === c[1]
              ? (c[2] - c[0]) / d + 2
              : (c[0] - c[1]) / d + 4) * 60;
      const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
      return `${hexColor([r, g, b])}\nrgb(${r}, ${g}, ${b})\nhsl(${f(h)}, ${f(s * 100)}%, ${f(l * 100)}%)`;
    }
    case "css-gradient-generator":
      return `linear-gradient(${num("angle") % 360}deg, ${hexColor(parseColor(v.start))}, ${hexColor(parseColor(v.end))})`;
    case "timestamp-converter": {
      const value = /^\d+$/.test(t)
        ? Number(t) * (t.length <= 10 ? 1000 : 1)
        : t;
      const date = new Date(value);
      if (!Number.isFinite(date.getTime()))
        throw Error("Enter a valid timestamp or ISO date.");
      return `${date.toISOString()}\nUnix seconds: ${Math.floor(date.getTime() / 1000)}\nUnix milliseconds: ${date.getTime()}`;
    }
    case "regex-tester":
      throw Error("Regex testing runs in an isolated worker.");
    case "freelance-hourly-rate-calculator":
      return `Hourly rate: ${f((num("income") + num("expenses")) / (num("weeks", true) * num("hours", true)))}\nUse one currency consistently. Taxes and leave need your own allowance.`;
    case "project-pricing-calculator":
      return `Project fee: ${f((num("hours") * num("rate") + num("expenses")) * (1 + num("buffer") / 100))}`;
    case "profit-margin-calculator": {
      const rev = num("revenue", true),
        cost = num("cost");
      return `Profit: ${f(rev - cost)}\nMargin: ${f(((rev - cost) / rev) * 100)}%\nMarkup: ${cost ? f(((rev - cost) / cost) * 100) + "%" : "Undefined with zero cost"}`;
    }
    case "discount-calculator": {
      const price = num("price"),
        discount = percent("discount");
      return `You save: ${f((price * discount) / 100)}\nFinal price: ${f(price * (1 - discount / 100))}`;
    }
    case "gst-calculator": {
      if (!["add", "extract"].includes(v.mode))
        throw Error("Choose add or extract.");
      const amount = num("amount"),
        r = num("rate") / 100,
        base = v.mode === "extract" ? amount / (1 + r) : amount;
      return `Base amount: ${f(base)}\nTax: ${f(base * r)}\nTotal: ${f(base * (1 + r))}\nVerify the applicable rate for your transaction.`;
    }
    case "roi-calculator":
      return `ROI: ${f(((num("return") - num("investment", true)) / num("investment", true)) * 100)}%\nNet return: ${f(num("return") - num("investment"))}`;
    case "break-even-calculator": {
      const margin = num("price") - num("variable");
      if (margin <= 0) throw Error("Unit price must exceed variable cost.");
      return `Break-even: ${Math.ceil(num("fixed") / margin)} units\nContribution per unit: ${f(margin)}`;
    }
    case "invoice-generator": {
      if (!/^[A-Z]{3}$/.test(v.currency))
        throw Error("Use a three-letter currency code, such as USD, GBP, or CAD.");
      const subtotal = num("quantity", true) * num("rate"),
        tax = (subtotal * num("tax")) / 100;
      return `INVOICE ${v.number}\nFrom: ${v.business}\nBill to: ${v.client}\n\n${v.item}\n${v.quantity} × ${f(num("rate"))} ${v.currency}\nSubtotal: ${f(subtotal)} ${v.currency}\nTax: ${f(tax)} ${v.currency}\nTOTAL: ${f(subtotal + tax)} ${v.currency}`;
    }
    case "meeting-cost-calculator":
      return `Estimated meeting cost: ${f((num("people") * num("rate") * num("minutes")) / 60)}`;
    case "engagement-rate-calculator":
      return `Engagement rate: ${f((num("engagements") / num("audience", true)) * 100)}%`;
    case "utm-link-builder": {
      const url = new URL(v.url);
      if (!["https:", "http:"].includes(url.protocol))
        throw Error("Use an HTTP or HTTPS URL.");
      for (const key of ["source", "medium", "campaign", "content", "term"]) {
        if (["source", "medium", "campaign"].includes(key) && !v[key].trim())
          throw Error(`${key} is required.`);
        if (v[key]) url.searchParams.set("utm_" + key, v[key]);
      }
      return url.toString();
    }
    case "seo-title-checker":
    case "meta-description-checker":
    case "email-subject-checker": {
      const [min, max] =
        slug === "seo-title-checker"
          ? [30, 60]
          : slug === "meta-description-checker"
            ? [120, 160]
            : [20, 50];
      return `${chars} characters\n${chars < min ? "Shorter than the usual guideline" : chars > max ? "Longer than the usual guideline" : "Within the usual guideline"} (${min}–${max})\nDisplay width and truncation vary by platform.`;
    }
    case "open-graph-preview": {
      const url = new URL(v.url);
      if (!["https:", "http:"].includes(url.protocol))
        throw Error("Use an HTTP or HTTPS URL.");
      return `${url.hostname}\n${v.title}\n${v.description}`;
    }
    default:
      throw Error("Tool implementation not found.");
  }
}
