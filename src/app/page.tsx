import Link from "next/link";
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
  PenTool,
  Calculator,
  Search,
  Megaphone,
  Briefcase,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { ToolCard } from "@/components/tool-ui";
import { EmailForm } from "@/components/forms";
import { getTools, getContent, getAffiliates } from "@/lib/catalog";
import { StructuredData } from "@/components/structured-data";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [tools, workflows, articles, affiliates] = await Promise.all([
    getTools(),
    getContent("workflows"),
    getContent("blog"),
    getAffiliates(),
  ]);
  const featured = [
    "word-counter",
    "json-formatter",
    "freelance-hourly-rate-calculator",
    "password-generator",
    "utm-link-builder",
    "color-palette-generator",
  ];
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
      <section className="hero">
        <div className="hero-grid-bg" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="badge">
              <span className="live-dot" /> BIG IDEAS DESERVE BETTER TOOLS{" "}
              <ArrowUpRight size={13} />
            </div>
            <h1>
              Work smarter.
              <br />
              Create faster.
              <br />
              <span className="gradient-text">Grow with AI.</span>
            </h1>
            <p>
              Your next big idea, minus the busywork. Discover free tools,
              ready-to-use prompts, and smarter workflows—all in one
              thoughtfully built space.
            </p>
            <div className="hero-actions">
              <Link href="/free-tools" className="button primary">
                Explore Free Tools <ArrowUpRight size={18} />
              </Link>
              <Link href="/toolkit" className="button secondary">
                <Layers size={17} />
                Get Free AI Toolkit
              </Link>
            </div>
            <div className="hero-proof">
              <span>
                <Check /> Actually free
              </span>
              <span>
                <Check /> No sign-up needed
              </span>
              <span>
                <Check /> Built for real work
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
                  <Zap size={13} />
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
      <section className="value-strip">
        <div className="container">
          <span>MADE FOR THE WAY YOU WORK</span>
          <div>
            <Briefcase size={18} />
            Freelancers
          </div>
          <div>
            <Palette size={18} />
            Creators
          </div>
          <div>
            <Zap size={18} />
            Solopreneurs
          </div>
          <div>
            <BarChart3 size={18} />
            Growing businesses
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FIND YOUR FLOW</span>
              <h2>
                A little help.
                <br />
                For every kind of work.
              </h2>
            </div>
            <p>
              From the first spark to the final detail.
              <br />
              Pick a category and make progress.
            </p>
          </div>
          <div className="category-grid">
            {[
              {
                name: "AI & Productivity",
                icon: Sparkles,
                url: "/prompts",
                color: "lavender",
              },
              {
                name: "Freelancing",
                icon: Briefcase,
                url: "/free-tools?category=Business",
                color: "cyan",
              },
              {
                name: "Content Creation",
                icon: Palette,
                url: "/templates",
                color: "pink",
              },
              {
                name: "Marketing",
                icon: Megaphone,
                url: "/free-tools?category=Marketing",
                color: "orange",
              },
              {
                name: "Business Utilities",
                icon: BarChart3,
                url: "/free-tools?category=Business",
                color: "mint",
              },
              {
                name: "Automation",
                icon: Workflow,
                url: "/workflows",
                color: "lavender",
              },
              {
                name: "Writing Tools",
                icon: PenTool,
                url: "/free-tools?category=Writing",
                color: "cyan",
              },
              {
                name: "Finance Calculators",
                icon: Calculator,
                url: "/free-tools?category=Business",
                color: "orange",
              },
              {
                name: "SEO Tools",
                icon: Search,
                url: "/free-tools?category=Marketing",
                color: "mint",
              },
            ].map((c) => (
              <Link className="category-card" href={c.url} key={c.name}>
                <span className={`tool-icon ${c.color}`}>
                  <c.icon size={21} />
                </span>
                <strong>{c.name}</strong>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section tinted">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SMALL TOOLS. BIG DIFFERENCE.</span>
              <h2>Meet your new everyday essentials.</h2>
              <p>Useful from the first click. Free from the first click.</p>
            </div>
            <Link href="/free-tools" className="text-link">
              Explore all {tools.length} tools <ArrowRight size={17} />
            </Link>
          </div>
          <div className="tool-grid">
            {tools
              .filter((t) => t.featured ?? featured.includes(t.slug))
              .slice(0, 8)
              .map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
          </div>
          <div className="section-note">
            <ShieldCheck size={16} />
            Your inputs stay on your device. No accounts, paywalls, or email
            gates.
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
                Less figuring it out. More getting it done. A practical
                collection to help you create, connect, and grow.
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
              <span className="micro">
                A real, useful PDF. No paid subscription required.
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GOOD SOFTWARE. CLEAR CHOICES.</span>
              <h2>Find the right AI for your work.</h2>
              <p>Thoughtful recommendations, with transparent information.</p>
            </div>
            <Link href="/ai-tools" className="text-link">
              Explore AI tools <ArrowRight size={17} />
            </Link>
          </div>
          {affiliates.length ? (
            <div className="resource-grid">
              {affiliates.slice(0, 3).map((a) => (
                <Link
                  className="resource-card panel"
                  href={`/ai-tools/${a.slug}`}
                  key={a.id}
                >
                  <span className="tool-icon lavender">
                    <Sparkles />
                  </span>
                  <span className="micro">
                    {a.affiliate ? "AFFILIATE LISTING" : "OFFICIAL WEBSITE"}
                  </span>
                  <h3>{a.name}</h3>
                  <p>{a.description}</p>
                  <span className="text-link">
                    Explore tool <ArrowUpRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="recommendation-intro panel">
              <span className="tool-icon lavender">
                <Sparkles size={26} />
              </span>
              <div>
                <h3>Better choices start with better information.</h3>
                <p>
                  Our directory is ready for verified listings. Explore how we
                  compare features, limitations, and pricing—without invented
                  ratings.
                </p>
              </div>
              <Link className="button secondary" href="/ai-tools">
                Visit directory <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="section tinted">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CONNECT THE DOTS</span>
              <h2>Build a workflow that works for you.</h2>
            </div>
            <Link href="/workflows" className="text-link">
              All workflows <ArrowRight size={17} />
            </Link>
          </div>
          <div className="workflow-grid">
            {workflows.slice(0, 2).map((w, i) => (
              <Link
                className="workflow-card panel"
                href={`/workflows/${w.slug}`}
                key={w.slug}
              >
                <div className={`workflow-illustration flow-${i}`}>
                  <span>
                    <FileText size={25} />
                  </span>
                  <i />
                  <span>
                    <Sparkles size={25} />
                  </span>
                  <i />
                  <span>
                    <Check size={25} />
                  </span>
                </div>
                <span className="eyebrow">{w.category}</span>
                <h3>{w.title}</h3>
                <p>{w.description}</p>
                <span className="text-link">
                  See the workflow <ArrowUpRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A LITTLE KNOW-HOW GOES A LONG WAY</span>
              <h2>Ideas you can put to work.</h2>
            </div>
            <Link href="/resources" className="text-link">
              Explore resources <ArrowRight size={17} />
            </Link>
          </div>
          <div className="resource-grid">
            {articles.slice(0, 2).map((a, i) => (
              <Link
                className="resource-card"
                href={`/blog/${a.slug}`}
                key={a.slug}
              >
                <div className={`article-art article-${i}`}>
                  <span>
                    {i === 0
                      ? "Make your\nwork count."
                      : "Good input.\nBetter output."}
                  </span>
                  {i === 0 ? <BarChart3 size={72} /> : <Sparkles size={72} />}
                </div>
                <span className="eyebrow">{a.category}</span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <span className="text-link">
                  Read the guide <ArrowUpRight size={15} />
                </span>
              </Link>
            ))}
            <Link href="/templates" className="resource-card">
              <div className="article-art article-2">
                <span>
                  Your blank page.
                  <br />
                  Already started.
                </span>
                <BookOpen size={72} />
              </div>
              <span className="eyebrow">TEMPLATES</span>
              <h3>A better starting point for everyday work.</h3>
              <p>
                Client proposals and content calendars you can make your own.
              </p>
              <span className="text-link">
                Find a template <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section newsletter-section">
        <div className="container newsletter">
          <div>
            <span className="eyebrow">A USEFUL LITTLE EMAIL</span>
            <h2>
              Fresh tools. Better ideas.
              <br />
              Straight to your inbox.
            </h2>
            <p>Occasional resources for work that moves you forward.</p>
          </div>
          <EmailForm newsletter />
        </div>
      </section>
    </>
  );
}
