import { calculateQualityScore, platformOptions } from "./packsmithData";

const channelNames = [
  ["gumroad", "Gumroad", "Primary", "Launch first"],
  ["linkedin", "LinkedIn", "Second", "Post this week"],
  ["x", "X", "Second", "Thread ready"],
  ["reddit", "Reddit", "Research", "Validation only"],
];

function compactName(value, fallback) {
  return value
    .replace(/\b(and|for|with|the|a|an|to|of)\b/gi, "")
    .replace(/[^a-z0-9 ]/gi, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ") || fallback;
}

function splitAssets(assets) {
  return assets
    .split(",")
    .map((asset) => asset.trim())
    .filter(Boolean);
}

export function buildCustomPack(brief) {
  const assets = splitAssets(brief.assets);
  const shortNiche = compactName(brief.niche, "Custom");
  const name = `${shortNiche} Template Launch Kit`;
  const quality = calculateQualityScore({ ...brief, platforms: brief.platforms || platformOptions });
  const assetList = assets.length ? assets : ["dashboard", "content pack", "launch board"];

  const sections = [
    {
      id: "notion",
      label: "Notion OS",
      summary: `Operating system for ${brief.buyer || "the target buyer"} to manage the workflow from first signal to launch.`,
      items: [
        `Command Home for ${shortNiche} priorities, active work, and launch readiness`,
        `${assetList[0]} tracker with status, owner, next action, and deadline`,
        `${assetList[1] || "Buyer research"} database with source, insight, priority, and decision`,
        `${assetList[2] || "Asset"} library with approval status, channel, and reuse notes`,
        "Weekly review dashboard for blockers, proof, next experiments, and follow-up",
      ],
    },
    {
      id: "canva",
      label: "Canva Pack",
      summary: `Launch and content assets for packaging ${name} with a clear buyer promise.`,
      items: [
        `10-slide pitch deck for ${brief.painPoint || "the buyer pain"} and the product promise`,
        "12 social proof posts for problem education, workflow screenshots, and buyer objections",
        "5 carousel structures for launch story, use cases, pricing, and call to action",
        "Marketplace preview checklist with cover, contents, benefits, and license slides",
        "One-page offer sheet for direct outreach and early buyer feedback",
      ],
    },
    {
      id: "figma",
      label: "Figma UI Kit",
      summary: `Design starter for landing pages, dashboards, and product previews around ${name}.`,
      items: [
        "Retro-futuristic design tokens for dark surfaces, amber accents, green status, and blue signal states",
        "Landing page hero, benefit grid, pricing strip, testimonial block, and waitlist form",
        "Dashboard frames for command home, asset tracker, launch board, and marketplace preview",
        "Component set for metric cards, pipeline steps, status badges, and export buttons",
        "Screenshot handoff notes for Gumroad, LinkedIn, X, and investor-demo assets",
      ],
    },
  ].filter((section) => (brief.platforms || platformOptions).map((p) => p.toLowerCase()).includes(section.id));

  const listing = {
    title: `${name}: Notion, Canva, Figma, and Launch Assets`,
    description: `A Packsmith-generated launch kit for ${brief.buyer || "a focused buyer group"}. It turns ${brief.painPoint || "a messy workflow"} into a sellable Notion system, Canva content pack, Figma UI starter, and marketplace launch plan.`,
    tags: [
      shortNiche.toLowerCase(),
      "template pack",
      "notion template",
      "canva pack",
      "figma ui kit",
      "gumroad product",
      "digital template",
    ],
  };

  const pack = {
    id: "custom-generated-pack",
    presetId: "custom",
    shortName: shortNiche,
    name,
    audience: brief.buyer || "custom template buyers",
    heroLine: `Turn a rough ${shortNiche} idea into a launch-ready template pack.`,
    comparison: {
      expectedPrice: "$19-$99",
      bestMarketplace: brief.marketplaceTarget || "Gumroad",
      fastestChannel: "LinkedIn/X validation",
      connectorReadiness: "Prototype",
    },
    buyer: brief.buyer,
    painPoint: brief.painPoint,
    promise: brief.promise,
    assets: brief.assets,
    platforms: brief.platforms || platformOptions,
    style: brief.style || "Retro-futuristic forge",
    marketplaceTarget: brief.marketplaceTarget || "Gumroad",
    visualDirection: brief.visualDirection || "Dark command center, blueprint grid, amber/green terminal accents.",
    quality,
    suggestedPrice: "$19 launch / $49 premium / $99 commercial",
    buildStage: "Local mock generation",
    sections,
    listing,
    launchPlan: [
      `Validate ${name} with 10 people in the target audience`,
      "Create four screenshots: command home, platform output, launch board, and pricing",
      `Publish a ${brief.marketplaceTarget || "Gumroad"} draft and collect feedback before paid launch`,
      "Post a LinkedIn/X build log showing rough input to generated pack output",
      "Turn the top objection into the next generated asset block",
    ],
  };

  return {
    ...pack,
    launchChannels: channelNames.map(([id, channelName, priority, readiness]) => ({
      id,
      name: channelName,
      priority,
      readiness,
      audience: pack.audience,
      price: pack.suggestedPrice,
      listingTitle: listing.title,
      description: listing.description,
      tags: listing.tags,
      previewChecklist: [
        "Show the rough input prompt",
        "Show the generated Notion/Canva/Figma sections",
        "Show the marketplace listing and price ladder",
        "Show export buttons and launch calendar",
      ],
      launchPost: `I generated a ${name} from one rough brief: buyer, pain point, assets, platform outputs, and launch copy. This is the Packsmith local generation flow before live AI providers are connected.`,
      riskNotes: "Mock generation needs human review before selling. Use it to validate the workflow and buyer promise.",
    })),
  };
}

export function buildCustomNotionExport(pack) {
  return {
    schemaVersion: "2026-07-packsmith-custom-local-v1",
    workspaceName: pack.name,
    parentPage: {
      title: `${pack.shortName} Command OS`,
      icon: "console",
      sections: ["Command Home", "Asset Tracker", "Buyer Signals", "Launch Board"],
    },
    pages: [
      {
        id: "command_home",
        title: "Command Home",
        purpose: "Local-generated command center for the custom template pack.",
        blocks: ["Launch promise", "Buyer pain", "Platform outputs", "Next experiments"],
      },
      { id: "asset_tracker", title: "Asset Tracker", database: "assets" },
      { id: "buyer_signals", title: "Buyer Signals", database: "signals" },
      { id: "launch_board", title: "Launch Board", database: "launch_tasks" },
    ],
    databases: [
      {
        id: "assets",
        name: "Assets",
        properties: [
          { name: "Asset", type: "title" },
          { name: "Platform", type: "select", options: pack.platforms },
          { name: "Status", type: "select", options: ["Draft", "Review", "Ready"] },
          { name: "Owner", type: "person" },
        ],
        sampleRecords: [{ Asset: "Command Home", Platform: "Notion", Status: "Draft" }],
      },
      {
        id: "signals",
        name: "Buyer Signals",
        properties: [
          { name: "Signal", type: "title" },
          { name: "Source", type: "select", options: ["Call", "DM", "Comment", "Search"] },
          { name: "Priority", type: "select", options: ["Low", "Medium", "High"] },
        ],
        sampleRecords: [{ Signal: "Asked for done-for-you setup", Source: "DM", Priority: "High" }],
      },
      {
        id: "launch_tasks",
        name: "Launch Tasks",
        properties: [
          { name: "Task", type: "title" },
          { name: "Channel", type: "select", options: ["Gumroad", "LinkedIn", "X", "Reddit"] },
          { name: "Status", type: "select", options: ["Backlog", "Drafting", "Ready", "Shipped"] },
        ],
        sampleRecords: [{ Task: "Publish validation post", Channel: "LinkedIn", Status: "Drafting" }],
      },
    ],
  };
}
