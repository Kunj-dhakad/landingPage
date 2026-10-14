import type { ContentItem } from "./content";

const promptBody = (title: string, prompt: string, tip: string) =>
  `# ${title}\n\n${prompt}\n\n## How to use\nReplace every bracketed placeholder with your own context. Share only information you have permission to use, and review the draft before sending or publishing.\n\n## Make it better\n${tip}\n\nWant help choosing an assistant? Try the [60-second AI Tool Finder](/ai-tools/finder) or compare [ChatGPT](/ai-tools/chatgpt) and [Claude](/ai-tools/claude).`;

const prompts: [string, string, string, string, string][] = [
  ["cold-outreach-email", "Marketing", "Write a cold outreach email", "Write a short cold email to [prospect role] at [company type]. Reference one specific observation about their business: [observation]. Offer [service] as a solution to [problem]. Keep it under 120 words, end with one low-pressure question, and avoid hype.", "Ask for three subject lines and a follow-up sent five days later."],
  ["linkedin-post-from-lesson", "Content", "Turn a lesson into a LinkedIn post", "Turn this project lesson into a LinkedIn post: [lesson and context]. Open with a specific moment, explain what changed, and end with a practical takeaway. Use short paragraphs, no hashtags in the body, and no invented numbers.", "Ask for two alternative hooks: one curious, one direct."],
  ["instagram-caption-set", "Content", "Write a week of Instagram captions", "Write seven Instagram captions for [business] targeting [audience]. Mix education, behind-the-scenes, and one soft offer for [product]. Each caption: a hook line, 2–4 short lines of value, and a clear call to action.", "Ask it to suggest a matching visual idea for each caption, then design them in Canva."],
  ["youtube-script-outline", "Content", "Outline a YouTube video", "Create a YouTube video outline about [topic] for [audience]. Include a 15-second hook, three main sections with examples, a mid-video reason to keep watching, and an ending that points to [next step]. Flag claims that need sources.", "Ask for five title options under 60 characters and test them with the SEO title checker."],
  ["blog-post-brief", "SEO", "Create an SEO blog brief", "Create a content brief for a blog post targeting [keyword]. Include search intent, the reader's main question, a suggested H2/H3 outline, questions to answer, internal link ideas to [your pages], and what would make this better than typical results.", "Validate the keyword's demand with an SEO tool before writing."],
  ["meta-description-set", "SEO", "Write meta descriptions", "Write three meta descriptions for a page about [topic] targeting [keyword]. Each must be 140–155 characters, include the keyword naturally, state a clear benefit, and avoid clickbait.", "Paste each into the free meta description checker to confirm the length."],
  ["faq-from-customer-questions", "SEO", "Turn customer questions into an FAQ", "Here are real questions customers ask: [questions]. Group duplicates, write a clear 2–3 sentence answer for each, and suggest which page of [website] each answer belongs on.", "Ask it to mark any answer that needs a policy or legal check."],
  ["sales-page-outline", "Sales", "Outline a sales page", "Outline a sales page for [offer] aimed at [audience]. Include the main problem, the promise, who it is and is not for, what is included, objections with honest answers, proof I can supply [proof], and a single call to action. Do not invent testimonials or results.", "Ask it to rewrite the headline in five ways and pick the clearest one."],
  ["objection-handling", "Sales", "Answer common sales objections", "List the five most likely objections to [offer] from [audience] (for example price, timing, trust). For each, write a respectful, honest response and a question that helps the buyer decide.", "Practice the responses out loud before your next sales call."],
  ["pricing-page-copy", "Sales", "Write pricing page copy", "Write copy for a pricing page with [number] packages for [service]. For each package: who it is for, what is included, and the outcome. Recommend which package to highlight and why. Keep prices as placeholders: [price].", "Calculate your package prices first with the project pricing calculator."],
  ["client-onboarding-email", "Freelancing", "Write a client onboarding email", "Write a welcome email for a new client of [service]. Confirm the scope [scope], list what I need from them by [date], explain how we will communicate, and set expectations for response times and revisions.", "Turn the list into a checklist using our client onboarding template."],
  ["late-payment-reminder", "Freelancing", "Send a polite payment reminder", "Write a polite payment reminder for invoice [number] of [amount] due on [date], now [days] days late. Stay friendly, restate payment details, and ask for an expected payment date. Write a firmer second version for 14 days later.", "Generate a clean invoice with the free invoice generator before sending."],
  ["scope-creep-response", "Freelancing", "Respond to scope creep", "A client asked for [new request], which is outside our agreed scope [scope]. Write a response that stays positive, explains it is additional work, offers a quote or a trade-off, and keeps the project moving.", "Ask for a version that offers two options so the client can choose."],
  ["testimonial-request", "Freelancing", "Ask for a testimonial", "Write a short message asking [client] for a testimonial after [project]. Make it easy: suggest three questions they can answer in two minutes, and ask permission to use their name and company.", "Only publish real testimonials with written permission."],
  ["meeting-summary", "Productivity", "Summarize a meeting", "Summarize this meeting transcript: [transcript]. Return decisions, action items with owners and dates, open questions, and risks. Quote exact wording for any commitments.", "A meeting recorder can produce the transcript; always get consent to record."],
  ["decision-matrix", "Productivity", "Make a decision matrix", "Help me decide between [options] for [goal]. Propose 5 weighted criteria, score each option with a short reason, and show the total. Then tell me what information would change the result.", "Use this before paying for any new software subscription."],
  ["inbox-triage", "Productivity", "Triage a busy inbox", "Here are subject lines and senders from my inbox: [list]. Sort them into reply today, schedule, delegate, and archive. Draft one-line replies for anything under two minutes.", "Never paste confidential email bodies into a tool without permission."],
  ["learn-new-skill", "Productivity", "Build a learning plan", "Create a 4-week plan to learn [skill] for [goal], with 5 hours per week. Include weekly outcomes, free resources to look for, one practice project, and a simple way to check progress.", "Ask it to quiz you at the end of each week."],
  ["brand-voice-guide", "Marketing", "Define your brand voice", "Based on these samples of my writing [samples] and my audience [audience], create a brand voice guide: three voice traits with do and don't examples, words to use and avoid, and a sample paragraph.", "Save it in a Claude Project or ChatGPT custom instructions so every draft matches."],
  ["ad-copy-variations", "Marketing", "Write ad copy variations", "Write ten ad headlines (max 30 characters) and five descriptions (max 90 characters) for [product] targeting [audience]. Focus on one clear benefit per line. No exaggerated claims.", "Track each variation with a UTM link from the free UTM builder."],
];

const promptItems: ContentItem[] = prompts.map(([slug, category, title, prompt, tip]) => ({
  slug,
  kind: "prompts",
  title,
  description: prompt.slice(0, 135) + "…",
  category,
  body: promptBody(title, prompt, tip),
}));

const templates: ContentItem[] = [
  {
    slug: "cold-outreach-email-template",
    kind: "templates",
    title: "A cold email that gets polite replies",
    description: "A short, respectful outreach template with a follow-up sequence.",
    category: "Sales",
    body: "# Cold outreach email\n\n**Subject:** Quick idea for [company]\n\nHi [Name],\n\nI noticed [specific observation about their business]. Many [their role]s I work with find that [problem] costs them [time/money/opportunity].\n\nI help [type of client] with [service], usually by [short method].\n\nWould it be useful if I sent a two-minute idea for [company]? If not, no problem at all.\n\n[Your name]\n[Portfolio link]\n\n## Follow-up (5 days later)\n\nHi [Name], just bringing this to the top of your inbox. Happy to share that idea, or I'll leave you be. Thanks!\n\n## Rules that keep it honest\n- Personalize the first line for real. Generic flattery is obvious.\n- One clear question, easy to decline.\n- Stop after two follow-ups.\n- Respect anti-spam rules in your country and theirs.",
  },
  {
    slug: "payment-reminder-template",
    kind: "templates",
    title: "Payment reminders that stay friendly",
    description: "Three escalating reminders for late invoices, from gentle to firm.",
    category: "Freelancing",
    body: "# Payment reminder sequence\n\n## 1. On the due date\nHi [Name], a friendly reminder that invoice [number] for [amount] is due today. Payment details are attached. Thanks again for the work together!\n\n## 2. Seven days late\nHi [Name], invoice [number] for [amount] is now seven days past due. Could you let me know when I can expect payment? Happy to resend anything you need.\n\n## 3. Fourteen days late\nHi [Name], invoice [number] for [amount] is now 14 days overdue. As per our agreement, [late fee or next step]. Please confirm a payment date by [date].\n\n## Make it easier to get paid\n- Create clear invoices with the [free invoice generator](/free-tools/invoice-generator).\n- Indian freelancers: calculate tax correctly with the [GST calculator](/free-tools/gst-calculator).\n- Put payment terms in the proposal, not after the work is done.",
  },
  {
    slug: "client-onboarding-checklist",
    kind: "templates",
    title: "Client onboarding checklist",
    description: "Everything to collect and confirm before a project starts.",
    category: "Freelancing",
    body: "# Client onboarding checklist\n\n## Before kickoff\n- [ ] Signed agreement or approved proposal\n- [ ] Deposit received\n- [ ] Main contact and decision maker confirmed\n- [ ] Communication channel and response times agreed\n\n## Collect from the client\n- [ ] Brand assets (logo, colours, fonts)\n- [ ] Access to tools and accounts (shared securely, never by plain email)\n- [ ] Examples they like and dislike\n- [ ] Deadlines and key dates\n\n## Set up on your side\n- [ ] Project folder and task board\n- [ ] Kickoff meeting booked\n- [ ] Milestones and review dates in the calendar\n- [ ] Invoice schedule set\n\n## After kickoff\n- [ ] Send a written summary of decisions\n- [ ] Confirm the first deliverable date\n\nTip: a notes tool like [Notion](/ai-tools/notion-ai) keeps this checklist reusable for every client.",
  },
  {
    slug: "project-brief-template",
    kind: "templates",
    title: "A project brief clients can actually fill in",
    description: "A one-page brief that turns vague requests into clear scope.",
    category: "Freelancing",
    body: "# Project brief\n\n**Project name:** [ ]\n**Company:** [ ]\n**Main contact:** [ ]\n\n## 1. What do you want to achieve?\n[The business goal, not the deliverable.]\n\n## 2. Who is it for?\n[Audience, their main problem, where they will see this.]\n\n## 3. What does success look like?\n[How will you know this worked? Numbers if possible.]\n\n## 4. What do you need delivered?\n[Formats, sizes, quantities.]\n\n## 5. Examples\n[Three things you like and why. One thing you do not like.]\n\n## 6. Budget and timing\n[Budget range, hard deadlines, launch date.]\n\n## 7. Anything else?\n[Constraints, approvals, legal requirements.]\n\nReview the answers with the [brief review prompt](/prompts/brief-review) to spot gaps before quoting.",
  },
];

const workflows: ContentItem[] = [
  {
    slug: "invoice-to-payment",
    kind: "workflows",
    title: "From finished work to paid invoice, without awkward chasing",
    description: "A simple invoicing system with reminders that protects your cash flow.",
    category: "Freelancing",
    body: "# From finished work to paid invoice\n\n## What you need\nAn invoice template, a calendar, and a place to track who owes what. A spreadsheet is enough to start.\n\n## Steps\n1. Agree payment terms in the proposal: deposit, due date, late fee.\n2. Create the invoice the day work is approved using the [invoice generator](/free-tools/invoice-generator). Indian freelancers can add tax with the [GST calculator](/free-tools/gst-calculator).\n3. Add the due date and two reminder dates to your calendar.\n4. Send reminders using the [payment reminder template](/templates/payment-reminder-template).\n5. Log the payment and thank the client.\n\n## Automate it (optional)\nWhen you send more than a few invoices a month, an automation tool such as [Zapier](/ai-tools/zapier) or [Make](/ai-tools/make) can create reminder tasks automatically when an invoice row is added to your sheet. Start with one automation and test it with a fake invoice first.\n\n## Human checkpoints\nCheck every amount before sending. Never automate messages about disputes.",
  },
  {
    slug: "podcast-to-posts",
    kind: "workflows",
    title: "Turn one recording into a week of content",
    description: "Record once, then edit, clip, and write posts with AI help and human review.",
    category: "Content creation",
    body: "# One recording, a week of content\n\n## What you need\nA recording (podcast, video, or call you have permission to use), a transcript-based editor, an AI assistant, and a design tool.\n\n## Steps\n1. Record a 20–30 minute conversation or solo talk.\n2. Edit it by editing the transcript in a tool like [Descript](/ai-tools/descript): remove filler words and dead air.\n3. Pick three 30–60 second moments and export them as captioned clips.\n4. Paste the transcript into [Claude](/ai-tools/claude) or [ChatGPT](/ai-tools/chatgpt) with our [repurposing prompt](/prompts/content-repurposing-prompt) to draft posts and an email.\n5. Design quote graphics in [Canva](/ai-tools/canva).\n6. Schedule everything across the week.\n\n## Human checkpoints\nCheck every quote is accurate and in context. Get guest permission for clips. Remove any claim you cannot support.",
  },
  {
    slug: "lead-capture-automation",
    kind: "workflows",
    title: "Capture every lead automatically and reply within minutes",
    description: "Connect your form, spreadsheet, and email so no enquiry is forgotten.",
    category: "Automation",
    body: "# Lead capture automation\n\n## What you need\nA website form, a spreadsheet or CRM, an email account, and an automation tool such as [Zapier](/ai-tools/zapier) (simpler) or [Make](/ai-tools/make) (more control).\n\n## Steps\n1. Trigger: a new form submission.\n2. Add or update the contact in your sheet using the email address as the unique key.\n3. Send an acknowledgement email: what happens next and when.\n4. Create a follow-up task for yourself with a due date.\n5. Optional: notify yourself on your phone for high-budget enquiries.\n\n## Test before launch\nSubmit a real-looking lead, submit the same email twice, leave fields empty, and check every step behaves correctly.\n\n## Keep it safe\nOnly collect what you need. Do not send enquiry details to AI services without consent. See the full [lead intake workflow](/workflows/lead-intake) for the reasoning behind each step.",
  },
];

const guides: ContentItem[] = [
  {
    slug: "best-free-ai-tools-for-freelancers",
    kind: "blog",
    title: "The best free AI tools for freelancers (and when to upgrade)",
    description: "A short, honest shortlist by job: writing, research, design, video, automation, and meetings.",
    category: "AI tools",
    seoTitle: "Best Free AI Tools for Freelancers in 2026: Honest Picks by Job",
    seoDescription: "An honest shortlist of free AI tools for freelancers by job, with limitations and when paying is worth it.",
    body: "# The best free AI tools for freelancers\n\nThere are thousands of AI tools. You need four or five. This list is organized by the job you need done, and every pick has a usable free plan so you can test it on real work before paying anything.\n\n## Quick picks\n\n| Job | Our pick | Why |\n| --- | --- | --- |\n| All-round assistant | [ChatGPT](/ai-tools/chatgpt) | Handles most everyday tasks well |\n| Long documents and careful writing | [Claude](/ai-tools/claude) | Strong with briefs, contracts, transcripts |\n| Research with sources | [Perplexity](/ai-tools/perplexity) | Shows where answers came from |\n| Design | [Canva](/ai-tools/canva) | Templates for posts, decks, documents |\n| Client-ready writing | [Grammarly](/ai-tools/grammarly) | Catches mistakes everywhere you type |\n| Pitch decks | [Gamma](/ai-tools/gamma) | Outline to deck in minutes |\n| Video and podcasts | [Descript](/ai-tools/descript) | Edit video by editing text |\n| Automation | [Make](/ai-tools/make) or [Zapier](/ai-tools/zapier) | Removes repetitive admin |\n\n## How to choose without wasting money\n1. **Start with the job, not the tool.** Write down the one task that eats the most time each week.\n2. **Test on real work.** A free plan is only useful if you try it on an actual client task.\n3. **Upgrade only when you hit a limit that costs you money.** Paying makes sense when the time saved is worth more than the subscription.\n4. **Review subscriptions every quarter.** Cancel anything you have not used in a month.\n\n## When paying is worth it\nAs a rough rule: if a tool saves you two billable hours a month, the paid plan usually pays for itself. Use our [hourly rate calculator](/free-tools/freelance-hourly-rate-calculator) to know what your hour is worth.\n\n## What free plans do not tell you\nFree plans change often. Limits, credits, and watermarks vary, and commercial-use terms can differ by plan. Always confirm on the provider's website before relying on a free plan for client work.\n\n**Not sure where to start?** Take the [60-second AI Tool Finder](/ai-tools/finder) and get a shortlist matched to your work and budget.",
  },
  {
    slug: "chatgpt-vs-claude-for-freelancers",
    kind: "blog",
    title: "ChatGPT vs Claude: which should a freelancer use?",
    description: "Both are excellent. Here is how to choose based on the work you actually do.",
    category: "Comparisons",
    seoTitle: "ChatGPT vs Claude for Freelancers (2026): Which One to Use?",
    seoDescription: "An honest ChatGPT vs Claude comparison for freelancers: writing, long documents, research, and coding.",
    body: "# ChatGPT vs Claude for freelancers\n\nShort answer: both are excellent general assistants with free plans, and many freelancers use both. The better choice depends on the shape of your work.\n\n## Side by side\n\n| | ChatGPT | Claude |\n| --- | --- | --- |\n| Best at | All-round tasks, broad feature set | Long documents, careful writing |\n| Free plan | Yes, with limits | Yes, with limits |\n| Good for | Brainstorming, quick drafts, images | Briefs, contracts, transcripts, editing |\n| Watch out for | Confident mistakes | Usage limits on heavy days |\n\n## Choose ChatGPT if…\n- You want one tool for many kinds of tasks.\n- You often need quick brainstorming or image generation.\n- You like a large ecosystem of features and integrations.\n\n[Read our ChatGPT overview →](/ai-tools/chatgpt)\n\n## Choose Claude if…\n- You work with long inputs: client briefs, research notes, transcripts.\n- You write for a living and care about tone.\n- You want to keep a reusable style guide in a Project.\n\n[Read our Claude overview →](/ai-tools/claude)\n\n## A simple test\nTake one real task from this week, for example turning call notes into a proposal. Run the same prompt in both, using our [proposal prompt](/prompts/client-proposal-prompt). Keep whichever result needed fewer edits. That is your answer.\n\n## Either way\nFact-check outputs, protect client data, and do not paste anything confidential without checking the tool's data settings.\n\nWant to compare more tools side by side? Use the [comparison tool](/ai-tools/compare).",
  },
  {
    slug: "zapier-vs-make",
    kind: "blog",
    title: "Zapier vs Make: which automation tool fits your business?",
    description: "Simplicity versus control. How to pick the right automation platform for your first workflows.",
    category: "Comparisons",
    seoTitle: "Zapier vs Make (2026): Which Automation Tool Should You Choose?",
    seoDescription: "Zapier vs Make compared for freelancers and small businesses: ease of use, logic, pricing model, and when to choose each.",
    body: "# Zapier vs Make\n\nBoth tools connect your apps so repetitive work happens automatically. The difference is how you build.\n\n## The quick version\n\n| | Zapier | Make |\n| --- | --- | --- |\n| Building style | Step-by-step list | Visual canvas |\n| Learning curve | Easiest | Moderate |\n| Complex logic | Possible | A strength |\n| Usage measured in | Tasks | Operations or credits |\n\n## Pick Zapier if…\n- You want your first automation running in minutes.\n- Your workflows are straightforward: when X happens, do Y.\n- You need a very wide range of app connections.\n\n[See our Zapier overview →](/ai-tools/zapier)\n\n## Pick Make if…\n- Your workflow has conditions, branches, or loops.\n- You like seeing the whole flow visually.\n- You want detailed control over errors and data.\n\n[See our Make overview →](/ai-tools/make)\n\n## Your first automation\nStart with lead capture. Our [lead capture workflow](/workflows/lead-capture-automation) works with either tool and takes about an hour to set up and test.\n\n## Before you scale\nCheck how many tasks or operations your workflow uses in a normal week. That number, not the headline plan price, decides what you will really pay. Always confirm current pricing on each provider's website.",
  },
  {
    slug: "choose-ai-tools-without-wasting-money",
    kind: "blog",
    title: "How to choose AI tools without wasting money on subscriptions",
    description: "A five-step method to test tools on real work and only pay for what earns its place.",
    category: "AI tools",
    seoTitle: "How to Choose AI Tools Without Wasting Money",
    seoDescription: "A practical five-step method to test AI tools on real work and avoid paying for subscriptions you will not use.",
    body: "# How to choose AI tools without wasting money\n\nMost people do not overpay because tools are expensive. They overpay because they subscribe to tools they never really use. Here is a method that prevents that.\n\n## 1. Name the bottleneck\nWhat task takes the most time each week? Writing proposals, editing videos, chasing invoices? Pick one.\n\n## 2. Shortlist two tools, not ten\nUse the [AI Tool Finder](/ai-tools/finder) or our [directory](/ai-tools) to find two candidates for that one job. Every listing shows limitations, not just features.\n\n## 3. Test on a real task\nRun the same real task through both tools on their free plans. Measure the time it took and how much editing the result needed.\n\n## 4. Do the money maths\nIf the better tool saves you more time than its monthly price is worth at your hourly rate, upgrade. If not, stay on the free plan. Find your rate with the [hourly rate calculator](/free-tools/freelance-hourly-rate-calculator).\n\n## 5. Review every quarter\nList your subscriptions. Cancel anything you did not use last month.\n\n## Red flags when reading reviews\n- No limitations mentioned anywhere.\n- Ratings with no explanation of how they were produced.\n- Countdown timers and \"only today\" pressure.\n\nWe built NavoNixx to avoid those: every listing shows limitations, affiliate links are labeled, and we never invent ratings.",
  },
  {
    slug: "freelancer-website-checklist",
    kind: "blog",
    title: "What a freelancer website needs to win clients",
    description: "The seven sections that turn a portfolio into enquiries, and the cheapest way to launch one.",
    category: "Freelancing",
    seoTitle: "Freelancer Website Checklist: 7 Sections That Win Clients",
    seoDescription: "The seven sections every freelancer website needs, plus a low-cost way to launch your own site on your own domain.",
    body: "# What a freelancer website needs to win clients\n\nA profile on a marketplace is rented space. Your own site, on your own domain, is something you control. It does not need to be big. It needs to be clear.\n\n## The seven sections\n1. **A clear headline:** who you help and with what. \"I design websites for dental clinics\" beats \"Creative designer\".\n2. **Proof:** two or three case studies with the problem, your approach, and the result. Use the [case study prompt](/prompts/portfolio-case-study).\n3. **Services:** what you offer, who it is for, and a starting price or range.\n4. **Process:** three or four steps so clients know what working with you feels like.\n5. **Testimonials:** real ones, with permission. Ask using the [testimonial request prompt](/prompts/testimonial-request).\n6. **About:** a human paragraph and a photo.\n7. **Contact:** one simple form and an expected reply time.\n\n## How to launch cheaply\n- A one-page site is enough to start.\n- Website builders with hosting, such as [Hostinger](/ai-tools/hostinger), let you publish without a developer. Compare renewal prices, not just launch prices.\n- Make deck-style proposals and simple pages quickly with [Gamma](/ai-tools/gamma).\n- Design your visuals in [Canva](/ai-tools/canva).\n\n## Before you publish\nCheck every page title and description with our free [SEO title checker](/free-tools/seo-title-checker) and [meta description checker](/free-tools/meta-description-checker), and preview social sharing with the [Open Graph preview](/free-tools/open-graph-preview).",
  },
  {
    slug: "gst-invoice-guide-for-freelancers",
    kind: "blog",
    title: "GST and invoices for Indian freelancers: a plain-language guide",
    description: "When GST applies, what an invoice should include, and how to calculate it correctly.",
    category: "Freelancing",
    seoTitle: "GST for Freelancers in India: Invoices & Calculation Guide",
    seoDescription: "A plain-language guide for Indian freelancers on GST invoices and calculating GST-inclusive and exclusive amounts.",
    body: "# GST and invoices for Indian freelancers\n\nThis guide explains the basics in plain language. Tax rules change and depend on your situation, so confirm details with a qualified tax adviser before acting.\n\n## Do you need to register?\nGST registration depends on factors such as your turnover, the type of service, and whether you serve clients in other states or countries. Check current thresholds on the official GST portal or with an adviser.\n\n## What a good invoice includes\n- Your name, address, and GSTIN (if registered)\n- Client name and address (and GSTIN for business clients)\n- Invoice number and date\n- Description of services\n- Taxable value, GST rate, and tax amount\n- Total amount and payment terms\n\nCreate one in a minute with the [free invoice generator](/free-tools/invoice-generator).\n\n## Adding vs extracting GST\n- **Adding GST:** your price is ₹10,000 before tax. At 18%, tax is ₹1,800 and the total is ₹11,800.\n- **Extracting GST:** a client paid ₹11,800 including 18% GST. The taxable value is ₹10,000 and the tax is ₹1,800.\n\nThe [GST calculator](/free-tools/gst-calculator) does both directions instantly.\n\n## Keep records\nKeep every invoice and payment record in one organized place. A workspace tool such as [Notion](/ai-tools/notion-ai) or a well-structured spreadsheet works.\n\n## Get paid on time\nUse the [payment reminder template](/templates/payment-reminder-template) and agree terms before you start.",
  },
];

export const contentLibrary: ContentItem[] = [
  ...promptItems,
  ...templates,
  ...workflows,
  ...guides,
];
