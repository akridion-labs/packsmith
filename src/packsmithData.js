export const starterBrief = {
  niche: "AI agencies and automation freelancers",
  buyer: "Solo operators selling AI automation services to SMB clients",
  promise:
    "Launch a polished client acquisition and delivery system without building every asset from scratch.",
  inputs:
    "Client CRM, onboarding dashboard, project tracker, pitch deck, social content, landing page wireframe",
  style: "Premium operator",
  imageDirection:
    "Sharp SaaS dashboard, confident sales room, clean process diagrams, practical client-facing assets.",
};

export const connectorRoadmap = [
  {
    id: "notion",
    name: "Notion",
    status: "Ready to wire",
    depth: "Full MVP connector",
    description:
      "Create the page map, databases, properties, sample records, and export payload needed for a Notion publish flow.",
    nextStep: "Add Notion API key and parent page ID, then call createNotionWorkspace.",
  },
  {
    id: "figma",
    name: "Figma",
    status: "Spec first",
    depth: "Design-system handoff",
    description:
      "Generate tokens, components, frame names, and plugin-ready JSON before adding direct file creation.",
    nextStep: "Use Figma plugin/API workflow after the UI kit schema is stable.",
  },
  {
    id: "canva",
    name: "Canva",
    status: "Pack planner",
    depth: "Creator export",
    description:
      "Create pitch deck, social post, and preview image plans while avoiding marketplace-quality risks from raw AI assets.",
    nextStep: "Connect Canva import/export only after preview templates are approved.",
  },
];

export function buildLaunchKit(brief) {
  return {
    name: "AI Agency Launch Kit",
    buyer: brief.buyer,
    promise: brief.promise,
    valueScore: 87,
    suggestedPrice: "$29 launch / $79 premium / $149 commercial",
    buildStage: "Template-pack blueprint",
    sections: [
      {
        id: "notion",
        label: "Notion OS",
        summary: "Client operations system with CRM, onboarding, delivery, and results capture.",
        items: [
          "Command Home with lead pipeline, active projects, and weekly delivery focus",
          "Client CRM with source, status, deal value, close probability, and next action",
          "Discovery Call Hub with pain points, opportunities, objections, and automation ideas",
          "Onboarding Dashboard with access requests, kickoff checklist, and decision log",
          "Automation Project Tracker with phase, owner, margin estimate, blockers, and handoff status",
          "Results Vault for metrics, testimonials, case studies, and reusable proof",
        ],
      },
      {
        id: "canva",
        label: "Canva Pack",
        summary: "Pitch and content system for selling AI automation services with proof.",
        items: [
          "12-slide AI automation pitch deck",
          "20 LinkedIn carousel post prompts and slide structures",
          "15 proof posts for wins, before/after workflows, and testimonials",
          "10 launch story frames for offer education and discovery calls",
          "One-page service menu and automation audit worksheet",
        ],
      },
      {
        id: "figma",
        label: "Figma UI Kit",
        summary: "Landing page and client portal starter kit for a credible service brand.",
        items: [
          "Design tokens for ink, paper, success green, signal blue, warning amber, and action coral",
          "CRM pipeline card, project timeline, health badge, metric tile, and workflow step components",
          "Desktop and mobile landing page frames",
          "Client portal dashboard and automation audit report frames",
          "Component naming and handoff notes for future direct Figma publishing",
        ],
      },
    ],
    listing: {
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
    },
    launchPlan: [
      "Build the Notion database schema and seed it with realistic agency demo data",
      "Create eight preview images showing the CRM, pitch deck, landing page, and bundle contents",
      "Ship the first Gumroad page at $29 with a premium upgrade waitlist",
      "Post five LinkedIn examples showing the kit solving real agency workflow problems",
      "Offer the first ten buyers a setup review in exchange for product feedback",
    ],
  };
}

export function buildNotionExport(pack) {
  return {
    workspaceName: pack.name,
    parentPageTitle: "AI Agency Operating System",
    pages: [
      {
        title: "Command Home",
        blocks: ["This week", "Lead pipeline", "Active client work", "Revenue snapshot"],
      },
      {
        title: "Client CRM",
        database: "clients",
      },
      {
        title: "Discovery Call Hub",
        database: "discovery_calls",
      },
      {
        title: "Automation Project Tracker",
        database: "projects",
      },
      {
        title: "Results Vault",
        database: "proof_assets",
      },
    ],
    databases: {
      clients: [
        "Client",
        "Status",
        "Package",
        "Deal value",
        "Next action",
        "Health score",
        "Renewal date",
      ],
      discovery_calls: [
        "Lead",
        "Pain point",
        "Automation idea",
        "Budget",
        "Urgency",
        "Objection",
        "Follow-up date",
      ],
      projects: [
        "Project",
        "Client",
        "Phase",
        "Owner",
        "Due date",
        "Blocker",
        "Margin estimate",
      ],
      proof_assets: ["Asset", "Client", "Metric", "Before", "After", "Approval", "Reuse rights"],
    },
  };
}
