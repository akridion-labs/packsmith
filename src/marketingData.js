export function buildMarketingKit(pack) {
  const primaryChannel = pack.comparison?.bestMarketplace || pack.marketplaceTarget || "Gumroad";
  const fastestChannel = pack.comparison?.fastestChannel || "LinkedIn/X";

  return {
    videoScript: [
      {
        time: "0-5s",
        visual: "Retro terminal flashes: rough idea enters Packsmith.",
        voiceover: "What if one messy idea could become a sellable template pack in under a minute?",
      },
      {
        time: "6-15s",
        visual: `Switch through ${pack.name}, platform outputs, and quality score.`,
        voiceover: `Packsmith turns a niche like ${pack.shortName || pack.name} into a Notion system, Canva pack, Figma starter, and launch plan.`,
      },
      {
        time: "16-30s",
        visual: "Show editable output cards and Notion publish simulation.",
        voiceover: "You can edit every generated block, preview the Notion schema, and export a publish-ready payload.",
      },
      {
        time: "31-45s",
        visual: "Open Launch Board: Gumroad, LinkedIn, X, Reddit, marketplaces.",
        voiceover: "Then Packsmith generates the marketing layer: listing copy, launch posts, pricing, preview checklist, and risk notes.",
      },
      {
        time: "46-60s",
        visual: "Landing page CTA and app export buttons.",
        voiceover: `Start with ${pack.name}, validate on ${fastestChannel}, and sell first through ${primaryChannel}. Packsmith is the template-pack forge for solo founders.`,
      },
    ],
    linkedinPost: `I’m building Packsmith: a retro-futuristic template-pack forge for solo founders.\n\nThe current demo turns one niche into:\n- Notion workspace schema\n- Canva content/pitch pack\n- Figma UI starter\n- Marketplace listing copy\n- Launch calendar and channel plan\n\nCurrent featured pack: ${pack.name}.\n\nThe goal is simple: go from rough idea to sellable template pack without starting from a blank page.`,
    xThread: [
      `I’m building Packsmith: rough idea -> sellable template pack.`,
      `Current demo: ${pack.name}. It creates Notion, Canva, Figma, listing copy, and launch channels.`,
      `The product is not trying to mass-generate generic templates. It helps founders package niche-specific systems.`,
      `The launch board is my favorite part: Gumroad copy, LinkedIn post, X thread, Reddit validation, marketplace risks.`,
      `Next: real AI provider, Notion publishing, and first paid template pack.`,
    ],
    shotList: [
      "Hero page: Packsmith brand, retro grid, CTA",
      "Niche selector: AI Agency, SaaS, Healthcare",
      "Forge workspace: editable output cards",
      "Custom generator: rough prompt to generated pack",
      "Notion simulation: pages, databases, sample records",
      "Launch board: Gumroad and LinkedIn/X channel cards",
      "Marketing kit export: video script and social copy",
      "Final CTA: Generate a pack",
    ],
    runwayPrompts: [
      "Retro-futuristic founder command center, dark glass console, amber and green terminal glow, blueprint grid, cinematic product demo b-roll, no readable text",
      "A digital forge assembling modular UI cards into a template pack, glowing Notion Canva Figma icons as abstract blocks, premium SaaS cinematic lighting",
      "Close-up of a dark dashboard interface with moving pipeline nodes, amber highlights, green status indicators, high-end software product reveal",
      "Founder workspace at night with multiple floating product panels, launch metrics, template cards, marketplace board, retro-futuristic but professional",
    ],
    avatarScript: `Hey, I’m building Packsmith. It turns one rough niche idea into a ready-to-sell template pack: Notion workspace, Canva content pack, Figma UI starter, marketplace listing, and launch plan. In this demo, I can switch between ${pack.name} and other niche presets, edit the generated outputs, simulate a Notion publish payload, and export marketing assets. The goal is to help solo founders create and validate template products faster.`,
    canvaOutline: [
      "Slide 1: Packsmith - Rough idea to sellable template pack",
      "Slide 2: The problem - creators start from blank pages and generic AI outputs",
      "Slide 3: The workflow - idea, blueprint, platform assets, market launch",
      `Slide 4: Featured niche - ${pack.name}`,
      "Slide 5: Outputs - Notion, Canva, Figma, listing, launch board",
      "Slide 6: Product demo screenshots and export buttons",
      "Slide 7: Market wedge - Gumroad first, LinkedIn/X validation",
      "Slide 8: Roadmap - real AI, Notion publishing, first paid pack",
    ],
  };
}

export function marketingKitToMarkdown(pack, kit) {
  return `# ${pack.name} Marketing Kit

## 60-Second Demo Script
${kit.videoScript.map((item) => `### ${item.time}\nVisual: ${item.visual}\n\nVoiceover: ${item.voiceover}`).join("\n\n")}

## LinkedIn Post
${kit.linkedinPost}

## X Thread
${kit.xThread.map((tweet, index) => `${index + 1}. ${tweet}`).join("\n")}

## Product Demo Shot List
${kit.shotList.map((shot) => `- ${shot}`).join("\n")}

## Runway Prompts
${kit.runwayPrompts.map((prompt) => `- ${prompt}`).join("\n")}

## HeyGen/Synthesia Avatar Script
${kit.avatarScript}

## Canva Presentation Outline
${kit.canvaOutline.map((slide) => `- ${slide}`).join("\n")}
`;
}
