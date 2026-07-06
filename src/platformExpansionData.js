export const platformExpansionPaths = [
  {
    id: "chatgpt",
    platform: "ChatGPT",
    lane: "Apps SDK + GPT Actions + MCP",
    priority: "First",
    readiness: 78,
    audience: "Founders who want to generate packs directly inside ChatGPT.",
    productIdea: "Packsmith assistant that turns a chat brief into a saved template pack, launch brief, and checkout copy.",
    mvpActions: [
      "Expose pack generation as API endpoints with OpenAPI schemas.",
      "Create GPT Actions for generate pack, export markdown, export marketplace listing, and save pack.",
      "Prepare an Apps SDK/MCP version for richer in-ChatGPT UI once backend auth is ready.",
    ],
    dataBoundary: "ChatGPT receives pack inputs and generated outputs only after user action; OAuth and publish tokens stay server-side.",
    monetization: "Free GPT for discovery, Packsmith account required to save history or export premium bundles.",
    risk: "Custom GPTs are easy to copy, so the moat should be saved history, pack quality, connectors, and paid templates.",
  },
  {
    id: "claude",
    platform: "Claude",
    lane: "MCP server",
    priority: "First",
    readiness: 82,
    audience: "Operators who want Claude to inspect, refine, and export Packsmith-generated packs.",
    productIdea: "Packsmith MCP server with tools for generating packs, reading saved packs, and producing Notion/Figma/marketing exports.",
    mvpActions: [
      "Build an MCP server around the existing preset engine.",
      "Add read-only saved pack resources and explicit write tools for save/export.",
      "Ship a local developer config first, then remote MCP after auth hardening.",
    ],
    dataBoundary: "No shell execution, no raw secrets, strict tool allowlist, and user-confirmed write operations.",
    monetization: "Useful for power users; paid plan unlocks cloud history and connector exports.",
    risk: "MCP tools need careful prompt-injection boundaries because assistants can be asked to operate on untrusted content.",
  },
  {
    id: "adobe-express",
    platform: "Adobe Express",
    lane: "Add-on",
    priority: "Second",
    readiness: 64,
    audience: "Creators who want Packsmith to create social posts, decks, and launch creatives inside Adobe Express.",
    productIdea: "Packsmith Creative Kit add-on that imports launch copy, brand prompts, and template pack sections into editable Adobe Express assets.",
    mvpActions: [
      "Start with Adobe Express add-on, not Photoshop.",
      "Convert Canva-style specs into Adobe Express content cards and presentation/page outlines.",
      "Add export package: titles, captions, slide outline, visual prompt, and image checklist.",
    ],
    dataBoundary: "Only send user-approved text and asset instructions to Adobe; keep account and connector tokens out of frontend storage.",
    monetization: "Adobe marketplace discovery plus upsell to Packsmith paid templates.",
    risk: "Adobe review/distribution can take longer, so keep web exports working as the fallback.",
  },
  {
    id: "photoshop",
    platform: "Adobe Photoshop",
    lane: "UXP plugin",
    priority: "Later",
    readiness: 38,
    audience: "Design-heavy teams turning generated packs into polished visual mockups.",
    productIdea: "Photoshop panel that turns Packsmith preview prompts and screenshots into editable product mockup workflows.",
    mvpActions: [
      "Defer until Adobe Express traction is proven.",
      "Use UXP only for preview/mockup workflows, not the core pack generator.",
      "Keep API calls behind the Packsmith backend.",
    ],
    dataBoundary: "Desktop plugin should never embed service-role keys or Notion/Google secrets.",
    monetization: "Premium creative workflow add-on for agencies.",
    risk: "Higher build and support cost than Express, ChatGPT, or Claude.",
  },
  {
    id: "figma",
    platform: "Figma",
    lane: "Plugin + design export schema",
    priority: "Second",
    readiness: 70,
    audience: "Designers and founders who want generated UI kits and landing frames inside Figma.",
    productIdea: "Generate Packsmith UI kit frames, variables, launch-page blocks, and marketplace preview screens in Figma.",
    mvpActions: [
      "Use the existing Figma export schema as the plugin contract.",
      "Create frames from pack sections, quality score, and launch-channel assets.",
      "Add one-click preview board for Gumroad screenshots.",
    ],
    dataBoundary: "Figma plugin receives export JSON, not private saved history unless the user signs in.",
    monetization: "Free preview plugin, paid exports for full multi-frame kits.",
    risk: "Needs strong visual output quality; weak generated layouts will hurt trust quickly.",
  },
  {
    id: "canva",
    platform: "Canva",
    lane: "App / template importer",
    priority: "Second",
    readiness: 58,
    audience: "Template sellers who want launch decks, social posts, and listing graphics fast.",
    productIdea: "Packsmith importer that turns marketing kit exports into editable Canva-ready campaign assets.",
    mvpActions: [
      "Keep Canva export-first while validating demand.",
      "Package deck outlines, social captions, and visual prompts as a Canva import workflow.",
      "Later explore Canva app distribution after the Gumroad/Adobe Express path proves traction.",
    ],
    dataBoundary: "Only export creative briefs and text assets selected by the user.",
    monetization: "Premium campaign packs and niche-specific creative bundles.",
    risk: "Canva template market is crowded, so niches and buyer outcomes matter more than generic designs.",
  },
  {
    id: "browser-extension",
    platform: "Chrome / Edge",
    lane: "Browser extension",
    priority: "Later",
    readiness: 52,
    audience: "Founders researching niches across Gumroad, Etsy, Reddit, X, and LinkedIn.",
    productIdea: "Clip examples, capture marketplace patterns, and send structured inspiration into Packsmith.",
    mvpActions: [
      "Add manual URL/import first inside the web app.",
      "Build extension only after users repeatedly ask to capture external inspiration.",
      "Store clipped source metadata with clear consent and deletion controls.",
    ],
    dataBoundary: "No background scraping by default; user-triggered capture only.",
    monetization: "Research workflow for paid builders.",
    risk: "Privacy review and store approval require careful permission minimization.",
  },
];

export function buildPlatformExpansionSummary(paths = platformExpansionPaths) {
  const firstWave = paths.filter((path) => path.priority === "First");
  const secondWave = paths.filter((path) => path.priority === "Second");
  const laterWave = paths.filter((path) => path.priority === "Later");
  const averageReadiness = Math.round(paths.reduce((sum, path) => sum + path.readiness, 0) / paths.length);

  return {
    total: paths.length,
    averageReadiness,
    firstWave: firstWave.map((path) => path.platform),
    secondWave: secondWave.map((path) => path.platform),
    laterWave: laterWave.map((path) => path.platform),
    recommendation:
      "Build one shared Packsmith API/MCP contract first, then ship ChatGPT Actions and Claude MCP before heavier creative marketplace plugins.",
  };
}

export function buildPlatformExpansionMarkdown(paths = platformExpansionPaths) {
  const summary = buildPlatformExpansionSummary(paths);
  const lines = [
    "# Packsmith Platform Expansion Plan",
    "",
    `Recommendation: ${summary.recommendation}`,
    "",
    `First wave: ${summary.firstWave.join(", ")}`,
    `Second wave: ${summary.secondWave.join(", ")}`,
    `Later wave: ${summary.laterWave.join(", ")}`,
    "",
    "## Platform Paths",
    ...paths.flatMap((path) => [
      "",
      `### ${path.platform}`,
      `Lane: ${path.lane}`,
      `Priority: ${path.priority}`,
      `Readiness: ${path.readiness}/100`,
      `Audience: ${path.audience}`,
      `Product idea: ${path.productIdea}`,
      "",
      "Actions:",
      ...path.mvpActions.map((action) => `- ${action}`),
      "",
      `Security boundary: ${path.dataBoundary}`,
      `Monetization: ${path.monetization}`,
      `Risk: ${path.risk}`,
    ]),
  ];

  return lines.join("\n");
}
