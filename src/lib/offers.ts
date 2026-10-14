import { assetUrl } from "./media-assets";

/**
 * Paid affiliate products with full review pages. Facts come from each vendor's
 * public sales and partner pages; prices are as listed on `checkedOn` and must be
 * re-checked when vendors change their offers.
 */
export type Offer = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  /** Tracked affiliate link. Served through /go/[slug] when the database is configured. */
  affiliateUrl: string;
  officialUrl: string;
  summary: string;
  verdict: string;
  bestFor: string;
  checkedOn: string;
  facts: { label: string; value: string }[];
  steps: { title: string; text: string }[];
  features: { title: string; text: string }[];
  goodFit: string[];
  notFor: string[];
  pros: string[];
  cons: string[];
  pricing: { plan: string; price: string; note: string }[];
  pricingNotes: string[];
  coupon?: { code: string; note: string };
  bonus: { title: string; checklist: string[] };
  faqs: [string, string][];
  media?: {
    poster: string;
    images: { src: string; alt: string }[];
    videos: { src: string; poster: string; title: string }[];
  };
};

export const offers: Offer[] = [
  {
    slug: "comic-videos-ai",
    name: "Comic Videos AI",
    tagline: "Turn a text idea or photo into a comic-style short video",
    category: "Video & Audio",
    affiliateUrl: "https://jvz8.com/c/3615703/454633",
    officialUrl: "https://sales.comicvideosai.com/fe/",
    summary:
      "Comic Videos AI is a web app that turns a text prompt or uploaded photo into a comic-style short video. It writes the script, draws the panels, keeps characters consistent, and adds voiceover, music, and captions, ready to export for Reels, Shorts, and TikTok.",
    verdict:
      "A fun, fast way to produce a steady stream of faceless comic-style shorts without drawing or editing skills. Best value if you will actually publish regularly; skip the upgrades until the base app proves itself for you.",
    bestFor: "Faceless short-form video creators and kids' content channels",
    checkedOn: "14 Oct 2026",
    facts: [
      { label: "Payment", value: "One-time (at time of checking)" },
      { label: "Guarantee", value: "30-day money-back" },
      { label: "Works in", value: "Web browser" },
      { label: "Output", value: "9:16 vertical video" },
    ],
    steps: [
      { title: "Describe or upload", text: "Type a story idea or upload a photo you have the rights to use." },
      { title: "Pick a style", text: "Choose an art style such as manga, noir, anime, or cyberpunk." },
      { title: "Generate and export", text: "The app builds panels, voices, music, and captions, then exports a vertical video." },
    ],
    features: [
      { title: "Text-to-comic and photo-to-comic", text: "Start from a prompt or a photo; the app writes the script and draws the panels." },
      { title: "Consistent characters", text: "The vendor says characters keep the same face, outfit, and style across panels." },
      { title: "Voices, music, captions", text: "Multi-character AI voiceovers, a background music library, and caption styles." },
      { title: "Multiple art styles", text: "Manga, noir, anime, cyberpunk, and more." },
      { title: "Comic book generator", text: "Create multi-page digital comic books, not just videos." },
      { title: "Niche packs and training", text: "Pre-loaded niche packs and step-by-step training to get started." },
    ],
    goodFit: [
      "run or want to start a faceless YouTube Shorts, Reels, or TikTok channel",
      "make kids' stories or family-friendly animated content",
      "want to offer short comic-style videos to local businesses",
    ],
    notFor: [
      "Long-form, cinematic, or frame-by-frame controlled animation",
      "Anyone expecting views or income without consistent posting",
    ],
    pros: [
      "No drawing, editing, or voice skills needed",
      "Script, art, voice, music, and captions in one place",
      "One-time payment for the front-end at time of checking",
      "30-day money-back guarantee",
    ],
    cons: [
      "Several optional upgrades are offered after purchase",
      "Credit allowances and commercial-rights duration are described inconsistently on the sales page; confirm at checkout",
      "AI output still needs review before publishing",
    ],
    pricing: [
      { plan: "Premium (front-end)", price: "$36.95", note: "Vendor lists $30.95 with code CVAI6OFF" },
      { plan: "Bundle (all upgrades + extras)", price: "$367", note: "Vendor lists $267 with code CVB100" },
    ],
    pricingNotes: [
      "Our link opens the vendor's bundle page; the lower-priced Premium option is also available.",
      "The vendor says launch pricing may move to a subscription. Check the price and terms shown at checkout.",
      "Optional upgrades (PRO, Automation, Agency, Growth) are sold separately or included in the bundle.",
    ],
    coupon: { code: "CVB100", note: "Vendor-advertised bundle coupon. Codes can expire at any time." },
    bonus: {
      title: "Comic Videos AI quick-start plan",
      checklist: [
        "Pick one niche (kids' stories, history facts, motivational, or local business) and stick to it for 30 days.",
        "Write 10 one-sentence story ideas before you open the app.",
        "Generate 3 videos in one style and keep the best one as your channel's look.",
        "Post one video a day for 14 days; review which hooks kept viewers watching.",
        "Use our free UTM link builder to track links in your bio.",
        "Request a refund within the 30-day window if it does not fit your workflow.",
      ],
    },
    faqs: [
      ["Is Comic Videos AI a one-time payment?", "At the time we checked, the front-end and bundle were one-time payments. The vendor says pricing may move to a subscription, so confirm at checkout."],
      ["Is there a refund policy?", "The sales page lists a 30-day money-back guarantee, handled by the vendor."],
      ["Do I need design or editing skills?", "No. The app handles script, panels, voice, music, and captions. You choose the idea and style."],
      ["Will this make me money?", "No tool can promise that. Results depend on your niche, consistency, and audience. The vendor's own page says income examples are not typical."],
    ],
    media: {
      poster: assetUrl("/images/mockup-duo-scene.webp"),
      images: [
        { src: assetUrl("/images/cover-fe.webp"), alt: "Comic Videos AI product cover" },
        { src: assetUrl("/images/step-1.webp"), alt: "Step 1: describe your story" },
        { src: assetUrl("/images/step-2.webp"), alt: "Step 2: choose a style" },
        { src: assetUrl("/images/step-3.webp"), alt: "Step 3: export your video" },
      ],
      videos: [
        { src: assetUrl("/videos/baby-06.mp4"), poster: assetUrl("/images/baby-06.webp"), title: "Sample: the bath-time rebellion" },
        { src: assetUrl("/videos/baby-07.mp4"), poster: assetUrl("/images/baby-07.webp"), title: "Sample: a little mischief" },
        { src: assetUrl("/videos/baby-12.mp4"), poster: assetUrl("/images/baby-12.webp"), title: "Sample: little moments, big smiles" },
      ],
    },
  },
  {
    slug: "cuevue",
    name: "CueVue",
    tagline: "Put a talking AI rep on your website that answers visitors and captures leads",
    category: "Websites",
    affiliateUrl: "https://jvz1.com/c/3615703/453179/",
    officialUrl: "https://cuevue.live/",
    summary:
      "CueVue adds an animated AI avatar, called a LiveRep, to an existing website. Visitors can talk to it in real time; it answers from the business information you provide, captures contact details, and can book appointments. Conversations are recorded and transcribed so you can review them.",
    verdict:
      "Interesting for local businesses and agencies that want their site to answer questions and capture leads around the clock. Test it on a site that already gets traffic, and use the 14-day guarantee window to judge real conversations.",
    bestFor: "Local businesses and agencies that want more leads from existing website traffic",
    checkedOn: "14 Oct 2026",
    facts: [
      { label: "Payment", value: "One-time, no subscription" },
      { label: "Guarantee", value: "14-day money-back" },
      { label: "Usage", value: "Credit-based (1 credit ≈ 1 minute)" },
      { label: "Languages", value: "70+ with auto-detect" },
    ],
    steps: [
      { title: "Add your business info", text: "Point it at your website, documents, and FAQs so answers stay on topic." },
      { title: "Choose a face and placement", text: "Pick an avatar and where it appears on your site." },
      { title: "Capture and follow up", text: "Leads go to your chosen destination; review recordings and transcripts." },
    ],
    features: [
      { title: "Live talking avatar", text: "An animated face with voice that talks with visitors in real time." },
      { title: "Answers from your content", text: "Responses are based on the website, documents, and FAQs you provide." },
      { title: "Lead capture and booking", text: "Lead-capture presets and several lead destinations, plus appointment booking." },
      { title: "Recordings and transcripts", text: "Review every conversation with recordings, transcripts, and scoring." },
      { title: "70+ languages", text: "Automatic language detection and translated captions in the launch offer." },
      { title: "Agency workspaces", text: "Client workspaces, read-only client logins, and a white-label dashboard in the bundle." },
    ],
    goodFit: [
      "run a local service business that gets questions before people book",
      "manage websites for clients and want a new service to offer",
      "already have website traffic but few enquiries",
    ],
    notFor: [
      "Brand-new sites with almost no visitors yet",
      "Businesses that cannot review AI answers for accuracy",
    ],
    pros: [
      "One-time payment, no monthly subscription",
      "Conversations are recorded and transcribed for review",
      "Agency features included in the All Access bundle",
      "14-day money-back guarantee",
    ],
    cons: [
      "Usage runs on credits; heavy traffic will use them up faster",
      "Statistics on the sales page come from other companies, not CueVue itself",
      "Upsells and an avatar add-on are offered at checkout",
    ],
    pricing: [
      { plan: "All Access bundle", price: "From $147 one-time", note: "Launch price per vendor's partner page" },
      { plan: "Avatar add-on (optional)", price: "+$77", note: "Five custom avatars" },
    ],
    pricingNotes: [
      "The vendor shows a countdown discount on the sales page. Confirm the final price at checkout.",
      "Bundle includes 1,300 conversation credits per the sales page.",
    ],
    coupon: { code: "TALKBACK", note: "Vendor-advertised code for $10 off. Codes can expire at any time." },
    bonus: {
      title: "CueVue launch checklist",
      checklist: [
        "Write your 15 most common customer questions and answers before setup.",
        "Add your opening hours, prices, service area, and booking link to the knowledge you provide.",
        "Place the LiveRep on your highest-traffic page first, not every page.",
        "Read the first 20 transcripts and correct any wrong answers.",
        "Track enquiries for two weeks before and after to see the real difference.",
        "Decide inside the 14-day guarantee window.",
      ],
    },
    faqs: [
      ["Is CueVue a subscription?", "The sales page describes a one-time payment with no subscription. Usage is credit-based."],
      ["What is the refund policy?", "The vendor lists a 14-day money-back guarantee."],
      ["Does it work in other languages?", "The launch offer lists 70+ languages with automatic detection."],
      ["Are the results on the sales page from CueVue?", "No. The vendor notes that the conversion statistics come from other conversational-AI companies, not CueVue."],
    ],
  },
  {
    slug: "personaible",
    name: "PersonAIble",
    tagline: "Send personalized AI video pitches that show prospects their own website",
    category: "Video & Audio",
    affiliateUrl: "https://jvz9.com/c/3615703/451893/",
    officialUrl: "https://personaible.net/",
    summary:
      "PersonAIble creates personalized outreach videos for prospective clients. Each video combines an AI presenter with a screencast of the prospect's own website and a script for your service, then generates a shareable page with a call-to-action. It also includes a lead feed and help writing the outreach email.",
    verdict:
      "Useful for freelancers and agencies who already do cold outreach to local businesses and want it to stand out. Budget for the required HeyGen API key, and note the featured bundle is a yearly subscription.",
    bestFor: "Freelancers and agencies doing outreach to local businesses",
    checkedOn: "14 Oct 2026",
    facts: [
      { label: "Bundle billing", value: "Yearly subscription" },
      { label: "Guarantee", value: "60-day money-back" },
      { label: "Extra cost", value: "Your own HeyGen API key" },
      { label: "One-time options", value: "Lite and Pro" },
    ],
    steps: [
      { title: "Pick a prospect", text: "Choose a business from the lead feed or add your own." },
      { title: "Generate the video", text: "An AI presenter pitches your service over a screencast of their website." },
      { title: "Send and follow up", text: "Share the hosted video page and send the outreach email." },
    ],
    features: [
      { title: "Personalized video pitches", text: "AI presenter with lip-sync over the prospect's own website." },
      { title: "Hosted share pages", text: "Each video gets a page with your call-to-action button and branding." },
      { title: "Lead feed", text: "A feed of local businesses to contact, from the bundled Aigency Valet tool." },
      { title: "Outreach email writer", text: "Drafts the email that goes with each video." },
      { title: "Agency license", text: "Sell personalized videos as a service to your own clients." },
      { title: "Training and templates", text: "Step-by-step training plus proposal, contract, and pricing packs." },
    ],
    goodFit: [
      "already pitch services to local businesses",
      "want outreach that looks more personal than a text email",
      "run a small agency and want a repeatable prospecting system",
    ],
    notFor: [
      "People who are not ready to do outreach consistently",
      "Anyone unwilling to pay for a separate HeyGen API key",
    ],
    pros: [
      "Personalized videos stand out from plain cold emails",
      "Lead feed and email writer included",
      "One-time Lite and Pro options exist",
      "60-day money-back guarantee",
    ],
    cons: [
      "Requires your own HeyGen API key, which is an extra cost",
      "The featured bundle renews yearly",
      "Income screenshots on the sales page are not typical results",
      "Follow cold-outreach and anti-spam rules in your country",
    ],
    pricing: [
      { plan: "Lite", price: "$42 one-time", note: "25 videos, partial lead feed" },
      { plan: "Pro", price: "$47 one-time", note: "100 videos, larger share of lead feed" },
      { plan: "Bundle", price: "$297 / year", note: "100 videos per month, full extras; renews yearly" },
    ],
    pricingNotes: [
      "Our link opens the bundle page; the one-time Lite and Pro options are on the same page.",
      "The vendor says the price rises as sales increase. Confirm the final price at checkout.",
      "An Unlimited upgrade ($47/month) and other upsells are optional.",
    ],
    coupon: { code: "personal", note: "Vendor-advertised code for $10 off. Codes can expire at any time." },
    bonus: {
      title: "Personalized outreach starter kit",
      checklist: [
        "Choose one niche (for example dentists or salons) so every video can reuse one script.",
        "Write a 30-second script: one problem you saw on their site, one fix, one question.",
        "Send 10 videos a day for two weeks and log every reply.",
        "Price your offer with our free project pricing calculator.",
        "Only contact businesses where cold outreach is legal, and always include an opt-out.",
        "Decide inside the 60-day guarantee window.",
      ],
    },
    faqs: [
      ["Is PersonAIble a one-time payment?", "Lite and Pro are one-time. The featured bundle is a yearly subscription that renews every 12 months."],
      ["Are there extra costs?", "Yes. The vendor says you need your own HeyGen API key, which is billed separately."],
      ["What is the refund policy?", "The sales page lists a 60-day money-back guarantee, requested by email to the vendor."],
      ["Will I land clients with it?", "It can make outreach stand out, but results depend on your offer, niche, and consistency. The vendor states income examples are not typical."],
    ],
  },
];

export const offerBySlug = (slug: string) => offers.find((o) => o.slug === slug);
