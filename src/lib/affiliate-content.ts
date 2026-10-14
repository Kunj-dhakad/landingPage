import { offers } from "./offers";
/** Directory seed records. Fields here map 1:1 to the AffiliateTool table. */
const listing = (
  slug: string,
  name: string,
  officialUrl: string,
  category: string,
  description: string,
  body: string,
  pricingModel: "FREE" | "FREEMIUM" | "PAID" | "UNVERIFIED",
  pricingDescription: string,
  freePlan: string,
  features: string[],
  advantages: string[],
  limitations: string[],
  platforms: string[],
  useCases: string[],
  featured = false,
) => ({
  slug,
  name,
  description,
  body,
  category,
  pricingModel,
  pricingDescription,
  freePlan,
  features,
  advantages,
  limitations,
  platforms,
  useCases,
  officialUrl,
  destinationUrl: null as string | null,
  affiliate: false,
  published: true,
  featured,
  lastVerifiedAt: null as Date | null,
});
export const affiliateContent = [
  {
    ...listing(
      "chatgpt",
      "ChatGPT",
      "https://chatgpt.com/",
      "AI & Productivity",
      "An AI assistant for drafting, explaining ideas, and working through everyday tasks.",
      "ChatGPT supports conversational assistance for writing, questions, and creative work. Review outputs for accuracy and choose privacy settings appropriate to your information.\n\nOfficial source: https://chatgpt.com/overview/\n\nCurrent pricing and specific plan limits must be checked on the official website.",
      "FREEMIUM",
      "Free and paid plans are listed by the provider. Verify current prices and limits directly.",
      "A free plan is listed; limits apply.",
      ["Conversational assistance", "Drafting and editing", "Explaining concepts"],
      ["A flexible starting point for many tasks", "Useful for iterative drafting"],
      ["Outputs can be inaccurate", "Features and limits vary by plan"],
      ["Web", "Desktop"],
      ["Drafting", "Brainstorming", "Learning"],
      true,
    ),
    lastVerifiedAt: new Date("2026-10-13T00:00:00Z"),
  },
  listing(
    "claude",
    "Claude",
    "https://claude.ai/",
    "AI & Productivity",
    "A thoughtful AI assistant for long documents, careful writing, analysis, and coding help.",
    "Claude, made by Anthropic, is a general AI assistant that handles long inputs well: contracts, briefs, transcripts, and research notes. Many freelancers use it to turn messy notes into clear drafts and to review documents before sending them.\n\nOfficial source: https://www.anthropic.com/claude\n\nCheck the official website for current plans, usage limits, and data settings.",
    "FREEMIUM",
    "A free plan and paid plans are listed by the provider. Confirm current prices and usage limits directly.",
    "A free plan is listed; usage limits apply.",
    ["Long-document analysis", "Writing and editing", "Coding assistance", "File and image understanding"],
    ["Handles long briefs and documents", "Clear, structured writing", "Useful for reviewing and summarizing"],
    ["Usage limits vary by plan", "Outputs still need fact-checking"],
    ["Web", "Desktop", "Mobile"],
    ["Drafting", "Document review", "Research", "Coding"],
    true,
  ),
  listing(
    "perplexity",
    "Perplexity",
    "https://www.perplexity.ai/",
    "Research",
    "An AI answer engine that searches the web and shows the sources behind each answer.",
    "Perplexity answers questions by searching the web and citing the pages it used, so you can check claims before relying on them. It suits quick market research, competitor lookups, and fact-finding for content.\n\nOfficial source: https://www.perplexity.ai/\n\nConfirm current plans and limits on the official website.",
    "FREEMIUM",
    "Free and paid plans are listed by the provider. Confirm current prices directly.",
    "A free plan is listed; advanced features are limited.",
    ["Web search with citations", "Follow-up questions", "Research collections"],
    ["Answers link to sources", "Fast for quick research"],
    ["Cited sources can still be wrong or outdated", "Advanced models depend on plan"],
    ["Web", "Mobile", "Desktop"],
    ["Research", "Fact-finding", "Competitor research"],
  ),
  {
    ...listing(
      "notion-ai",
      "Notion AI",
      "https://www.notion.com/product/ai",
      "Productivity",
      "AI assistance inside a workspace for documents, information, and team processes.",
      "Notion presents AI capabilities for finding information, drafting documents, and supporting team workflows. Its product page lists agents, enterprise search, and meeting notes.\n\nOfficial source: https://www.notion.com/product/ai\n\nThe free workspace includes trial AI capabilities. Confirm ongoing access and pricing before choosing a plan.",
      "FREEMIUM",
      "Workspace plans and AI access vary. Confirm current pricing with Notion.",
      "Free workspace with trial AI capabilities; ongoing AI access varies.",
      ["Document assistance", "Enterprise search", "Meeting notes"],
      ["AI alongside workspace content", "Integrated information organization"],
      ["AI trial is limited on the free workspace", "Workspace permissions and plan requirements need review"],
      ["Web"],
      ["Documentation", "Knowledge management", "Team workflows"],
      true,
    ),
    lastVerifiedAt: new Date("2026-10-13T00:00:00Z"),
  },
  {
    ...listing(
      "zapier",
      "Zapier",
      "https://zapier.com/",
      "Automation",
      "Connect apps and build automation workflows, with AI features and agents.",
      "Zapier is an automation platform connecting apps and workflows. It presents tools for AI automation and agents. Start with a small workflow, test its failure cases, and review access permissions before expanding.\n\nOfficial source: https://zapier.com/\n\nConfirm supported integrations, task limits, and pricing directly.",
      "UNVERIFIED",
      "Current plans, prices, and task quotas have not been verified for this listing.",
      "Check the official website for current availability and limits.",
      ["App connections", "Workflow automation", "AI agents"],
      ["Connects existing apps", "Can reduce repetitive handoffs"],
      ["Usage limits and supported integrations vary", "Automations require testing and monitoring"],
      ["Web"],
      ["Lead routing", "Notifications", "Process automation"],
      true,
    ),
    lastVerifiedAt: new Date("2026-10-13T00:00:00Z"),
  },
  listing(
    "make",
    "Make",
    "https://www.make.com/",
    "Automation",
    "A visual automation builder for connecting apps, with branching logic and AI steps.",
    "Make lets you build automations on a visual canvas: each app is a module, and you can see data move between them. It suits people who want detailed control over branching, filtering, and error handling.\n\nOfficial source: https://www.make.com/\n\nUsage is measured in operations or credits. Confirm current plan limits and prices on the official website.",
    "FREEMIUM",
    "A free plan and paid plans are listed. Usage is metered; confirm current limits and prices.",
    "A free plan is listed with a monthly usage allowance.",
    ["Visual scenario builder", "Routers and filters", "Error handling", "AI modules"],
    ["See the whole workflow at a glance", "Fine control over complex logic"],
    ["The canvas takes time to learn", "Metered usage needs monitoring"],
    ["Web"],
    ["Lead routing", "Process automation", "Data syncing"],
  ),
  listing(
    "canva",
    "Canva",
    "https://www.canva.com/",
    "Design",
    "Design social posts, presentations, documents, and brand assets from templates, with AI features.",
    "Canva is a browser-based design tool with a large template library. Non-designers use it for social media graphics, proposals, presentations, and short videos. AI features help generate and edit images and text.\n\nOfficial source: https://www.canva.com/\n\nTemplate and element licensing differs between free and paid content. Confirm current plans and license terms.",
    "FREEMIUM",
    "A free plan and paid plans are listed. Confirm current prices and which assets each plan includes.",
    "A free plan is listed; some templates and features are paid.",
    ["Templates for social, docs, and slides", "Brand kits", "AI image and text tools", "Team collaboration"],
    ["Fast results without design training", "Large template library"],
    ["Designs can look template-like without customization", "Some assets need a paid plan"],
    ["Web", "Desktop", "Mobile"],
    ["Social media graphics", "Presentations", "Brand assets"],
    true,
  ),
  listing(
    "grammarly",
    "Grammarly",
    "https://www.grammarly.com/",
    "Writing",
    "A writing assistant that checks grammar, clarity, and tone wherever you type.",
    "Grammarly checks spelling, grammar, and clarity in your browser, email, and documents. Its AI features can rewrite sentences and adjust tone, which helps when English is your second language or when client messages need to sound polished.\n\nOfficial source: https://www.grammarly.com/\n\nConfirm current features and plan prices on the official website.",
    "FREEMIUM",
    "A free plan and paid plans are listed. Confirm current prices directly.",
    "A free plan is listed with core grammar and spelling checks.",
    ["Grammar and spelling checks", "Clarity and tone suggestions", "AI rewriting", "Browser and app integrations"],
    ["Works across many apps", "Helpful for client-facing writing"],
    ["Advanced suggestions require a paid plan", "Suggestions can flatten your personal voice"],
    ["Web", "Desktop", "Mobile", "Browser extension"],
    ["Editing", "Client emails", "Proofreading"],
  ),
  listing(
    "gamma",
    "Gamma",
    "https://gamma.app/",
    "Presentations",
    "Create presentations, documents, and simple web pages from a prompt or outline.",
    "Gamma turns an outline or a short prompt into a styled presentation, document, or one-page site that you can edit. It is useful for pitch decks, proposals, and client reports when speed matters more than pixel-perfect control.\n\nOfficial source: https://gamma.app/\n\nAI actions use credits. Confirm current credit allowances and plan prices.",
    "FREEMIUM",
    "A free plan and paid plans are listed. AI generation uses credits; confirm current allowances.",
    "A free plan is listed with a one-time AI credit allowance.",
    ["Prompt-to-deck generation", "Editable cards and layouts", "Export and sharing", "Simple web pages"],
    ["Very fast first drafts", "Good-looking defaults"],
    ["Free AI credits do not refresh", "Less layout control than traditional slide tools"],
    ["Web"],
    ["Pitch decks", "Proposals", "Client reports"],
    true,
  ),
  listing(
    "descript",
    "Descript",
    "https://www.descript.com/",
    "Video & Audio",
    "Edit video and podcasts by editing the transcript, with AI cleanup tools.",
    "Descript transcribes your recording so you can cut video and audio by deleting text. It includes tools to remove filler words, add captions, and clip short social videos, which makes it popular with creators and podcasters.\n\nOfficial source: https://www.descript.com/\n\nFree exports may be limited or watermarked. Confirm current media limits and prices.",
    "FREEMIUM",
    "A free plan and paid plans are listed. Confirm current media limits and prices directly.",
    "A free plan is listed with limited monthly media and export restrictions.",
    ["Text-based video editing", "Automatic transcription", "Filler-word removal", "Captions and clips"],
    ["Editing feels like editing a document", "Speeds up podcast and talking-head video work"],
    ["Free exports are limited", "Heavy projects need a capable computer and connection"],
    ["Web", "Desktop"],
    ["Podcasts", "YouTube videos", "Social clips"],
  ),
  listing(
    "elevenlabs",
    "ElevenLabs",
    "https://elevenlabs.io/",
    "Video & Audio",
    "Generate natural-sounding voiceovers and audio in many languages.",
    "ElevenLabs produces AI voiceovers from text, with a library of voices and multilingual output. Creators use it for video narration, explainer content, and audio versions of articles.\n\nOfficial source: https://elevenlabs.io/\n\nCommercial-use rights depend on your plan. Confirm current credits, licensing, and prices before publishing.",
    "FREEMIUM",
    "A free plan and paid plans are listed. Usage is credit-based; confirm current limits and licensing.",
    "A free plan is listed with limited monthly credits; commercial use terms vary.",
    ["Text to speech", "Voice library", "Multilingual output", "Dubbing tools"],
    ["Natural-sounding output", "Many languages and voices"],
    ["Commercial rights depend on plan", "Voice cloning raises consent and ethics questions"],
    ["Web", "API"],
    ["Voiceovers", "Explainer videos", "Audio articles"],
  ),
  listing(
    "semrush",
    "Semrush",
    "https://www.semrush.com/",
    "SEO & Marketing",
    "Research keywords, audit your site, and track competitors to grow search traffic.",
    "Semrush is a suite for SEO and online marketing: keyword research, site audits, rank tracking, and competitor analysis. It is most useful once you publish content regularly and want data on what to write next.\n\nOfficial source: https://www.semrush.com/\n\nFull access is paid. Confirm current toolkits, limits, and prices on the official website.",
    "FREEMIUM",
    "Paid toolkits are listed, along with a limited free account. Confirm current prices and trial availability.",
    "A limited free account is listed; most features need a paid plan.",
    ["Keyword research", "Site audits", "Rank tracking", "Competitor analysis"],
    ["Broad, detailed SEO data", "Shows what competitors rank for"],
    ["Expensive for beginners", "A lot of data to learn"],
    ["Web"],
    ["Keyword research", "Content planning", "Competitor research"],
  ),
  listing(
    "hostinger",
    "Hostinger",
    "https://www.hostinger.com/",
    "Websites",
    "Web hosting and an AI website builder for getting a portfolio or business site online.",
    "Hostinger offers web hosting, domains, business email, and a website builder with AI features. For a freelancer, it is one route to a portfolio site on your own domain instead of a profile on someone else's platform.\n\nOfficial source: https://www.hostinger.com/\n\nIntroductory prices often differ from renewal prices. Check both, along with the contract length, before buying.",
    "PAID",
    "Paid plans only. Introductory and renewal prices differ; confirm both before buying.",
    "No free plan is listed.",
    ["Web hosting", "AI website builder", "Domains", "Business email"],
    ["Low entry price for a first website", "Builder and hosting in one place"],
    ["Renewal prices are higher than introductory prices", "Longer contracts may be needed for the lowest price"],
    ["Web"],
    ["Portfolio sites", "Small business websites", "Landing pages"],
  ),
  listing(
    "otter-ai",
    "Otter.ai",
    "https://otter.ai/",
    "Productivity",
    "Record, transcribe, and summarize meetings so you can focus on the conversation.",
    "Otter.ai joins or records your meetings, transcribes them, and creates summaries and action items. It is useful for client discovery calls, interviews, and team meetings when notes matter.\n\nOfficial source: https://otter.ai/\n\nAlways tell participants a meeting is being recorded. Confirm current transcription limits and prices.",
    "FREEMIUM",
    "A free plan and paid plans are listed. Confirm current transcription limits and prices.",
    "A free plan is listed with limited monthly transcription.",
    ["Live transcription", "Meeting summaries", "Action items", "Calendar integration"],
    ["Saves note-taking time", "Searchable meeting history"],
    ["Recording needs participant consent", "Accuracy drops with poor audio or heavy accents"],
    ["Web", "Mobile"],
    ["Client calls", "Interviews", "Meeting notes"],
  ),
  ...offers.map((o) => ({
    ...listing(
      o.slug,
      o.name,
      o.officialUrl,
      o.category,
      o.tagline + ".",
      o.summary,
      "PAID",
      o.pricing.map((p) => `${p.plan}: ${p.price}`).join(". ") +
        ". Confirm the final price at checkout.",
      "No free plan; covered by a money-back guarantee per the vendor.",
      o.features.map((f) => f.title),
      o.pros,
      o.cons,
      ["Web"],
      o.features.slice(0, 3).map((f) => f.title),
      true,
    ),
    affiliate: true,
    destinationUrl: o.affiliateUrl as string | null,
    lastVerifiedAt: new Date("2026-10-14T00:00:00Z") as Date | null,
  })),
];

export const hasFreePlan = (pricingModel: string) =>
  pricingModel === "FREE" || pricingModel === "FREEMIUM";

export type Goal =
  | "write"
  | "research"
  | "design"
  | "video"
  | "voice"
  | "automate"
  | "organize"
  | "seo"
  | "present"
  | "website"
  | "code"
  | "meetings"
  | "clients";
export type Audience = "freelancer" | "creator" | "marketer" | "business" | "developer";
export type Editorial = {
  bestFor: string;
  verdict: string;
  notFor: string[];
  gettingStarted: string[];
  goals: Goal[];
  audiences: Audience[];
};

/** Our own recommendation copy. Kept out of the database so it ships with code review. */
export const affiliateEditorial: Record<string, Editorial> = {
  chatgpt: {
    bestFor: "An all-round AI assistant for everyday work",
    verdict:
      "If you only try one AI tool, start here. It handles drafting, brainstorming, explaining, and quick analysis well enough that most people find a use for it on day one.",
    notFor: ["Work where every fact must be correct without checking", "Confidential client data on settings you have not reviewed"],
    gettingStarted: [
      "Create a free account and turn on the data settings that match your work.",
      "Copy one prompt from our prompt library and replace the placeholders.",
      "Ask it to list assumptions and missing information before you use the draft.",
    ],
    goals: ["write", "research", "code"],
    audiences: ["freelancer", "creator", "marketer", "business", "developer"],
  },
  claude: {
    bestFor: "Long documents, careful writing, and reviewing work",
    verdict:
      "Strong when the input is long: client briefs, contracts, transcripts, or a pile of notes. Freelancers who write for a living often prefer its tone for first drafts.",
    notFor: ["Live web research (use a search-first tool)", "Image or video creation"],
    gettingStarted: [
      "Sign up for the free plan.",
      "Paste a real brief or document and ask for a summary plus open questions.",
      "Use a Project to keep your style guide and examples in one place.",
    ],
    goals: ["write", "research", "code"],
    audiences: ["freelancer", "creator", "business", "developer"],
  },
  perplexity: {
    bestFor: "Quick research with sources you can check",
    verdict:
      "The fastest way to answer a factual question and see where the answer came from. Use it before you write, then draft in a writing-focused assistant.",
    notFor: ["Long-form writing", "Tasks with no need for web sources"],
    gettingStarted: [
      "Ask a question about your market or a competitor.",
      "Open two of the cited sources and confirm the key facts.",
      "Save useful threads into a collection for later.",
    ],
    goals: ["research", "seo"],
    audiences: ["freelancer", "marketer", "business", "creator"],
  },
  "notion-ai": {
    bestFor: "Keeping notes, docs, and projects in one searchable place",
    verdict:
      "Worth it if Notion is already where your work lives. The AI is most useful for finding and summarizing your own information, not as a standalone chatbot.",
    notFor: ["People who do not want to move their notes into Notion", "Heavy, standalone AI writing"],
    gettingStarted: [
      "Create a free workspace and import one existing project.",
      "Try the AI on a real page: summarize it and extract action items.",
      "Decide after the trial whether AI is worth adding to your plan.",
    ],
    goals: ["organize", "meetings", "write"],
    audiences: ["freelancer", "business", "creator"],
  },
  zapier: {
    bestFor: "Simple, reliable automations between popular apps",
    verdict:
      "The easiest automation tool to start with and it connects to a huge number of apps. Begin with one repetitive task, like saving form leads to a spreadsheet.",
    notFor: ["Very high-volume automations on a tight budget", "People who want to see complex logic visually"],
    gettingStarted: [
      "List one task you repeat every week.",
      "Build that single automation and test it with sample data.",
      "Add an alert so you notice when it fails.",
    ],
    goals: ["automate"],
    audiences: ["freelancer", "business", "marketer"],
  },
  make: {
    bestFor: "Visual automations with branching logic and more control",
    verdict:
      "A good choice when your automation needs conditions, loops, or several steps. The visual canvas makes it easier to understand what happens to your data.",
    notFor: ["Absolute beginners who want one-click setup", "Workflows you will never monitor"],
    gettingStarted: [
      "Start on the free plan with one lead-routing scenario.",
      "Add a filter so only qualified enquiries move forward.",
      "Check the operations used after a week before scaling.",
    ],
    goals: ["automate"],
    audiences: ["freelancer", "business", "marketer", "developer"],
  },
  canva: {
    bestFor: "Good-looking social posts, slides, and brand assets without a designer",
    verdict:
      "The quickest route from idea to a shareable design. Pair it with your own brand colours and fonts so your content does not look like everyone else's.",
    notFor: ["Complex illustration or professional print production", "Teams that need strict design-system control"],
    gettingStarted: [
      "Create a free account and set up your brand colours.",
      "Pick one template for each content type you post every week.",
      "Batch a week of posts in one sitting.",
    ],
    goals: ["design", "present", "video"],
    audiences: ["creator", "marketer", "business", "freelancer"],
  },
  grammarly: {
    bestFor: "Polished client emails and proposals, especially in a second language",
    verdict:
      "It quietly improves everything you type. Most valuable for client-facing writing where small mistakes cost trust.",
    notFor: ["Generating content from scratch", "Writers who want to keep a strongly personal style"],
    gettingStarted: [
      "Install the free browser extension.",
      "Write your next client email as usual and review the suggestions.",
      "Set your goals (audience and tone) for important documents.",
    ],
    goals: ["write"],
    audiences: ["freelancer", "business", "marketer", "creator"],
  },
  gamma: {
    bestFor: "Pitch decks and proposals in minutes",
    verdict:
      "Turns an outline into a presentable deck faster than anything else we cover. Edit the result so it says exactly what you mean.",
    notFor: ["Pixel-perfect brand presentations", "Heavy use on the free credits alone"],
    gettingStarted: [
      "Paste your proposal outline or meeting notes.",
      "Generate a draft and remove anything generic.",
      "Share a link with your client instead of attaching a file.",
    ],
    goals: ["present", "website"],
    audiences: ["freelancer", "business", "marketer"],
  },
  descript: {
    bestFor: "Editing podcasts and talking-head videos by editing text",
    verdict:
      "If you record yourself talking, it can cut editing time dramatically. Delete a sentence in the transcript and it disappears from the video.",
    notFor: ["Cinematic editing with complex effects", "Long projects on the free plan"],
    gettingStarted: [
      "Upload one short recording.",
      "Remove filler words and tighten the transcript.",
      "Export a captioned clip for social media.",
    ],
    goals: ["video", "voice"],
    audiences: ["creator", "marketer", "freelancer"],
  },
  elevenlabs: {
    bestFor: "Natural voiceovers for videos and explainers",
    verdict:
      "Good for faceless videos, product explainers, and translated narration. Check the commercial-use terms of your plan before publishing.",
    notFor: ["Cloning anyone's voice without clear consent", "Commercial work on a plan that does not allow it"],
    gettingStarted: [
      "Try a few library voices with your own script.",
      "Adjust stability and style until it sounds natural.",
      "Confirm the plan's licence before using it commercially.",
    ],
    goals: ["voice", "video"],
    audiences: ["creator", "marketer", "business"],
  },
  semrush: {
    bestFor: "Growing search traffic with real keyword and competitor data",
    verdict:
      "Powerful once you publish regularly and want to know what to write next. Overkill if you are not creating content yet.",
    notFor: ["Brand-new sites with no content plan", "Tight budgets that only need occasional keyword ideas"],
    gettingStarted: [
      "Create a free account and research five keywords for your service.",
      "Run a site audit and fix the top issues.",
      "Look at what one competitor ranks for that you do not.",
    ],
    goals: ["seo", "research"],
    audiences: ["marketer", "business", "creator"],
  },
  hostinger: {
    bestFor: "A low-cost first website on your own domain",
    verdict:
      "A practical way to get a portfolio or small business site live without hiring a developer. Compare the renewal price, not just the launch price.",
    notFor: ["Large, high-traffic applications", "Anyone who will not check renewal pricing"],
    gettingStarted: [
      "Choose the shortest contract you are comfortable with.",
      "Use the builder to publish a one-page portfolio first.",
      "Connect your domain and set up a professional email address.",
    ],
    goals: ["website"],
    audiences: ["freelancer", "business", "creator"],
  },
  "comic-videos-ai": {
    bestFor: "Faceless comic-style short videos without drawing or editing",
    verdict:
      "A fast way to produce a steady stream of comic-style Shorts and Reels. Worth it if you will post consistently.",
    notFor: ["Long-form or cinematic animation", "Anyone expecting results without consistent posting"],
    gettingStarted: [
      "Pick one niche and write ten story ideas.",
      "Generate three videos in one style.",
      "Post daily for two weeks and keep what works.",
    ],
    goals: ["video", "voice"],
    audiences: ["creator", "marketer", "freelancer"],
  },
  cuevue: {
    bestFor: "A talking AI rep that turns website visitors into leads",
    verdict:
      "Gives a website a live, talking assistant that answers questions and captures leads. Best on sites that already get traffic.",
    notFor: ["Brand-new sites with almost no visitors", "Businesses that cannot review AI answers"],
    gettingStarted: [
      "List your 15 most common customer questions.",
      "Add the rep to your highest-traffic page.",
      "Review the first 20 transcripts and fix answers.",
    ],
    goals: ["clients", "website", "automate"],
    audiences: ["business", "marketer", "freelancer"],
  },
  personaible: {
    bestFor: "Personalized video pitches that win local business clients",
    verdict:
      "Makes cold outreach stand out with a video that shows each prospect their own website. Budget for the required HeyGen key.",
    notFor: ["People not ready to do outreach consistently", "Anyone unwilling to pay for a HeyGen API key"],
    gettingStarted: [
      "Choose one niche and one 30-second script.",
      "Send ten personalized videos a day.",
      "Log every reply for two weeks.",
    ],
    goals: ["clients", "video"],
    audiences: ["freelancer", "marketer", "business"],
  },
  "otter-ai": {
    bestFor: "Accurate meeting notes and action items",
    verdict:
      "Lets you listen during client calls instead of typing. Always ask permission before recording.",
    notFor: ["Calls where recording is not allowed", "Poor-quality audio environments"],
    gettingStarted: [
      "Connect your calendar.",
      "Ask permission and record your next discovery call.",
      "Copy the action items into your project tool.",
    ],
    goals: ["meetings", "organize"],
    audiences: ["freelancer", "business"],
  },
};

export const goalLabels: Record<Goal, string> = {
  write: "Write faster and better",
  research: "Research and fact-finding",
  design: "Design graphics and social posts",
  video: "Make or edit videos",
  voice: "Create voiceovers and audio",
  automate: "Automate repetitive tasks",
  organize: "Organise notes and projects",
  seo: "Grow search traffic (SEO)",
  present: "Build decks and proposals",
  website: "Launch a website",
  code: "Write or debug code",
  meetings: "Take meeting notes",
  clients: "Find and win more clients",
};
export const audienceLabels: Record<Audience, string> = {
  freelancer: "Freelancer or consultant",
  creator: "Content creator",
  marketer: "Marketer",
  business: "Small business owner",
  developer: "Developer",
};

/** Contextual picks shown beside free tools of each category. */
export const categoryPicks: Record<string, string[]> = {
  Writing: ["grammarly", "claude"],
  Development: ["claude", "chatgpt"],
  Business: ["notion-ai", "gamma"],
  Marketing: ["canva", "semrush"],
};
