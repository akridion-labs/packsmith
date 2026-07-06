const colorTokens = [
  { name: "ink", value: "#f7f1e5", use: "Primary text on dark surfaces" },
  { name: "charcoal", value: "#111719", use: "Base panels and app shells" },
  { name: "forgeGold", value: "#efbd63", use: "Primary action and premium accent" },
  { name: "signalGreen", value: "#42d1a0", use: "Ready/success states" },
  { name: "signalBlue", value: "#76a8ff", use: "Links and product highlights" },
  { name: "coral", value: "#ff806f", use: "Warnings and conversion moments" },
  { name: "violet", value: "#a98bff", use: "Figma/product-kit accents" },
];

const componentBlueprints = [
  "Hero command panel",
  "Niche selector card",
  "Quality score tile",
  "Output asset card",
  "Launch channel card",
  "Figma product preview card",
  "Mobile device preview",
  "Marketplace screenshot frame",
  "Status badge",
  "CTA button group",
];

function figmaSectionItems(pack) {
  return pack.sections?.find((section) => section.id === "figma")?.items || [];
}

export function buildFigmaExportSchema(pack, marketingKit = {}) {
  const figmaItems = figmaSectionItems(pack);
  const productLaunches = marketingKit.figmaProductLaunches || [];

  return {
    schemaVersion: "2026-07-packsmith-figma-export-v1",
    exportType: "figma_product_kit_spec",
    security: {
      containsSecrets: false,
      storesTokens: false,
      note: "This is a design/export schema only. Figma OAuth tokens or plugin credentials must stay server-side or inside the official Figma/plugin auth flow.",
    },
    pack: {
      name: pack.name,
      presetId: pack.presetId || pack.id || "custom",
      audience: pack.audience,
      promise: pack.promise,
      marketplaceTarget: pack.marketplaceTarget,
    },
    designSystem: {
      theme: pack.visualDirection || "Retro-futuristic command center",
      colorTokens,
      typography: [
        { role: "Display", style: "Bold compact SaaS headline", usage: "Landing and product hero frames" },
        { role: "Body", style: "Readable UI sans", usage: "Cards, output blocks, notes, and descriptions" },
        { role: "Label", style: "Uppercase status label", usage: "Badges, channel labels, and metadata" },
      ],
      components: componentBlueprints.map((name) => ({
        name,
        variants: ["default", "active", "ready", "needs-review"],
      })),
    },
    frames: [
      {
        id: "landing-page-kit",
        name: `${pack.shortName || pack.name} Landing Page Kit`,
        size: "1440x1200",
        purpose: "Sell the template pack with hero, product stack, pricing, proof, and CTA sections.",
        sections: ["Hero", "Problem", "Product stack", "Figma previews", "Pricing", "FAQ", "CTA"],
      },
      {
        id: "dashboard-ui-kit",
        name: `${pack.shortName || pack.name} Dashboard UI Kit`,
        size: "1440x1024",
        purpose: "Preview the operational dashboard buyers receive or expect.",
        sections: ["Command home", "Metric tiles", "Workflow table", "Launch status", "Export panel"],
      },
      {
        id: "marketplace-preview-kit",
        name: `${pack.shortName || pack.name} Marketplace Preview Kit`,
        size: "1600x1200",
        purpose: "Create Gumroad, Figma Community, UI8, and social preview assets.",
        sections: ["Cover", "Bundle contents", "Before/after", "Feature cards", "License notes"],
      },
      {
        id: "mobile-preview-kit",
        name: `${pack.shortName || pack.name} Mobile Preview Kit`,
        size: "390x844",
        purpose: "Show phone/tablet usability and PWA install story.",
        sections: ["Mobile hero", "Saved pack card", "Launch asset card", "Notion handoff", "CTA"],
      },
    ],
    productLaunches,
    sourceItems: figmaItems,
    handoffChecklist: [
      "Create color variables before components",
      "Build component variants for default, active, ready, and needs-review states",
      "Use real product copy from the active pack",
      "Avoid fake readable tiny text in preview mockups",
      "Export marketplace preview frames as PNG/WebP after review",
    ],
  };
}
