import { GuideCard } from "@/components/guide-card";
import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/media-assets";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Check,
  Zap,
  Layers,
  WandSparkles,
  BarChart3,
  FileText,
  Workflow,
  Code2,
  Palette,
  Calculator,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Clock,
  SearchX,
  ListChecks,
  Scale,
  BadgeCheck,
  Ban,
} from "lucide-react";
import { ToolCard } from "@/components/tool-ui";
import { EmailForm } from "@/components/forms";
import { ToolFinder, ToolMonogram, VisitButton } from "@/components/funnel";
import { hasFreePlan } from "@/lib/affiliate-content";
import { offers, offerBySlug } from "@/lib/offers";
import { getTools, getContent, getAffiliates } from "@/lib/catalog";
import { databaseReady } from "@/lib/db";
import { StructuredData } from "@/components/structured-data";
export const dynamic = "force-dynamic";
const faqs: [string, string][] = [
  [
    "Are the tools really free?",
    "Yes. All free tools work in your browser with no account, no trial, and no email gate. The toolkit and newsletter are optional.",
  ],
  [
    "How do you make money?",
    "Some AI tool links may be affiliate links. If you buy through one, we may earn a commission at no extra cost to you. Affiliate links are labeled, and picks are based on fit, not on commission.",
  ],
  [
    "How do you choose which AI tools to recommend?",
    "We look at what each tool is genuinely good at, who it is not for, and whether there is a free plan to test first. Every listing shows limitations as well as features, and we never publish invented ratings or reviews.",
  ],
  [
    "Are prices on NavoNixx always current?",
    "Software prices change often, so we describe pricing models and free plans and link you to the official website for current prices. Always check there before buying.",
  ],
  [
    "Is my data safe when I use the free tools?",
    "Tool inputs are processed in your browser and never sent to us. Optional analytics record page and tool usage only, never what you type.",
  ],
];
const pains = [
  {
    Icon: CreditCard,
    title: "Paying for tools you barely use",
    text: "Monthly subscriptions pile up after one exciting week of trying them.",
  },
  {
    Icon: SearchX,
    title: "Every “top 10” list loves everything",
    text: "Reviews with no downsides make it impossible to know what actually fits.",
  },
  {
    Icon: Clock,
    title: "Busywork still eats your week",
    text: "Invoices, word counts, formatting, follow-ups: small jobs, big time drain.",
  },
];
const method = [
  {
    Icon: ListChecks,
    title: "Start from the job",
    text: "We group tools by the work they do, not by hype.",
  },
  {
    Icon: Scale,
    title: "Show both sides",
    text: "Every listing has limitations and a “probably not for” section.",
  },
  {
    Icon: BadgeCheck,
    title: "Free plans first",
    text: "We point you to a free way to test on real work before paying.",
  },
  {
    Icon: ShieldCheck,
    title: "Link to the source",
    text: "Prices change, so we send you to the official site to confirm.",
  },
];
const toolCategories = [
  { name: "Writing", Icon: Palette },
  { name: "Development", Icon: Code2 },
  { name: "Business", Icon: Calculator },
  { name: "Marketing", Icon: BarChart3 },
];
export default async function Home() {
  const [tools, workflows, articles, affiliates] = await Promise.all([
    getTools(),
    getContent("workflows"),
    getContent("blog"),
    getAffiliates(),
  ]);
  const redirect = databaseReady();
  const featured = [
    "word-counter",
    "json-formatter",
    "freelance-hourly-rate-calculator",
    "password-generator",
    "utm-link-builder",
    "color-palette-generator",
  ];
  const picks = affiliates
    .filter((a) => a.featured && a.editorial && !offerBySlug(a.slug))
    .slice(0, 6);
  return (
    <>
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "NavoNixx",
          url:
            process.env.NEXT_PUBLIC_SITE_URL || "https://navonixx.vercel.app",
        }}
      />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="badge">
              <span className="live-dot" /> FREE TOOLS + HONEST AI PICKS{" "}
              <ArrowUpRight size={13} />
            </div>
            <h1>
              Stop guessing
              <br />
              which AI tools
              <br />
              <span className="gradient-text">are worth it.</span>
            </h1>
            <p>
              Use {tools.length} free tools today, no sign-up. Then let our
              60-second Tool Finder match you with AI software that fits your
              work and budget, limitations included.
            </p>
            <div className="hero-actions">
              <Link href="#finder" className="button primary">
                Find my AI stack (60 sec) <ArrowRight size={18} />
              </Link>
              <Link href="/free-tools" className="button secondary">
                <Layers size={17} />
                Use free tools
              </Link>
            </div>
            <div className="hero-proof">
              <span>
                <Check /> No sign-up needed
              </span>
              <span>
                <Check /> Free plans first
              </span>
              <span>
                <Check /> Limitations always shown
              </span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Preview of NavoNixx tools">
            <span className="orb orb-one" />
            <span className="orb orb-two" />
            <div className="workspace-preview">
              <div className="workspace-bar">
                <div className="window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span>YOUR SMARTER WORKSPACE</span>
                <span className="mini-logo">
                  <Image
                    src={assetUrl("/images/navonixx-logo.png")}
                    alt=""
                    width={22}
                    height={22}
                  />
                </span>
              </div>
              <div className="workspace-content">
                <div className="workspace-greeting">
                  <span className="micro">A LITTLE LESS FRICTION</span>
                  <h3>
                    Make room for
                    <br />
                    your next big idea<span>.</span>
                  </h3>
                  <span className="workspace-status">
                    <span className="live-dot" /> Ready when you are
                  </span>
                </div>
                <div className="preview-tool-row">
                  <span className="tool-icon development">
                    <Code2 size={20} />
                  </span>
                  <div>
                    <strong>JSON Formatter</strong>
                    <span>Clean code. Clear thinking.</span>
                  </div>
                  <ArrowUpRight size={17} />
                </div>
                <div className="preview-tool-row">
                  <span className="tool-icon business">
                    <Calculator size={20} />
                  </span>
                  <div>
                    <strong>Business Calculators</strong>
                    <span>Make the numbers work for you.</span>
                  </div>
                  <ArrowUpRight size={17} />
                </div>
                <Link href="/free-tools" className="workspace-link">
                  Find your next favorite tool <ArrowRight size={15} />
                </Link>
              </div>
            </div>
            <Link href="/prompts" className="float-card float-prompt">
              <span className="tool-icon lavender">
                <WandSparkles size={21} />
              </span>
              <div>
                <span className="micro">LESS BLANK-PAGE ENERGY</span>
                <strong>AI Prompt Library</strong>
                <span>Your next idea starts here.</span>
              </div>
              <span className="float-spark">✦</span>
            </Link>
            <Link
              href="/templates/weekly-content-calendar"
              className="float-card float-content"
            >
              <div className="float-heading">
                <span className="tool-icon cyan">
                  <FileText size={18} />
                </span>
                <strong>Content Planner</strong>
                <Check size={15} />
              </div>
              <div className="planner-days">
                {"MTWTF".split("").map((d, i) => (
                  <span key={i} className={i === 2 ? "selected" : ""}>
                    {d}
                    <i />
                  </span>
                ))}
              </div>
              <span className="micro">
                A LITTLE PLAN. A LOT OF POSSIBILITY.
              </span>
            </Link>
            <Link href="/workflows" className="float-card float-workflow">
              <span className="tool-icon mint">
                <Workflow size={19} />
              </span>
              <div>
                <strong>Less busywork.</strong>
                <span>More forward motion.</span>
              </div>
              <span className="mini-flow">
                <i />
                <i />
                <i />
              </span>
            </Link>
            <div className="visual-caption">
              <span>✦</span> YOUR IDEAS. SUPERCHARGED.
            </div>
          </div>
        </div>
      </section>
      <section className="proof-strip" aria-label="NavoNixx at a glance">
        <div className="container">
          {[
            [String(tools.length), "free tools, no account"],
            [String(affiliates.length), "AI tools reviewed"],
            ["0", "invented ratings or reviews"],
            ["100%", "of listings show limitations"],
          ].map(([n, l]) => (
            <div key={l}>
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading center">
            <div>
              <span className="eyebrow">SOUND FAMILIAR?</span>
              <h2>AI was supposed to save you time.</h2>
              <p>Instead, it often turns into another job.</p>
            </div>
          </div>
          <div className="pain-grid">
            {pains.map(({ Icon, title, text }) => (
              <div className="pain-card panel" key={title}>
                <span className="pain-icon">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="solution-line">
            <Sparkles size={18} />
            <p>
              <strong>NavoNixx fixes this in two steps:</strong> free tools for
              the quick jobs, and a short, honest shortlist for the AI tools
              worth learning.
            </p>
          </div>
        </div>
      </section>

      <section className="section tinted" id="finder">
        <div className="container finder-section">
          <div className="finder-intro">
            <span className="eyebrow">THE 60-SECOND AI TOOL FINDER</span>
            <h2>Get your AI stack in three clicks.</h2>
            <p>
              Tell us what you do and what eats your time. We&apos;ll match you
              with up to three tools, free plans first, and explain why each one
              fits.
            </p>
            <ul className="check-list">
              <li>
                <Check size={16} /> No email required
              </li>
              <li>
                <Check size={16} /> Picks based on fit, not commission
              </li>
              <li>
                <Check size={16} /> Every pick shows what it&apos;s not good at
              </li>
            </ul>
          </div>
          <ToolFinder listings={affiliates} redirect={redirect} compact />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">IN-DEPTH REVIEWS</span>
              <h2>Apps worth a closer look.</h2>
              <p>
                Real pricing, real limitations, and a free quick-start bonus
                when you unlock the coupon.
              </p>
            </div>
            <Link href="/reviews" className="text-link">
              All reviews <ArrowRight size={17} />
            </Link>
          </div>
          <div className="offer-list">
            {offers.map((o) => (
              <Link
                key={o.slug}
                href={`/reviews/${o.slug}`}
                className="offer-card panel"
              >
                <div className="pick-head">
                  <ToolMonogram name={o.name} size={48} />
                  <div>
                    <h3>{o.name}</h3>
                    <span>{o.category}</span>
                  </div>
                </div>
                <p className="best-for">Best for: {o.bestFor.toLowerCase()}</p>
                <p>{o.tagline}.</p>
                <ul className="pick-reasons">
                  {o.facts.slice(0, 2).map((f) => (
                    <li key={f.label}>
                      <Check size={14} /> {f.value}
                    </li>
                  ))}
                </ul>
                <span className="text-link">
                  Read the review <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {picks.length > 0 && (
        <section className="section tinted">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">OUR PICKS BY JOB</span>
                <h2>The AI tools we&apos;d start with.</h2>
                <p>
                  Chosen for what they&apos;re genuinely good at, with a free
                  way to start where one exists.
                </p>
              </div>
              <Link href="/ai-tools" className="text-link">
                See all {affiliates.length} tools <ArrowRight size={17} />
              </Link>
            </div>
            <div className="pick-grid">
              {picks.map((a) => (
                <div className="pick-card panel" key={a.slug}>
                  <div className="pick-head">
                    <ToolMonogram name={a.name} logoUrl={a.logoUrl} />
                    <div>
                      <h3>{a.name}</h3>
                      <span>{a.category}</span>
                    </div>
                    {hasFreePlan(a.pricingModel) && (
                      <span className="pill free">Free plan</span>
                    )}
                  </div>
                  <p className="best-for">{a.editorial!.bestFor}</p>
                  <p>{a.editorial!.verdict}</p>
                  <div className="pick-actions">
                    <VisitButton
                      listing={a}
                      redirect={redirect}
                      className="button primary small"
                    />
                    <Link className="text-link" href={`/ai-tools/${a.slug}`}>
                      Our full take <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FREE FOREVER. NO ACCOUNT.</span>
              <h2>Quick jobs? Done in seconds.</h2>
              <p>
                Results update as you type, and your input never leaves your
                browser.
              </p>
            </div>
            <Link href="/free-tools" className="text-link">
              Explore all {tools.length} tools <ArrowRight size={17} />
            </Link>
          </div>
          <div className="tool-grid home-tools">
            {tools
              .filter((t) => t.featured ?? featured.includes(t.slug))
              .slice(0, 6)
              .map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
          </div>
          <div className="quick-cats">
            {toolCategories.map(({ name, Icon }) => (
              <Link key={name} href={`/free-tools?category=${name}`}>
                <Icon size={16} /> {name} tools
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section tinted">
        <div className="container">
          <div className="section-heading center">
            <div>
              <span className="eyebrow">HOW WE RECOMMEND</span>
              <h2>Recommendations you can actually check.</h2>
              <p>
                The rules we follow for every listing, and the things we&apos;ll
                never do.
              </p>
            </div>
          </div>
          <div className="method-grid">
            <div className="method-steps">
              {method.map(({ Icon, title, text }, i) => (
                <div className="method-step" key={title}>
                  <span className="step-num">{i + 1}</span>
                  <div>
                    <strong>
                      <Icon size={17} /> {title}
                    </strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="never-card panel">
              <h3>
                <Ban size={20} /> What we&apos;ll never do
              </h3>
              <ul>
                <li>Invent star ratings, reviews, or testimonials</li>
                <li>Use fake countdown timers or “only 2 left” pressure</li>
                <li>Hide affiliate links: they are always labeled</li>
                <li>Promise overnight income or guaranteed results</li>
                <li>Read or store what you type into our tools</li>
              </ul>
              <Link href="/affiliate-disclosure" className="text-link">
                Read our disclosure <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="toolkit-banner">
            <div className="toolkit-art">
              <div className="book-shadow" />
              <div className="toolkit-book">
                <div className="book-brand">
                  <Zap size={16} />
                  navonixx.
                </div>
                <div className="book-title">
                  Your next
                  <br />
                  chapter
                  <br />
                  starts <em>here.</em>
                </div>
                <div className="book-orbit">
                  <Sparkles size={38} />
                </div>
                <div className="book-footer">
                  AI BUSINESS
                  <br />
                  GROWTH TOOLKIT<span>THE FREE EDITION ↗</span>
                </div>
              </div>
              <span className="book-label">
                <Check size={14} /> Practical. Actionable. Yours.
              </span>
            </div>
            <div className="toolkit-copy">
              <span className="eyebrow">YOUR HEAD START, ON US</span>
              <h2>
                Your free AI business
                <br />
                toolkit is ready.
              </h2>
              <p>
                The prompts, templates, and workflows we&apos;d hand a friend
                starting out. Download instantly, no email needed.
              </p>
              <div className="toolkit-benefits">
                {[
                  "10 ready-to-use AI prompts",
                  "Client proposal & email templates",
                  "A 7-day content plan",
                  "Simple automation workflows",
                ].map((t) => (
                  <span key={t}>
                    <Check size={16} />
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/toolkit" className="button primary">
                Get your free toolkit <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GUIDES & COMPARISONS</span>
              <h2>Make the decision in five minutes.</h2>
            </div>
            <Link href="/blog" className="text-link">
              All guides <ArrowRight size={17} />
            </Link>
          </div>
          <div className="resource-grid">
            {[...articles, ...workflows].slice(0, 3).map((a, i) => {
              if (a.kind === "blog") return <GuideCard key={a.slug} item={a} />;
              const Art = [BarChart3, Sparkles, Workflow][i];
              return (
                <Link
                  className="resource-card"
                  href={`/${a.kind}/${a.slug}`}
                  key={a.slug}
                >
                  <div className={`article-art article-${i}`}>
                    <span>{a.category}</span>
                    <Art size={72} />
                  </div>
                  <span className="eyebrow">
                    {a.kind === "blog" ? "GUIDE" : "WORKFLOW"}
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                  <span className="text-link">
                    Read it <ArrowUpRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="quick-cats">
            <Link href="/prompts">
              <WandSparkles size={16} /> Prompt library
            </Link>
            <Link href="/templates">
              <FileText size={16} /> Templates
            </Link>
            <Link href="/workflows">
              <Workflow size={16} /> Workflows
            </Link>
            <Link href="/ai-tools/compare">
              <Briefcase size={16} /> Compare tools
            </Link>
          </div>
        </div>
      </section>

      <section className="section tinted">
        <div className="container faq-section">
          <div>
            <span className="eyebrow">STRAIGHT ANSWERS</span>
            <h2>Questions people ask before trusting us.</h2>
            <p>
              Fair questions, honest answers. Anything else?{" "}
              <Link href="/contact">Ask us directly</Link>.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section newsletter-section">
        <div className="container newsletter">
          <div>
            <span className="eyebrow">ONE USEFUL EMAIL, NOW AND THEN</span>
            <h2>
              New tools and honest picks.
              <br />
              Straight to your inbox.
            </h2>
            <p>
              Short, practical, and easy to unsubscribe from. No spam, ever.
            </p>
          </div>
          <EmailForm newsletter />
        </div>
      </section>
    </>
  );
}
