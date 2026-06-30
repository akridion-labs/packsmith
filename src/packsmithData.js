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

const channelTemplates = [
  {
    id: "gumroad",
    name: "Gumroad",
    priority: "Primary",
    defaultReadiness: "Launch first",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    priority: "Second",
    defaultReadiness: "Post this week",
  },
  {
    id: "x",
    name: "X",
    priority: "Second",
    defaultReadiness: "Thread ready",
  },
  {
    id: "notion-marketplace",
    name: "Notion Marketplace",
    priority: "Later",
    defaultReadiness: "Needs finished Notion build",
  },
  {
    id: "figma-community",
    name: "Figma Community",
    priority: "Later",
    defaultReadiness: "Needs polished UI kit",
  },
  {
    id: "ui8",
    name: "UI8",
    priority: "Later",
    defaultReadiness: "Premium-only",
  },
  {
    id: "etsy",
    name: "Etsy",
    priority: "Later",
    defaultReadiness: "Canva-heavy variant",
  },
  {
    id: "creative-market",
    name: "Creative Market",
    priority: "Later",
    defaultReadiness: "Brand pack variant",
  },
  {
    id: "reddit",
    name: "Reddit",
    priority: "Research",
    defaultReadiness: "Validation only",
  },
];

export const nichePresets = {
  aiAgency: {
    id: "aiAgency",
    shortName: "AI Agency",
    name: "AI Agency Launch Kit",
    audience: "AI agency freelancers",
    heroLine: "Forge AI service ideas into a sellable agency operating system.",
    comparison: {
      expectedPrice: "$29-$149",
      bestMarketplace: "Gumroad",
      fastestChannel: "LinkedIn/X",
      connectorReadiness: "High",
    },
    brief: {
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
    },
    suggestedPrice: "$29 launch / $79 premium / $149 commercial",
    buildStage: "Investor-demo pack factory",
    sections: [
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
      "Finish the Notion database schema and seed it with realistic AI agency demo records",
      "Create eight preview images showing the CRM, pitch deck, landing page, and bundle contents",
      "Ship the first Gumroad page at $29 with a premium upgrade waitlist",
      "Post five LinkedIn/X examples showing the kit solving real agency workflow problems",
      "Offer the first ten buyers a setup review in exchange for feedback and screenshots",
    ],
    channelOverrides: {
      gumroad: {
        audience: "AI agency freelancers who need a sellable operating system today",
        price: "$29 launch, $79 premium, $149 commercial",
        listingTitle: "AI Agency Launch Kit: CRM, Pitch, Content, and UI Starter",
        launchPost:
          "I built the AI Agency Launch Kit for automation freelancers who need their CRM, onboarding, pitch deck, content, and landing page starter system in one place. Launch pricing is $29 for the first buyers.",
        riskNotes:
          "Gumroad discovery is weak. Drive traffic through LinkedIn/X examples and direct founder communities.",
      },
      linkedin: {
        listingTitle: "How I would package an AI automation agency in one day",
        launchPost:
          "Most AI automation freelancers lose trust after the sales call because the delivery system feels improvised. I mapped the full launch kit: CRM, onboarding, project tracker, pitch deck, content pack, and landing page UI starter.",
        riskNotes: "Avoid sounding like a generic AI template drop. Show concrete workflow screenshots.",
      },
      x: {
        listingTitle: "I turned an AI agency into a template pack",
        launchPost:
          "I’m building Packsmith: rough idea -> Notion OS -> Canva pitch pack -> Figma UI kit -> Gumroad listing. First demo: AI Agency Launch Kit.",
        riskNotes: "Threads move fast. Open with the painful before/after and visual proof.",
      },
      reddit: {
        listingTitle: "Feedback request: AI agency launch kit",
        launchPost:
          "I’m validating a pack for AI automation freelancers: CRM, onboarding, project tracker, pitch deck, and landing page starter. What would be missing for your workflow?",
        riskNotes: "Respect community rules. No direct selling unless allowed.",
      },
    },
    notion: {
      schemaVersion: "2026-06-packsmith-ai-agency-v1",
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
        { id: "client_crm", title: "Client CRM", database: "clients" },
        { id: "discovery_call_hub", title: "Discovery Call Hub", database: "discovery_calls" },
        { id: "automation_project_tracker", title: "Automation Project Tracker", database: "projects" },
        { id: "results_vault", title: "Results Vault", database: "proof_assets" },
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
    },
  },
  saasLaunch: {
    id: "saasLaunch",
    shortName: "SaaS Launch",
    name: "SaaS Launch Kit",
    audience: "solo SaaS founders",
    heroLine: "Turn a raw SaaS idea into a launch dashboard, feedback engine, and investor-ready story.",
    comparison: {
      expectedPrice: "$39-$199",
      bestMarketplace: "Gumroad",
      fastestChannel: "LinkedIn/Product Hunt prep",
      connectorReadiness: "High",
    },
    brief: {
      niche: "Solo SaaS founders and indie hackers",
      buyer: "Technical founders preparing a product launch without a dedicated ops, design, or growth team",
      painPoint:
        "They can build the product but launch with scattered roadmap notes, unclear feedback loops, weak launch assets, and no investor/update system.",
      promise:
        "Create a launch-ready SaaS operating kit for roadmap, customers, feedback, metrics, landing page structure, and founder updates.",
      assets:
        "Launch dashboard, customer feedback system, roadmap, landing page wireframes, pitch assets, investor updates",
      platforms: platformOptions,
      style: "Premium forge",
      marketplaceTarget: "Gumroad",
      visualDirection:
        "Dark launch room, crisp SaaS metrics, product roadmap cards, customer feedback signals, landing page mockups.",
    },
    suggestedPrice: "$39 launch / $99 founder pack / $199 commercial",
    buildStage: "SaaS launch command kit",
    sections: [
      {
        id: "notion",
        label: "SaaS Launch OS",
        summary: "Founder dashboard for customers, feedback, roadmap, metrics, and launch execution.",
        items: [
          "Launch Command Home with launch countdown, roadmap focus, user feedback, and growth metrics",
          "Customer Pipeline with segment, lifecycle stage, activation status, and next customer action",
          "Feedback Inbox with theme, severity, source, user segment, and decision outcome",
          "Roadmap Board with now/next/later, confidence, business impact, owner, and release notes",
          "Launch Task System with channel, asset owner, status, due date, and dependency",
          "Metrics Room tracking activation, retention, conversion, MRR, churn signals, and founder notes",
        ],
      },
      {
        id: "canva",
        label: "SaaS Launch Pack",
        summary: "Launch content and pitch assets for shipping a small SaaS with credibility.",
        items: [
          "10-slide product launch deck for problem, product, traction, roadmap, and ask",
          "18 launch social posts for founder story, product demo, problem education, and feature proof",
          "Product Hunt-style gallery plan with hero graphic, feature panels, and proof screenshots",
          "Customer update email templates for beta invites, release notes, and onboarding nudges",
          "Investor/friend update template for momentum, metrics, learnings, and asks",
        ],
      },
      {
        id: "figma",
        label: "SaaS UI Starter",
        summary: "Landing page and product surface kit for early SaaS validation.",
        items: [
          "Design tokens for launch black, signal blue, traction green, warning amber, and demo coral",
          "Landing hero, feature grid, pricing block, testimonial strip, waitlist form, and changelog modules",
          "Dashboard frames for metrics overview, feedback inbox, roadmap board, and onboarding checklist",
          "Responsive launch landing page frames for desktop and mobile",
          "Component naming and screenshot capture notes for Gumroad/Product Hunt previews",
        ],
      },
    ],
    listing: {
      title: "SaaS Launch Kit: Notion Dashboard, Canva Launch Assets, and Figma UI Starter",
      description:
        "A launch operating kit for solo SaaS founders who need roadmap clarity, customer feedback systems, launch content, landing page structure, and founder update assets before shipping.",
      tags: [
        "saas launch",
        "indie hacker",
        "notion dashboard",
        "product launch",
        "figma landing page",
        "customer feedback",
        "startup template",
      ],
    },
    launchPlan: [
      "Build the SaaS Launch OS with customers, feedback, roadmap, launch tasks, and metrics",
      "Create preview assets showing the launch dashboard, feedback inbox, roadmap, and landing page",
      "Ship Gumroad at $39 and collect waitlist signups for the premium founder pack",
      "Post a LinkedIn/X build-in-public thread about turning a SaaS launch into a repeatable system",
      "Validate with 15 indie hackers before adding Product Hunt-ready templates",
    ],
    channelOverrides: {
      gumroad: {
        audience: "Solo SaaS founders preparing to launch without a full growth team",
        price: "$39 launch, $99 founder pack, $199 commercial",
        listingTitle: "SaaS Launch Kit: Dashboard, Feedback, Roadmap, and Launch Assets",
        launchPost:
          "I built a SaaS Launch Kit for solo founders who need a launch dashboard, customer feedback system, roadmap, metrics room, landing page starter, and founder update assets before shipping.",
        riskNotes: "Founders dislike vague templates. Show real dashboards, sample records, and launch tasks.",
      },
      linkedin: {
        listingTitle: "The launch system I wish every solo SaaS founder had",
        launchPost:
          "Most solo SaaS launches fail quietly because the product exists but the launch system does not. This kit maps customers, feedback, roadmap, metrics, launch tasks, landing page, and founder updates in one workflow.",
        riskNotes: "Speak like a founder operator, not a productivity influencer.",
      },
      x: {
        listingTitle: "I turned a SaaS launch into a template pack",
        launchPost:
          "New Packsmith preset: SaaS Launch Kit. Rough idea -> launch dashboard -> customer feedback OS -> roadmap -> landing page UI starter -> Gumroad listing.",
        riskNotes: "Open with screenshots and a crisp founder pain point.",
      },
      reddit: {
        listingTitle: "Feedback request: SaaS launch operating kit",
        launchPost:
          "I’m validating a SaaS launch kit for solo founders: launch dashboard, feedback inbox, roadmap, metrics room, launch tasks, and landing page starter. What would be missing before you’d use it?",
        riskNotes: "Use feedback-first communities. Avoid promotional framing.",
      },
    },
    notion: {
      schemaVersion: "2026-06-packsmith-saas-launch-v1",
      parentPage: {
        title: "SaaS Launch Operating System",
        icon: "rocket",
        sections: ["Launch Home", "Customers", "Feedback", "Roadmap", "Launch Tasks", "Metrics"],
      },
      pages: [
        {
          id: "launch_home",
          title: "Launch Home",
          purpose: "Founder launch command center for weekly priorities, traction signals, and asset readiness.",
          blocks: ["Launch countdown", "Top risks", "Next experiments", "Metric snapshot", "Asset checklist"],
        },
        { id: "customers", title: "Customers", database: "customers" },
        { id: "feedback", title: "Feedback Inbox", database: "feedback" },
        { id: "roadmap", title: "Roadmap", database: "roadmap" },
        { id: "launch_tasks", title: "Launch Tasks", database: "launch_tasks" },
        { id: "metrics", title: "Metrics", database: "metrics" },
      ],
      databases: [
        {
          id: "customers",
          name: "Customers",
          properties: [
            { name: "Customer", type: "title" },
            { name: "Segment", type: "select", options: ["Founder", "Team", "Agency", "Enterprise"] },
            { name: "Lifecycle", type: "select", options: ["Waitlist", "Trial", "Active", "Churn risk"] },
            { name: "Activation", type: "select", options: ["Not started", "Activated", "Power user"] },
            { name: "Next action", type: "text" },
            { name: "MRR", type: "number" },
          ],
          sampleRecords: [
            {
              Customer: "Northstar CRM",
              Segment: "Founder",
              Lifecycle: "Trial",
              Activation: "Activated",
              "Next action": "Ask for onboarding friction notes",
              MRR: 29,
            },
          ],
        },
        {
          id: "feedback",
          name: "Feedback",
          properties: [
            { name: "Feedback", type: "title" },
            { name: "Theme", type: "select", options: ["Onboarding", "Pricing", "Core workflow", "Bug"] },
            { name: "Source", type: "select", options: ["Call", "Email", "In-app", "Social"] },
            { name: "Severity", type: "select", options: ["Low", "Medium", "High"] },
            { name: "Decision", type: "select", options: ["Review", "Build", "Defer", "Reject"] },
          ],
          sampleRecords: [
            {
              Feedback: "Need import from CSV",
              Theme: "Core workflow",
              Source: "Call",
              Severity: "High",
              Decision: "Review",
            },
          ],
        },
        {
          id: "roadmap",
          name: "Roadmap",
          properties: [
            { name: "Feature", type: "title" },
            { name: "Stage", type: "select", options: ["Now", "Next", "Later"] },
            { name: "Confidence", type: "select", options: ["Low", "Medium", "High"] },
            { name: "Impact", type: "select", options: ["Retention", "Revenue", "Activation", "Acquisition"] },
            { name: "Release note", type: "text" },
          ],
          sampleRecords: [
            {
              Feature: "Self-serve onboarding checklist",
              Stage: "Now",
              Confidence: "High",
              Impact: "Activation",
            },
          ],
        },
        {
          id: "launch_tasks",
          name: "Launch Tasks",
          properties: [
            { name: "Task", type: "title" },
            { name: "Channel", type: "select", options: ["Gumroad", "Product Hunt", "LinkedIn", "X", "Email"] },
            { name: "Status", type: "select", options: ["Backlog", "Drafting", "Ready", "Shipped"] },
            { name: "Owner", type: "person" },
            { name: "Due date", type: "date" },
          ],
          sampleRecords: [
            {
              Task: "Create Product Hunt gallery screenshots",
              Channel: "Product Hunt",
              Status: "Drafting",
            },
          ],
        },
        {
          id: "metrics",
          name: "Metrics",
          properties: [
            { name: "Metric", type: "title" },
            { name: "Current", type: "number" },
            { name: "Target", type: "number" },
            { name: "Frequency", type: "select", options: ["Daily", "Weekly", "Monthly"] },
            { name: "Insight", type: "text" },
          ],
          sampleRecords: [
            {
              Metric: "Trial activation",
              Current: 38,
              Target: 55,
              Frequency: "Weekly",
              Insight: "Improve first-run checklist",
            },
          ],
        },
      ],
    },
  },
  healthcareGrowth: {
    id: "healthcareGrowth",
    shortName: "Healthcare Growth",
    name: "Healthcare Practice Growth Kit",
    audience: "clinics and healthcare consultants",
    heroLine: "Package compliant practice-growth workflows without clinical advice or risky claims.",
    comparison: {
      expectedPrice: "$49-$199",
      bestMarketplace: "Gumroad/direct outreach",
      fastestChannel: "LinkedIn/direct outreach",
      connectorReadiness: "Medium",
    },
    brief: {
      niche: "Clinics and healthcare growth consultants",
      buyer:
        "Practice owners, clinic operators, and consultants improving patient lead tracking, referrals, reputation, and service communication",
      painPoint:
        "They need organized growth workflows and patient communication assets, but cannot risk sloppy claims, medical advice, or scattered follow-up processes.",
      promise:
        "Create an operations-first growth kit for patient leads, referral outreach, appointment workflow, review/reputation tracking, and service-menu content.",
      assets:
        "Patient lead tracker, referral outreach, appointment workflow, review system, service-menu content, campaign assets",
      platforms: platformOptions,
      style: "Premium forge",
      marketplaceTarget: "Gumroad",
      visualDirection:
        "Calm premium clinic operations dashboard, warm trust signals, clean referral workflow, service information cards, accessible layouts.",
    },
    suggestedPrice: "$49 launch / $99 practice pack / $199 consultant license",
    buildStage: "Compliant growth workflow kit",
    safetyNote: "Workflow template, not medical/legal advice. Avoid diagnostic, treatment, or guaranteed-result claims.",
    sections: [
      {
        id: "notion",
        label: "Practice Growth OS",
        summary: "Operations workflow for leads, referrals, appointments, reviews, and campaign assets.",
        items: [
          "Practice Growth Home with active leads, referral follow-ups, reviews, and weekly campaign priorities",
          "Patient Lead Tracker for inquiry source, service interest, consent status, next follow-up, and appointment outcome",
          "Referral Outreach System for provider contacts, outreach cadence, relationship status, and notes",
          "Appointment Workflow Board for intake tasks, prep checklist, reminders, and post-visit follow-up tasks",
          "Review and Reputation Tracker for request status, response queue, platform, sentiment, and approved snippets",
          "Campaign Asset Library for service information, local awareness posts, disclaimers, and preview images",
        ],
      },
      {
        id: "canva",
        label: "Healthcare Canva Pack",
        summary: "Compliant marketing and communication assets for practice growth workflows.",
        items: [
          "Service menu one-pagers focused on information, eligibility prompts, and booking CTA without medical claims",
          "Referral partner outreach deck for clinic overview, services, process, and contact workflow",
          "Review request cards and reputation response templates with neutral, respectful language",
          "Local awareness social templates for hours, services, team intros, and appointment reminders",
          "Campaign preview checklist with disclaimer area and approval status notes",
        ],
      },
      {
        id: "figma",
        label: "Clinic UI Starter",
        summary: "Trust-forward landing and dashboard UI starter for healthcare operations teams.",
        items: [
          "Design tokens for clinic navy, trust green, warm cream, alert amber, and action teal",
          "Landing modules for service overview, team trust, location, booking CTA, referral partner CTA, and FAQ",
          "Dashboard frames for lead tracker, referral pipeline, review queue, and campaign calendar",
          "Accessibility notes for readable contrast, large form fields, and clear status labels",
          "Compliance handoff notes for disclaimer placement and approval workflow",
        ],
      },
    ],
    listing: {
      title: "Healthcare Practice Growth Kit: Lead Tracker, Referral Workflow, and Marketing Assets",
      description:
        "An operations and marketing workflow kit for clinics and healthcare consultants organizing patient inquiries, referrals, appointment follow-up, reviews, and service communication. Workflow template only; not medical or legal advice.",
      tags: [
        "healthcare marketing",
        "clinic operations",
        "patient lead tracker",
        "referral outreach",
        "notion template",
        "canva healthcare",
        "practice growth",
      ],
    },
    launchPlan: [
      "Build the Practice Growth OS with lead, referral, appointment, review, and campaign databases",
      "Create preview assets with neutral service communication and visible compliance/disclaimer areas",
      "Ship Gumroad/direct outreach at $49 with a consultant license option",
      "Post LinkedIn content about organizing healthcare growth operations without making clinical claims",
      "Validate with healthcare consultants and clinic operators before expanding marketplace reach",
    ],
    channelOverrides: {
      gumroad: {
        audience: "Healthcare consultants and clinic operators needing operational growth workflows",
        price: "$49 launch, $99 practice pack, $199 consultant license",
        listingTitle: "Healthcare Practice Growth Kit: Leads, Referrals, Reviews, and Campaign Assets",
        launchPost:
          "I built a Healthcare Practice Growth Kit for clinic operators and consultants who need patient lead tracking, referral outreach, appointment workflow, review tracking, and service communication assets. Workflow template only; not medical/legal advice.",
        riskNotes:
          "Avoid clinical claims. Lead with workflow organization, approvals, disclaimers, and operational clarity.",
      },
      linkedin: {
        listingTitle: "A safer workflow kit for healthcare practice growth",
        launchPost:
          "Healthcare growth work needs structure and restraint. This kit organizes patient inquiries, referrals, appointment workflows, reviews, and campaign assets without making treatment claims or offering medical advice.",
        riskNotes: "Use compliance-conscious language and avoid before/after health outcome claims.",
      },
      x: {
        listingTitle: "I turned clinic growth operations into a template pack",
        launchPost:
          "New Packsmith preset: Healthcare Practice Growth Kit. Leads -> referrals -> appointment workflow -> reviews -> campaign assets. Workflow template only; not medical/legal advice.",
        riskNotes: "Keep the thread operational. Do not imply clinical outcomes.",
      },
      reddit: {
        listingTitle: "Feedback request: clinic growth workflow template",
        launchPost:
          "I’m validating a healthcare practice growth workflow template for leads, referrals, appointment follow-up, reviews, and campaign assets. It avoids medical advice and focuses on operations. What would make it more useful?",
        riskNotes: "Healthcare subreddits may reject promotion. Ask for workflow feedback only.",
      },
    },
    notion: {
      schemaVersion: "2026-06-packsmith-healthcare-growth-v1",
      parentPage: {
        title: "Healthcare Practice Growth OS",
        icon: "clinic",
        sections: ["Growth Home", "Leads", "Referrals", "Appointment Workflow", "Reviews", "Campaign Assets"],
      },
      pages: [
        {
          id: "growth_home",
          title: "Growth Home",
          purpose: "Operations dashboard for non-clinical practice growth workflows and campaign readiness.",
          blocks: ["Lead follow-ups", "Referral priorities", "Review queue", "Campaign approvals", "Safety note"],
        },
        { id: "leads", title: "Leads", database: "leads" },
        { id: "referrals", title: "Referrals", database: "referrals" },
        { id: "appointment_workflow", title: "Appointment Workflow", database: "appointment_workflow" },
        { id: "reviews", title: "Reviews", database: "reviews" },
        { id: "campaign_assets", title: "Campaign Assets", database: "campaign_assets" },
      ],
      databases: [
        {
          id: "leads",
          name: "Leads",
          properties: [
            { name: "Lead", type: "title" },
            { name: "Source", type: "select", options: ["Website", "Referral", "Phone", "Local campaign"] },
            { name: "Service interest", type: "text" },
            { name: "Consent status", type: "select", options: ["Unknown", "Confirmed", "Do not contact"] },
            { name: "Next follow-up", type: "date" },
            { name: "Outcome", type: "select", options: ["New", "Scheduled", "Closed", "Not a fit"] },
          ],
          sampleRecords: [
            {
              Lead: "New patient inquiry",
              Source: "Website",
              "Service interest": "General consultation information",
              "Consent status": "Confirmed",
              Outcome: "Scheduled",
            },
          ],
        },
        {
          id: "referrals",
          name: "Referrals",
          properties: [
            { name: "Partner", type: "title" },
            { name: "Type", type: "select", options: ["Provider", "Community", "Business", "Consultant"] },
            { name: "Relationship status", type: "select", options: ["Prospect", "Contacted", "Active", "Paused"] },
            { name: "Last touch", type: "date" },
            { name: "Next action", type: "text" },
          ],
          sampleRecords: [
            {
              Partner: "Local wellness partner",
              Type: "Community",
              "Relationship status": "Contacted",
              "Next action": "Send service overview one-pager",
            },
          ],
        },
        {
          id: "appointment_workflow",
          name: "Appointment Workflow",
          properties: [
            { name: "Workflow item", type: "title" },
            { name: "Stage", type: "select", options: ["Intake", "Preparation", "Reminder", "Follow-up"] },
            { name: "Owner", type: "person" },
            { name: "Status", type: "select", options: ["Backlog", "Ready", "In progress", "Done"] },
            { name: "Due date", type: "date" },
          ],
          sampleRecords: [
            {
              "Workflow item": "Confirm appointment prep checklist",
              Stage: "Preparation",
              Status: "Ready",
            },
          ],
        },
        {
          id: "reviews",
          name: "Reviews",
          properties: [
            { name: "Review item", type: "title" },
            { name: "Platform", type: "select", options: ["Google", "Healthgrades", "Website", "Other"] },
            { name: "Request status", type: "select", options: ["Draft", "Sent", "Received", "Responded"] },
            { name: "Sentiment", type: "select", options: ["Positive", "Neutral", "Needs attention"] },
            { name: "Approved snippet", type: "text" },
          ],
          sampleRecords: [
            {
              "Review item": "Post-visit review request",
              Platform: "Google",
              "Request status": "Draft",
              Sentiment: "Neutral",
            },
          ],
        },
        {
          id: "campaign_assets",
          name: "Campaign Assets",
          properties: [
            { name: "Asset", type: "title" },
            { name: "Channel", type: "select", options: ["Canva", "Website", "Email", "Social", "Referral"] },
            { name: "Approval", type: "select", options: ["Draft", "Review", "Approved", "Paused"] },
            { name: "Disclaimer needed", type: "checkbox" },
            { name: "Owner", type: "person" },
          ],
          sampleRecords: [
            {
              Asset: "Service menu one-pager",
              Channel: "Canva",
              Approval: "Review",
              "Disclaimer needed": true,
            },
          ],
        },
      ],
    },
  },
};

export const defaultPresetId = "aiAgency";
export const starterBrief = nichePresets[defaultPresetId].brief;

export function getPreset(presetId = defaultPresetId) {
  return nichePresets[presetId] || nichePresets[defaultPresetId];
}

export function calculateQualityScore(brief) {
  const scoreParts = {
    buyerClarity: Math.min(100, brief.buyer.length * 1.35),
    assetCompleteness: Math.min(100, brief.assets.split(",").filter(Boolean).length * 17),
    marketplaceReadiness: brief.marketplaceTarget ? 90 : 55,
    connectorReadiness: brief.platforms.length * 30,
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

export function buildLaunchChannels(pack, preset) {
  const previewChecklist = [
    `Show the ${pack.name} command dashboard`,
    `Show the ${pack.sections[0]?.label || "Notion"} workflow schema`,
    "Show a 3-frame Canva/Figma preview",
    "Show exactly what the buyer gets in the bundle",
    "Show pricing and commercial-use option clearly",
  ];

  return channelTemplates.map((channel) => {
    const override = preset.channelOverrides?.[channel.id] || {};
    return {
      id: channel.id,
      name: channel.name,
      priority: channel.priority,
      readiness: override.readiness || channel.defaultReadiness,
      audience: override.audience || `${preset.audience} evaluating ${pack.name}`,
      price: override.price || pack.suggestedPrice,
      listingTitle: override.listingTitle || pack.listing.title,
      description: override.description || pack.listing.description,
      tags: override.tags || pack.listing.tags,
      previewChecklist: override.previewChecklist || previewChecklist,
      launchPost:
        override.launchPost ||
        `I’m building ${pack.name}: a Packsmith preset for ${preset.audience}. It turns a rough idea into Notion, Canva, Figma, and marketplace-ready assets.`,
      riskNotes:
        override.riskNotes ||
        "Do not rely on marketplace discovery alone. Lead with workflow screenshots and specific buyer pain.",
    };
  });
}

export function buildTemplatePack(brief, presetId = defaultPresetId) {
  const preset = getPreset(presetId);
  const quality = calculateQualityScore(brief);
  const platformIds = brief.platforms.map((platform) => platform.toLowerCase());

  const pack = {
    id: preset.id,
    presetId: preset.id,
    shortName: preset.shortName,
    name: preset.name,
    audience: preset.audience,
    heroLine: preset.heroLine,
    comparison: preset.comparison,
    buyer: brief.buyer,
    painPoint: brief.painPoint,
    promise: brief.promise,
    assets: brief.assets,
    platforms: brief.platforms,
    style: brief.style,
    marketplaceTarget: brief.marketplaceTarget,
    visualDirection: brief.visualDirection,
    safetyNote: preset.safetyNote,
    quality,
    suggestedPrice: preset.suggestedPrice,
    buildStage: preset.buildStage,
    sections: preset.sections.filter((section) => platformIds.includes(section.id)),
    listing: preset.listing,
    launchPlan: preset.launchPlan,
  };

  return {
    ...pack,
    launchChannels: buildLaunchChannels(pack, preset),
  };
}

export function buildLaunchKit(brief, presetId = defaultPresetId) {
  return buildTemplatePack(brief, presetId);
}

export function buildNotionExport(pack) {
  const preset = getPreset(pack.presetId);
  return {
    schemaVersion: preset.notion.schemaVersion,
    workspaceName: pack.name,
    parentPage: preset.notion.parentPage,
    pages: preset.notion.pages,
    databases: preset.notion.databases,
    safetyNote: preset.safetyNote,
  };
}

export function buildLaunchCalendar(pack) {
  return [
    {
      day: "Day 1",
      focus: "Positioning",
      action: `Publish the ${pack.comparison.bestMarketplace} draft for ${pack.name} and create the first proof post.`,
      owner: "Founder",
    },
    {
      day: "Day 2",
      focus: "Preview assets",
      action: "Create dashboard, platform-output, listing, and bundle-preview screenshots.",
      owner: "Design",
    },
    {
      day: "Day 3",
      focus: "Audience test",
      action: `DM 15 ${pack.audience} with a feedback ask, not a purchase ask.`,
      owner: "Growth",
    },
    {
      day: "Day 4",
      focus: "Launch",
      action: `Launch ${pack.name} through ${pack.comparison.fastestChannel} and add a setup review bonus.`,
      owner: "Founder",
    },
    {
      day: "Day 5",
      focus: "Learning",
      action: "Review clicks, saves, replies, and objections. Turn the top objection into the next pack block.",
      owner: "Founder",
    },
  ];
}
