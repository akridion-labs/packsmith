export const platformOptions = ["Notion", "Canva", "Figma"];

export const pipelineStages = [
  {
    id: "idea",
    label: "Idea",
    description: "Capture the messy offer, audience, pain, and raw inspiration.",
  },
  {
    id: "blueprint",
    label: "Blueprint",
    description: "Shape the pack promise, assets, quality score, and pricing ladder.",
  },
  {
    id: "assets",
    label: "Assets",
    description: "Generate Notion, Canva, and Figma production specs.",
  },
  {
    id: "market",
    label: "Market",
    description: "Prepare listings, launch posts, previews, and channel risks.",
  },
];

export const starterBrief = {
  niche: "AI agencies and automation freelancers",
  buyer: "Solo operators selling AI automation services to SMB clients",
  painPoint:
    "They look capable in calls but lose trust when delivery docs, onboarding, dashboards, and pitch assets feel stitched together.",
  promise:
    "Launch a polished client acquisition and delivery system without building every asset from scratch.",
  assets:
    "Client CRM, onboarding dashboard, project tracker, pitch deck, social content, landing page wireframe",
  platforms: platformOptions,
  style: "Premium forge",
  marketplaceTarget: "Gumroad",
  visualDirection:
    "Dark premium workspace, sharp SaaS dashboard, confident sales room, clean process diagrams, practical client-facing assets.",
};

export const backendContract = {
  method: "POST",
  path: "/api/notion/publish",
  input: ["notionToken", "parentPageId", "workspacePayload"],
  output: ["createdPageIds", "createdDatabaseIds", "status", "errors"],
  note: "Secrets must be sent to a backend route only. Do not save Notion tokens in browser storage.",
};

export const connectorRoadmap = [
  {
    id: "notion",
    name: "Notion",
    status: "Simulate publish",
    depth: "First full connector",
    description:
      "Preview the parent page, child pages, databases, properties, and seed records before wiring the backend route.",
    nextStep: "Connect POST /api/notion/publish with a server-side Notion token.",
  },
  {
    id: "figma",
    name: "Figma",
    status: "Spec export",
    depth: "Design-system handoff",
    description:
      "Generate tokens, components, frame names, and plugin-ready JSON before direct file creation.",
    nextStep: "Add Figma plugin/API export after the UI kit schema is stable.",
  },
  {
    id: "canva",
    name: "Canva",
    status: "Pack planner",
    depth: "Creator export",
    description:
      "Create pitch deck, social post, and preview image plans while avoiding marketplace-quality risks from raw AI assets.",
    nextStep: "Connect Canva import/export after preview templates are approved.",
  },
];

const baseSections = [
  {
    id: "notion",
    label: "Notion OS",
    summary: "Client operations system with CRM, onboarding, delivery, and results capture.",
    items: [
      "Command Home with lead pipeline, active projects, weekly delivery focus, and revenue snapshot",
      "Client CRM with source, status, deal value, close probability, next action, and health score",
      "Discovery Call Hub with pain points, automation opportunities, objections, budget, and follow-up",
      "Onboarding Dashboard with access requests, kickoff checklist, decision log, and handoff notes",
      "Automation Project Tracker with phase, owner, margin estimate, blockers, due date, and status",
      "Results Vault for metrics, testimonials, before/after systems, case studies, and reusable proof",
    ],
  },
  {
    id: "canva",
    label: "Canva Pack",
    summary: "Pitch and content system for selling AI automation services with proof.",
    items: [
      "12-slide AI automation pitch deck covering pain, opportunity, offer, proof, process, and CTA",
      "20 LinkedIn carousel prompts for automation education, objections, and case-study storytelling",
      "15 proof posts for wins, before/after workflows, testimonials, and measurable outcomes",
      "10 launch story frames for offer education, client wins, discovery calls, and limited setup spots",
      "One-page service menu and automation audit worksheet for sales calls",
    ],
  },
  {
    id: "figma",
    label: "Figma UI Kit",
    summary: "Landing page and client portal starter kit for a credible service brand.",
    items: [
      "Design tokens for ink, forge gold, success green, signal blue, warning amber, and action coral",
      "CRM pipeline card, project timeline, health badge, metric tile, workflow step, and pricing block",
      "Desktop and mobile landing page frames for a premium AI automation agency offer",
      "Client portal dashboard and automation audit report frames",
      "Component naming, variant notes, and handoff checklist for future direct Figma publishing",
    ],
  },
];

export function calculateQualityScore(brief) {
  const scoreParts = {
    buyerClarity: Math.min(100, brief.buyer.length * 1.6),
    assetCompleteness: Math.min(100, brief.assets.split(",").filter(Boolean).length * 18),
    marketplaceReadiness: brief.marketplaceTarget ? 88 : 55,
    connectorReadiness: brief.platforms.length * 28,
  };

  const overall = Math.round(
    Object.values(scoreParts).reduce((sum, value) => sum + value, 0) / Object.keys(scoreParts).length,
  );

  return {
    overall,
    parts: {
      buyerClarity: Math.round(scoreParts.buyerClarity),
      assetCompleteness: Math.round(scoreParts.assetCompleteness),
      marketplaceReadiness: Math.round(scoreParts.marketplaceReadiness),
      connectorReadiness: Math.min(100, Math.round(scoreParts.connectorReadiness)),
    },
  };
}

export function buildLaunchChannels(pack) {
  const sharedTags = pack.listing.tags;
  const previewChecklist = [
    "Show the Notion Command Home dashboard",
    "Show the CRM and Automation Project Tracker",
    "Show a 3-slide pitch deck preview",
    "Show the Figma landing page frame and component strip",
    "Show exactly what the buyer gets in the bundle",
  ];

  return [
    {
      id: "gumroad",
      name: "Gumroad",
      priority: "Primary",
      readiness: "Launch first",
      audience: "AI agency freelancers who need a sellable operating system today",
      price: "$29 launch, $79 premium, $149 commercial",
      listingTitle: pack.listing.title,
      description: pack.listing.description,
      tags: sharedTags,
      previewChecklist,
      launchPost:
        "I built the AI Agency Launch Kit for automation freelancers who need their CRM, onboarding, pitch deck, content, and landing page starter system in one place. Launch pricing is $29 for the first buyers.",
      riskNotes: "Gumroad discovery is weak. Drive traffic through LinkedIn/X examples and direct founder communities.",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      priority: "Second",
      readiness: "Post this week",
      audience: "Freelancers, consultants, agency operators, and SaaS founders",
      price: "Lead to Gumroad",
      listingTitle: "How I would package an AI automation agency in one day",
      description:
        "A founder-style build-in-public post showing the operating system, CRM, pitch deck, and proof assets.",
      tags: ["AI automation", "agency operations", "Notion templates", "creator business"],
      previewChecklist: ["Dashboard screenshot", "Pitch deck spread", "Before/after workflow card"],
      launchPost:
        "Most AI automation freelancers lose trust after the sales call because the delivery system feels improvised. I mapped the full launch kit: CRM, onboarding, project tracker, pitch deck, content pack, and landing page UI starter.",
      riskNotes: "Avoid sounding like a generic AI template drop. Show concrete workflow screenshots.",
    },
    {
      id: "x",
      name: "X",
      priority: "Second",
      readiness: "Thread ready",
      audience: "Indie hackers, AI builders, template sellers, and operators",
      price: "Lead to Gumroad",
      listingTitle: "I turned an AI agency into a template pack",
      description: "A short thread with screenshots, pack contents, price, and buyer pain.",
      tags: ["buildinpublic", "AI", "Notion", "templates"],
      previewChecklist: ["Hero screenshot", "Asset map", "Pricing ladder"],
      launchPost:
        "I’m building Packsmith: rough idea -> Notion OS -> Canva pitch pack -> Figma UI kit -> Gumroad listing. First demo: AI Agency Launch Kit.",
      riskNotes: "Threads move fast. Open with the painful before/after and visual proof.",
    },
    {
      id: "notion-marketplace",
      name: "Notion Marketplace",
      priority: "Later",
      readiness: "Needs finished Notion build",
      audience: "Notion users searching for business dashboards and client systems",
      price: "$19-$49",
      listingTitle: "AI Agency Client CRM and Delivery OS",
      description: "A Notion-first version focused on CRM, onboarding, project delivery, and proof capture.",
      tags: ["CRM", "Agency", "Project management", "AI automation"],
      previewChecklist: ["Template walkthrough", "Database views", "Setup instructions"],
      launchPost: "Launch a Notion operating system for AI automation clients, projects, and results.",
      riskNotes: "Needs a real Notion template with clean duplication flow and support docs.",
    },
    {
      id: "figma-community",
      name: "Figma Community",
      priority: "Later",
      readiness: "Needs polished UI kit",
      audience: "Designers and founders building agency landing pages and portals",
      price: "Free preview, premium Gumroad upsell",
      listingTitle: "AI Agency Landing Page and Portal UI Starter",
      description: "A Figma starter kit with tokens, components, landing page frames, and portal dashboard frames.",
      tags: ["Figma", "UI kit", "Agency", "SaaS dashboard"],
      previewChecklist: ["Component cover", "Landing page frame", "Portal dashboard frame"],
      launchPost: "Free Figma starter for AI agency landing pages and client portal dashboards.",
      riskNotes: "Community expects design quality. Keep a free sample and upsell full bundle.",
    },
    {
      id: "ui8",
      name: "UI8",
      priority: "Later",
      readiness: "Premium-only",
      audience: "Design buyers looking for high-polish UI kits",
      price: "$49-$149",
      listingTitle: "AI Agency SaaS UI Kit",
      description: "Premium Figma UI kit for AI automation agencies, dashboards, and client portals.",
      tags: ["UI kit", "Figma", "SaaS", "Agency"],
      previewChecklist: ["High-fidelity mockups", "Component inventory", "License notes"],
      launchPost: "A premium UI kit for AI automation agency websites, dashboards, and client portals.",
      riskNotes: "Do not submit until visual quality is marketplace-grade.",
    },
    {
      id: "etsy",
      name: "Etsy",
      priority: "Later",
      readiness: "Canva-heavy variant",
      audience: "Template buyers searching for low-cost business assets",
      price: "$9-$27",
      listingTitle: "AI Agency Canva Pitch Deck and Social Media Templates",
      description: "Canva-first pack for service menus, pitch decks, and social content.",
      tags: ["Canva template", "pitch deck", "AI agency", "social media templates"],
      previewChecklist: ["Etsy cover", "What is included", "Canva usage instructions"],
      launchPost: "Canva pitch and content templates for AI automation agencies.",
      riskNotes: "Highly saturated and price-compressed. Use only with strong niche-specific previews.",
    },
    {
      id: "creative-market",
      name: "Creative Market",
      priority: "Later",
      readiness: "Brand pack variant",
      audience: "Creative entrepreneurs and agency owners",
      price: "$19-$49",
      listingTitle: "AI Automation Agency Brand and Pitch Kit",
      description: "A polished agency brand, pitch, and content kit for AI automation service providers.",
      tags: ["Canva", "Brand kit", "Presentation", "Agency"],
      previewChecklist: ["Brand board", "Deck slides", "Social post grid"],
      launchPost: "A brand-ready pitch and content kit for AI automation agencies.",
      riskNotes: "Needs strong preview imagery and clear licensing.",
    },
    {
      id: "reddit",
      name: "Reddit",
      priority: "Research",
      readiness: "Validation only",
      audience: "Automation, Notion, solopreneur, and agency communities",
      price: "No hard sell",
      listingTitle: "Feedback request: AI agency launch kit",
      description: "Ask for critique on the workflow and pack contents, not a sales pitch.",
      tags: ["feedback", "agency", "Notion", "automation"],
      previewChecklist: ["Workflow diagram", "Notion schema", "Question prompts"],
      launchPost:
        "I’m validating a pack for AI automation freelancers: CRM, onboarding, project tracker, pitch deck, and landing page starter. What would be missing for your workflow?",
      riskNotes: "Respect community rules. No direct selling unless allowed.",
    },
  ];
}

export function buildLaunchKit(brief) {
  const quality = calculateQualityScore(brief);
  const listing = {
    title: "AI Agency Launch Kit: Notion CRM, Canva Pitch Pack, and Figma UI Starter",
    description:
      "A practical launch system for automation freelancers and small SaaS founders who want to sell AI services with a polished operating system, pitch assets, and design-ready product surfaces.",
    tags: [
      "ai agency",
      "automation business",
      "notion crm",
      "canva pitch deck",
      "figma ui kit",
      "client onboarding",
      "digital template",
    ],
  };

  const pack = {
    id: "ai-agency-launch-kit",
    name: "AI Agency Launch Kit",
    audience: "AI agency freelancers",
    buyer: brief.buyer,
    painPoint: brief.painPoint,
    promise: brief.promise,
    assets: brief.assets,
    platforms: brief.platforms,
    style: brief.style,
    marketplaceTarget: brief.marketplaceTarget,
    visualDirection: brief.visualDirection,
    quality,
    suggestedPrice: "$29 launch / $79 premium / $149 commercial",
    buildStage: "Investor-demo pack factory",
    sections: baseSections.filter((section) =>
      brief.platforms.map((platform) => platform.toLowerCase()).includes(section.id),
    ),
    listing,
    launchPlan: [
      "Finish the Notion database schema and seed it with realistic AI agency demo records",
      "Create eight preview images showing the CRM, pitch deck, landing page, and bundle contents",
      "Ship the first Gumroad page at $29 with a premium upgrade waitlist",
      "Post five LinkedIn/X examples showing the kit solving real agency workflow problems",
      "Offer the first ten buyers a setup review in exchange for feedback and screenshots",
    ],
  };

  return {
    ...pack,
    launchChannels: buildLaunchChannels(pack),
  };
}

export function buildNotionExport(pack) {
  return {
    schemaVersion: "2026-06-packsmith-notion-v1",
    workspaceName: pack.name,
    parentPage: {
      title: "AI Agency Operating System",
      icon: "forge",
      sections: ["Command Home", "Client CRM", "Discovery Call Hub", "Project Tracker", "Results Vault"],
    },
    pages: [
      {
        id: "command_home",
        title: "Command Home",
        purpose: "Weekly operating dashboard for leads, revenue, active projects, and delivery focus.",
        blocks: ["This week", "Lead pipeline", "Active client work", "Revenue snapshot", "Quick links"],
      },
      {
        id: "client_crm",
        title: "Client CRM",
        database: "clients",
      },
      {
        id: "discovery_call_hub",
        title: "Discovery Call Hub",
        database: "discovery_calls",
      },
      {
        id: "automation_project_tracker",
        title: "Automation Project Tracker",
        database: "projects",
      },
      {
        id: "results_vault",
        title: "Results Vault",
        database: "proof_assets",
      },
    ],
    databases: [
      {
        id: "clients",
        name: "Clients",
        properties: [
          { name: "Client", type: "title" },
          { name: "Status", type: "select", options: ["Lead", "Discovery", "Proposal", "Active", "Delivered"] },
          { name: "Package", type: "select", options: ["Audit", "Build", "Retainer"] },
          { name: "Deal value", type: "number" },
          { name: "Next action", type: "text" },
          { name: "Health score", type: "select", options: ["Strong", "Watch", "At risk"] },
          { name: "Renewal date", type: "date" },
        ],
        sampleRecords: [
          {
            Client: "Atlas Dental Group",
            Status: "Active",
            Package: "Build",
            "Deal value": 4500,
            "Next action": "Confirm CRM automation scope",
            "Health score": "Strong",
          },
          {
            Client: "Northstar Legal",
            Status: "Proposal",
            Package: "Audit",
            "Deal value": 1200,
            "Next action": "Send automation audit deck",
            "Health score": "Watch",
          },
        ],
      },
      {
        id: "discovery_calls",
        name: "Discovery Calls",
        properties: [
          { name: "Lead", type: "title" },
          { name: "Pain point", type: "text" },
          { name: "Automation idea", type: "text" },
          { name: "Budget", type: "select", options: ["<$1k", "$1k-$5k", "$5k+"] },
          { name: "Urgency", type: "select", options: ["Low", "Medium", "High"] },
          { name: "Objection", type: "text" },
          { name: "Follow-up date", type: "date" },
        ],
        sampleRecords: [
          {
            Lead: "Local clinic owner",
            "Pain point": "Manual intake and follow-ups",
            "Automation idea": "AI-assisted appointment prep and reminders",
            Budget: "$1k-$5k",
            Urgency: "High",
          },
        ],
      },
      {
        id: "projects",
        name: "Automation Projects",
        properties: [
          { name: "Project", type: "title" },
          { name: "Client", type: "relation" },
          { name: "Phase", type: "select", options: ["Scope", "Build", "QA", "Training", "Handoff"] },
          { name: "Owner", type: "person" },
          { name: "Due date", type: "date" },
          { name: "Blocker", type: "text" },
          { name: "Margin estimate", type: "number" },
        ],
        sampleRecords: [
          {
            Project: "Lead intake automation",
            Phase: "Build",
            "Due date": "2026-07-10",
            Blocker: "Client API access",
            "Margin estimate": 72,
          },
        ],
      },
      {
        id: "proof_assets",
        name: "Results Vault",
        properties: [
          { name: "Asset", type: "title" },
          { name: "Client", type: "relation" },
          { name: "Metric", type: "text" },
          { name: "Before", type: "text" },
          { name: "After", type: "text" },
          { name: "Approval", type: "select", options: ["Draft", "Requested", "Approved"] },
          { name: "Reuse rights", type: "checkbox" },
        ],
        sampleRecords: [
          {
            Asset: "Reduced intake response time",
            Metric: "Response time down 62%",
            Before: "Manual call-back list",
            After: "Automated follow-up routing",
            Approval: "Requested",
            "Reuse rights": false,
          },
        ],
      },
    ],
  };
}

export function buildLaunchCalendar(pack) {
  return [
    {
      day: "Day 1",
      focus: "Positioning",
      action: "Publish the Gumroad page draft and create the first LinkedIn proof post.",
      owner: "Founder",
    },
    {
      day: "Day 2",
      focus: "Preview assets",
      action: "Create dashboard, pitch deck, and Figma frame screenshots.",
      owner: "Design",
    },
    {
      day: "Day 3",
      focus: "Audience test",
      action: "DM 15 AI automation freelancers with a feedback ask, not a purchase ask.",
      owner: "Growth",
    },
    {
      day: "Day 4",
      focus: "Launch",
      action: `Post Gumroad launch at ${pack.suggestedPrice.split("/")[0].trim()} and add buyer setup review bonus.`,
      owner: "Founder",
    },
    {
      day: "Day 5",
      focus: "Learning",
      action: "Review clicks, saves, replies, and objections. Turn the top objection into the next product block.",
      owner: "Founder",
    },
  ];
}
