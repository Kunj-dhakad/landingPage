export type ContentItem = {
  slug: string;
  kind: string;
  title: string;
  description: string;
  category: string;
  body: string;
  assetPath?: string | null;
  coverUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  emailCapture?: boolean;
};
export const freelancerPrompts = [
  [
    "Scope a client project",
    "Act as a project strategist. Given [client goal], [budget], and [deadline], propose deliverables, milestones, assumptions, exclusions, and five questions to resolve before quoting. Do not invent missing facts.",
  ],
  [
    "Write a tailored proposal",
    "Draft a proposal for [client] addressing [problem]. Include a concise diagnosis, approach, deliverables, timeline, fee options, acceptance criteria, and next step. Mark unknowns as questions.",
  ],
  [
    "Improve a portfolio case study",
    "Turn these project notes [notes] into a case study: challenge, my role, approach, outcome, and lessons. Use only supplied evidence for metrics.",
  ],
  [
    "Follow up thoughtfully",
    "Write a concise follow-up to [prospect] about [proposal]. Mention one relevant benefit, ask one clear question, and offer an easy way to decline. Keep the tone warm and pressure-free.",
  ],
  [
    "Plan a discovery call",
    "Prepare a 30-minute discovery-call agenda for [service] and [client type]. Prioritize goals, constraints, decision makers, current process, and success measures.",
  ],
  [
    "Repurpose useful content",
    "Turn [article or notes] into three LinkedIn posts, a short email, and a carousel outline. Retain the source facts and flag any claims needing verification.",
  ],
  [
    "Review a client brief",
    "Review [brief] for ambiguous deliverables, hidden dependencies, revision scope, intellectual-property questions, and payment risks. Return a prioritized clarification checklist.",
  ],
  [
    "Build a weekly plan",
    "Given [projects], [deadlines], and [available hours], propose a realistic weekly schedule with focus blocks, admin time, and contingency. Identify anything that cannot fit.",
  ],
  [
    "Handle feedback clearly",
    "Draft a response to [client feedback]. Separate agreed revisions from new scope, ask about ambiguous requests, and explain the timeline impact without blaming the client.",
  ],
  [
    "Create an SOP",
    "Convert [process notes] into a standard operating procedure with trigger, inputs, numbered steps, quality checks, owner, and completion criteria. Highlight missing instructions.",
  ],
];
const toolkitBody = `# AI Business Growth Toolkit

Smarter Tools. Better Work. Bigger Growth.

This practical kit helps you make progress with a small, repeatable system. Replace bracketed placeholders, check AI outputs, and keep confidential client data out of third-party prompts unless you have permission.

## 10 prompts for freelancers

${freelancerPrompts.map(([title, prompt], i) => `### ${i + 1}. ${title}\n${prompt}`).join("\n\n")}

## Client proposal template

Hello [Name],

Your goal is [outcome]. Based on our conversation, the main challenge is [problem]. I propose [approach] delivered in [timeline].

- Deliverables: [specific items and acceptance criteria]
- Milestones: discovery [date], first draft [date], final handoff [date]
- Investment: [amount and currency], with [payment schedule]
- Included revisions: [number and scope]
- Exclusions: [items outside the project]
- Client inputs needed: [assets, approvals, access]
- Next step: confirm scope and schedule a kickoff.

Use a separate contract reviewed for your jurisdiction. A proposal is not legal advice.

## Client follow-up emails

### After sending a proposal
Subject: Next steps for [project]

Hi [Name], have you had a chance to review the proposal? The first milestone focuses on [specific benefit]. Is [date] a useful time to discuss your questions? If priorities have changed, please let me know.

### After completing a project
Subject: Your [project] handoff and next steps

Hi [Name], your final files are available at [secure link]. The handoff notes cover [items]. Please review by [date] and let me know if anything needs clarification. Thank you for working together.

## A 7-day content plan

- Monday: introduce one customer problem and a practical fix.
- Tuesday: share a behind-the-scenes process with three steps.
- Wednesday: answer a frequently asked question.
- Thursday: explain a lesson from a project, with permission.
- Friday: publish a reusable checklist.
- Saturday: share a small experiment and what you learned.
- Sunday: recap the week and invite one useful question.

For each post, define the audience, one takeaway, one call to action, and a measure such as saves or meaningful replies. Review results weekly rather than chasing every metric.

## Three starter automation workflows

### Lead intake
Form submitted → validate fields → add contact to your CRM → send a requested acknowledgement → create a follow-up task. Keep promotional consent separate.

### Content repurposing
Approved article → create draft summaries → human fact-check and edit → schedule posts → review engagement weekly. Never auto-publish unchecked AI outputs.

### Client onboarding
Contract accepted → create project folder → send intake questionnaire → create milestone tasks → confirm access and ownership. Use least-privilege sharing.

## Small business productivity

Choose three weekly priorities. Batch routine email twice a day. Keep a reusable scope checklist. Reserve two uninterrupted focus blocks. Maintain one source of truth for deadlines. Review actual hours before pricing your next project.

## Recommended software to investigate

ChatGPT (chatgpt.com) for assisted drafting; Notion (notion.so) for project notes; Canva (canva.com) for visuals; Zapier (zapier.com) for app automation. Availability, features, and pricing vary. Verify current plans directly. No paid product is needed to use NavoNixx's browser tools.

## Bonus freelancer checklist

- Define a measurable client outcome.
- Confirm scope, exclusions, and acceptance criteria.
- Agree payment and revision terms.
- Gather necessary assets and permissions.
- Record a realistic timeline and dependencies.
- Track actual time and project expenses.
- Check deliverables before handoff.
- Request feedback and document one improvement.

## Your next step

Pick one prompt, improve one recurring process, and review the result after a week. Sustainable growth starts with work you can repeat.
`;
export const content: ContentItem[] = [
  {
    slug: "ai-business-growth-toolkit",
    kind: "toolkit",
    title: "AI Business Growth Toolkit",
    description:
      "10 freelancer prompts, client templates, a content plan, automation recipes, and your next-step checklist.",
    category: "Business",
    body: toolkitBody,
    assetPath: "/downloads/navonixx-ai-business-toolkit.pdf",
    emailCapture: true,
  },
  ...freelancerPrompts.map(([title, prompt], i) => ({
    slug: [
      "project-scoping",
      "client-proposal-prompt",
      "portfolio-case-study",
      "client-follow-up",
      "discovery-call",
      "content-repurposing-prompt",
      "brief-review",
      "weekly-planning",
      "client-feedback",
      "standard-operating-procedure",
    ][i],
    kind: "prompts",
    title,
    description: prompt.slice(0, 135) + "…",
    category: i < 5 ? "Freelancing" : "Productivity",
    body: `# ${title}\n\n${prompt}\n\n## How to use\nReplace every bracketed placeholder with your context. Share only information you have permission to use. Review the draft for accuracy before sending or publishing.\n\n## Improve your result\nAsk the assistant to explain its assumptions, list what is missing, and provide a shorter version. Treat the answer as a draft.`,
  })),
  {
    slug: "client-proposal",
    kind: "templates",
    title: "A proposal that makes the next step clear",
    description:
      "A reusable scope, timeline, and pricing template for your next client.",
    category: "Freelancing",
    body: "# Client proposal\n\n## The goal\n[Client] wants to achieve [specific outcome] by [date].\n\n## Our approach\n[Describe your process in three stages.]\n\n## Deliverables\n[List each deliverable, format, and acceptance criteria.]\n\n## Timeline\nKickoff: [date]\nFirst review: [date]\nHandoff: [date]\n\n## Investment\n[Currency and fee]. Payment: [schedule]. Included revisions: [scope].\n\n## Assumptions and exclusions\n[Dependencies, client inputs, and work outside this agreement.]\n\n## Next step\nApprove the scope and arrange a kickoff. Have a separate agreement reviewed for your situation.",
  },
  {
    slug: "weekly-content-calendar",
    kind: "templates",
    title: "Your weekly content calendar",
    description:
      "Seven days of useful content, with room for your audience and goals.",
    category: "Content creation",
    body: "# Weekly content calendar\n\n| Day | Idea | Action | Measure |\n| --- | --- | --- | --- |\n| Monday | Solve one audience problem | Share a checklist | Saves |\n| Tuesday | Show your process | Explain three steps | Replies |\n| Wednesday | Answer a common question | Invite questions | Comments |\n| Thursday | Share a project lesson | Show verified evidence | Profile visits |\n| Friday | Give a reusable resource | Link your resource | Downloads |\n| Saturday | Describe an experiment | Ask for feedback | Meaningful replies |\n| Sunday | Reflect on the week | Invite one next step | Conversations |\n\n## Before publishing\nCheck accuracy, permissions, accessibility, and links. Add captions to video and descriptive alt text to images.",
  },
  {
    slug: "lead-intake",
    kind: "workflows",
    title: "Turn a new enquiry into a clear next step",
    description:
      "A practical, consent-aware lead intake workflow you can set up in your own stack.",
    category: "Automation",
    body: "# Lead intake without the busywork\n\n## What you need\nA form, a CRM or spreadsheet with appropriate access controls, a transactional email service, and a task manager.\n\n## Steps\n1. Ask for the name, email, project goal, and budget range. Keep marketing permission optional.\n2. Validate inputs on the server and add spam protection.\n3. Create or update the contact using normalized email to prevent duplicates.\n4. Send an acknowledgement about the requested enquiry.\n5. Create a follow-up task with a named owner and due date.\n6. Review the enquiry before sending a proposal.\n\n## Test before launch\nSubmit a valid lead, repeat it, omit required fields, decline marketing, and simulate email failure. Confirm the system handles each honestly.\n\n## Keep it safe\nAvoid sending private form content to AI services without consent. Delete stale records according to your published retention policy.",
  },
  {
    slug: "content-repurposing",
    kind: "workflows",
    title: "One good idea. A week of useful content.",
    description:
      "Turn an approved article into a repeatable content workflow with human review.",
    category: "Content creation",
    body: "# A content repurposing workflow\n\n1. Select an article you own and identify its main takeaway.\n2. Use the content repurposing prompt to draft three posts and an email.\n3. Check every statistic against the source. Remove claims that cannot be supported.\n4. Edit each piece for its platform and add descriptive visuals.\n5. Schedule the approved content in your preferred scheduler.\n6. Review saves, replies, and resource downloads after a week.\n\n## Human checkpoints\nA named editor should approve facts, tone, copyright permissions, and publication dates. Do not connect unreviewed AI output directly to publishing.",
  },
  {
    slug: "price-your-first-project",
    kind: "blog",
    title: "How to price a freelance project with confidence",
    description:
      "Start with your costs, estimate the work, and make room for uncertainty.",
    category: "Freelancing",
    body: "# How to price a freelance project with confidence\n\nA good quote starts with a clear scope. Before estimating hours, list the deliverables, review rounds, client dependencies, and definition of done.\n\n## Find your baseline\nAdd your annual income goal and business costs. Divide by realistic working weeks and billable hours. Use the freelance hourly rate calculator to test your assumptions. Not every working hour is billable: leave room for marketing, admin, and rest.\n\n## Estimate the project\nBreak the work into discovery, production, reviews, and handoff. Multiply hours by your baseline rate, add direct expenses, and add a contingency suited to the uncertainty. The project pricing calculator makes this arithmetic transparent.\n\n## Present a useful proposal\nExplain what is included, when each milestone happens, and what the client must supply. Define how extra work will be quoted. A clear agreement protects both sides.\n\n## Learn from the result\nTrack actual time and expenses. Compare them with your estimate after delivery and improve the next quote. These calculators support planning; consult a qualified adviser for tax and legal decisions.",
  },
  {
    slug: "better-ai-prompts",
    kind: "blog",
    title: "Better prompts start with a better brief",
    description:
      "Give AI the context, constraints, and success criteria it needs.",
    category: "AI & productivity",
    body: "# Better prompts start with a better brief\n\nA vague request tends to produce a vague draft. Start with the audience, the task, relevant context, and what a useful answer should look like.\n\n## A reusable structure\nRole: what perspective should the assistant take?\nTask: what should it produce?\nContext: what facts are available?\nConstraints: what must it avoid or preserve?\nFormat: how should the result be structured?\nQuality check: what assumptions should it flag?\n\n## A practical example\nInstead of asking for a proposal, explain the client problem, deliverables, deadline, budget range, and desired tone. Ask for missing information to be listed rather than invented.\n\n## Review before use\nVerify claims, edit for your voice, and protect confidential data. AI can help organize and draft work, but you remain responsible for the final result.",
  },
];
export const sectionInfo: Record<
  string,
  { title: string; description: string; eyebrow: string }
> = {
  faq: {
    title: "Useful questions. Clear answers.",
    description:
      "Answers to common questions about NavoNixx and our resources.",
    eyebrow: "HELPFUL ANSWERS",
  },
  prompts: {
    title: "A better starting point for AI.",
    description:
      "Useful prompts with clear context, thoughtful constraints, and room for your own ideas.",
    eyebrow: "THE PROMPT LIBRARY",
  },
  templates: {
    title: "Skip the blank page.",
    description:
      "Practical templates for proposals, content, and the work that happens every week.",
    eyebrow: "READY TO MAKE YOUR OWN",
  },
  workflows: {
    title: "Less busywork. More momentum.",
    description:
      "Step-by-step systems that make everyday work simpler, with human checks built in.",
    eyebrow: "WORK SMARTER, REPEATABLY",
  },
  resources: {
    title: "Good ideas. Useful resources.",
    description:
      "Explore our prompts, templates, workflows, and practical guides in one place.",
    eyebrow: "YOUR LEARNING LIBRARY",
  },
  blog: {
    title: "Build a smarter way to work.",
    description:
      "Practical guides for independent people building ambitious things.",
    eyebrow: "THE NAVONIXX JOURNAL",
  },
};
