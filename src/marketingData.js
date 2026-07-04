export function buildMarketingKit(pack) {
  const primaryChannel = pack.comparison?.bestMarketplace || pack.marketplaceTarget || "Gumroad";
  const fastestChannel = pack.comparison?.fastestChannel || "LinkedIn/X";
  const figmaSection = pack.sections?.find((section) => section.id === "figma");
  const notionSection = pack.sections?.find((section) => section.id === "notion");
  const canvaSection = pack.sections?.find((section) => section.id === "canva");

  return {
    productStack: [
      {
        id: "notion",
        platform: "Notion",
        product: notionSection?.label || "Notion Operating System",
        angle: "The system buyers actually use after purchase.",
        proof: notionSection?.summary || "Pages, databases, properties, sample records, and publish-ready payload.",
      },
      {
        id: "figma",
        platform: "Figma",
        product: figmaSection?.label || "Figma Product/UI Kit",
        angle: "The visual product layer that makes the pack feel premium.",
        proof: figmaSection?.summary || "Landing page frames, dashboard components, design tokens, and handoff specs.",
      },
      {
        id: "canva",
        platform: "Canva",
        product: canvaSection?.label || "Canva Launch Pack",
        angle: "The content layer that helps the buyer launch and share.",
        proof: canvaSection?.summary || "Decks, social posts, preview images, and marketplace creative prompts.",
      },
      {
        id: "mobile",
        platform: "Mobile/PWA",
        product: "Phone and tablet access",
        angle: "The accessibility layer that makes the product easy to try anywhere.",
        proof: "Installable web app path, dashboard history, mobile access page, and Notion app handoff.",
      },
      {
        id: "assistants",
        platform: "Claude / ChatGPT",
        product: "Assistant handoff exports",
        angle: "The remix layer for users who already work inside AI assistant apps.",
        proof: "Markdown, JSON, marketing scripts, and structured prompts designed for clean assistant context.",
      },
    ],
    figmaProductLaunches: [
      {
        name: `${pack.shortName || pack.name} Landing Page Kit`,
        buyerPromise: "Launch-page frames, pricing sections, proof blocks, and responsive hero variants.",
        marketplace: "Figma Community first, UI8 later",
      },
      {
        name: `${pack.shortName || pack.name} Dashboard UI Kit`,
        buyerPromise: "Command dashboards, metric cards, workflow states, badges, and table/list surfaces.",
        marketplace: "Gumroad bundle upgrade",
      },
      {
        name: `${pack.shortName || pack.name} Marketplace Preview Kit`,
        buyerPromise: "Product mockups, cover frames, feature cards, and screenshot templates for selling the pack.",
        marketplace: "Creative Market or Gumroad bonus",
      },
    ],
    mobileLaunchCampaign: {
      linkedinPost: `I’m making Packsmith mobile-ready because template ideas do not only happen at a desk.\n\nThe product now has:\n- Notion OS for the actual workspace\n- Figma product/UI kit for premium product visuals\n- Canva launch pack for social and sales assets\n- Mobile/PWA access for phone and tablet workflows\n- Claude/ChatGPT handoff through clean Markdown and JSON exports\n\nThe positioning is simple: retro enough to explore, useful enough to return.\n\nCurrent demo: ${pack.name}.`,
      xThread: [
        "Packsmith is no longer just a Notion template generator.",
        `Current demo: ${pack.name}. It creates Notion OS + Figma product kit + Canva launch pack + marketplace copy.`,
        "The mobile/PWA layer matters: people should be able to check, reopen, and share a pack from phone or tablet.",
        "Figma is the visual wedge: landing pages, dashboard UI, preview images, and productized screens make the template pack feel premium.",
        "The assistant handoff is the remix layer: export Markdown/JSON, then continue inside Claude or ChatGPT.",
        "Retro gets attention. Useful cross-platform output earns the return visit.",
      ],
      shortVideoScript: [
        "0-5s: Show retro Packsmith launch page on desktop, then swipe to phone preview.",
        `6-15s: Open ${pack.name} and show the product stack: Notion, Figma, Canva, Mobile, Assistants.`,
        "16-30s: Show Figma product kit cards and marketplace preview frames.",
        "31-45s: Open dashboard history, reopen a saved pack, edit an output block.",
        "46-60s: Export Notion JSON, marketing copy, and assistant prompt. End with Try the forge.",
      ],
      screenshotChecklist: [
        "Launch page hero with retro-modern headline",
        "Mobile showcase phone preview",
        "Product stack cards showing Notion, Figma, Canva, Mobile, Assistants",
        "Figma product launch section",
        "Dashboard saved-pack reopen flow",
        "Forge editable output block",
        "Notion simulation and export buttons",
      ],
    },
    emergingSharingStreams: [
      {
        id: "tiktok-reels-shorts",
        platform: "TikTok / Reels / YouTube Shorts",
        format: "Vertical 20-45s demo",
        angle: "Show rough idea -> product stack -> copied launch asset.",
        prompt: `Record ${pack.name} as a fast before/after: messy idea, Notion OS, Figma kit, Canva pack, mobile dashboard, export button.`,
      },
      {
        id: "threads-bluesky",
        platform: "Threads / Bluesky",
        format: "Build-in-public thread",
        angle: "Founder story, product decisions, and open feedback ask.",
        prompt: `Share why ${pack.name} is not just a Notion template: it includes Figma product surfaces, Canva launch creative, and assistant exports.`,
      },
      {
        id: "lemon8-pinterest",
        platform: "Lemon8 / Pinterest",
        format: "Visual checklist carousel",
        angle: "Curated lifestyle/productivity board for template buyers.",
        prompt: `Create a visual checklist: what buyers get in ${pack.name}, preview frames, dashboard screenshots, and launch steps.`,
      },
      {
        id: "loops-fediverse",
        platform: "Loops / Fediverse video",
        format: "Privacy-friendly short demo",
        angle: "Indie software, open web, and useful workflow story.",
        prompt: `Post a concise indie-builder demo: Packsmith turns one product idea into Notion, Figma, Canva, mobile, and AI-assistant assets.`,
      },
      {
        id: "reddit-communities",
        platform: "Reddit communities",
        format: "Feedback-first validation post",
        angle: "Ask operators what is missing before selling.",
        prompt: `Ask for feedback on ${pack.name}: would the Notion OS, Figma UI kit, and launch assets actually help this niche?`,
      },
    ],
    aiCreativePlatforms: [
      {
        id: "nano-banana",
        platform: "Gemini / Nano Banana",
        use: "Fast image concepts and preview variants",
        prompt: `Create retro-modern product preview images for ${pack.name}: phone screen, Figma UI kit, Notion dashboard, Canva social cards, amber/green command-center palette, no fake readable UI text.`,
      },
      {
        id: "adobe-firefly",
        platform: "Adobe Firefly / Adobe Express",
        use: "Brand-safe launch visuals, short video, audio, and social variants",
        prompt: `Generate premium retro-futuristic launch creatives for ${pack.name}: product mockups, vertical video background, social cover images, and clean marketplace preview graphics.`,
      },
      {
        id: "runway",
        platform: "Runway",
        use: "Cinematic product demo b-roll",
        prompt: `A retro-futuristic SaaS forge assembles Notion, Figma, Canva, mobile, and AI assistant cards into a sellable template pack, cinematic lighting, no readable text.`,
      },
      {
        id: "canva",
        platform: "Canva AI / Magic Studio",
        use: "Carousels, pitch decks, and resized social creative",
        prompt: `Turn ${pack.name} into a launch carousel: problem, product stack, Figma previews, mobile access, Notion handoff, CTA.`,
      },
      {
        id: "capcut",
        platform: "CapCut / TikTok creative tools",
        use: "Fast vertical edits and captions",
        prompt: `Create a fast vertical founder demo script for ${pack.name}: hook, screen recording beats, captions, CTA to try Packsmith.`,
      },
      {
        id: "heygen-synthesia",
        platform: "HeyGen / Synthesia",
        use: "Avatar walkthrough",
        prompt: `Avatar presenter explains ${pack.name} as a template product bundle: Notion OS, Figma product kit, Canva pack, mobile access, assistant handoff.`,
      },
    ],
    videoScript: [
      {
        time: "0-5s",
        visual: "Retro terminal flashes: rough idea enters Packsmith.",
        voiceover: "What if one messy idea could become a sellable template pack in under a minute?",
      },
      {
        time: "6-15s",
        visual: `Switch through ${pack.name}, platform outputs, and quality score.`,
        voiceover: `Packsmith turns a niche like ${pack.shortName || pack.name} into a Notion OS, Figma product kit, Canva launch pack, mobile workflow, and launch plan.`,
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
    linkedinPost: `I’m building Packsmith: a retro-futuristic template-pack forge for solo founders.\n\nThe current demo turns one niche into:\n- Notion workspace schema\n- Figma product/UI kit\n- Canva content/pitch pack\n- Mobile/PWA access story\n- Claude/ChatGPT handoff exports\n- Marketplace listing copy\n- Launch calendar and channel plan\n\nCurrent featured pack: ${pack.name}.\n\nThe goal is simple: go from rough idea to sellable template product without starting from a blank page.`,
    xThread: [
      `I’m building Packsmith: rough idea -> sellable template pack.`,
      `Current demo: ${pack.name}. It creates Notion OS, Figma product kit, Canva launch pack, listing copy, and launch channels.`,
      `The product is not trying to mass-generate generic templates. It helps founders package niche-specific systems.`,
      `Figma is a key wedge: it turns the pack from "useful doc" into premium product surfaces, previews, and UI assets.`,
      `The launch board is my favorite part: Gumroad copy, LinkedIn post, X thread, Reddit validation, marketplace risks.`,
      `Next: real AI provider, Notion/Figma publishing paths, and first paid template pack.`,
    ],
    shotList: [
      "Hero page: Packsmith brand, retro grid, CTA",
      "Launch page: mobile/PWA showcase and retro x upgrade section",
      "Niche selector: AI Agency, SaaS, Healthcare",
      "Forge workspace: editable output cards",
      "Figma product kit: landing, dashboard, and marketplace preview cards",
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
    avatarScript: `Hey, I’m building Packsmith. It turns one rough niche idea into a ready-to-sell template product: Notion workspace, Figma product and UI kit, Canva launch pack, mobile access story, marketplace listing, and launch plan. In this demo, I can switch between ${pack.name} and other niche presets, edit the generated outputs, reopen saved packs from the dashboard, simulate a Notion publish payload, and export marketing assets. The goal is to help solo founders create and validate template products faster.`,
    canvaOutline: [
      "Slide 1: Packsmith - Rough idea to sellable template pack",
      "Slide 2: The problem - creators start from blank pages and generic AI outputs",
      "Slide 3: The workflow - idea, blueprint, platform assets, market launch",
      `Slide 4: Featured niche - ${pack.name}`,
      "Slide 5: Product stack - Notion, Figma, Canva, Mobile, Assistants",
      "Slide 6: Figma product wedge - UI kits, landing pages, marketplace previews",
      "Slide 7: Product demo screenshots and export buttons",
      "Slide 8: Market wedge - Gumroad first, LinkedIn/X validation, Figma Community later",
      "Slide 9: Roadmap - real AI, Notion/Figma publishing, first paid pack",
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

## Product Stack
${kit.productStack.map((item) => `- ${item.platform}: ${item.product} - ${item.angle}`).join("\n")}

## Figma Product Launches
${kit.figmaProductLaunches.map((item) => `- ${item.name}: ${item.buyerPromise} (${item.marketplace})`).join("\n")}

## Mobile Launch Campaign
LinkedIn:
${kit.mobileLaunchCampaign.linkedinPost}

Thread:
${kit.mobileLaunchCampaign.xThread.map((tweet, index) => `${index + 1}. ${tweet}`).join("\n")}

## Emerging Sharing Streams
${kit.emergingSharingStreams.map((item) => `- ${item.platform}: ${item.format} - ${item.prompt}`).join("\n")}

## AI Creative Platforms
${kit.aiCreativePlatforms.map((item) => `- ${item.platform}: ${item.use}\n  Prompt: ${item.prompt}`).join("\n")}

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
