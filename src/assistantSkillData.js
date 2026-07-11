export const assistantSkillSurfaces = [
  {
    id: "chatgpt",
    name: "ChatGPT Skill",
    status: "Copy-ready",
    promise: "Turn rough template ideas into Packsmith-ready pack briefs, launch copy, and design prompts.",
  },
  {
    id: "claude",
    name: "Claude Project",
    status: "Copy-ready",
    promise: "Use Packsmith as project context for improving templates, positioning, and launch assets.",
  },
  {
    id: "figma",
    name: "Figma handoff",
    status: "Spec-ready",
    promise: "Create frames, tokens, sections, and preview boards from the generated pack.",
  },
  {
    id: "canva",
    name: "Canva handoff",
    status: "Prompt-ready",
    promise: "Create social posts, covers, carousels, and decks from the generated pack.",
  },
];

function packSummary(pack) {
  return [
    `Pack: ${pack.name}`,
    `Buyer: ${pack.audience || pack.buyer || "Template buyer"}`,
    `Promise: ${pack.promise}`,
    `Primary marketplace: ${pack.marketplaceTarget || pack.comparison?.bestMarketplace || "Gumroad"}`,
    `Suggested price: ${pack.suggestedPrice || pack.comparison?.expectedPrice || "Validate in INR"}`,
  ].join("\n");
}

export function buildAssistantSkillPack(pack) {
  const summary = packSummary(pack);
  const coreRules = [
    "Use simple creator-friendly language, not technical export jargon.",
    "Turn rough ideas into buyer, pain point, promise, included assets, price ladder, and launch channel.",
    "Create design prompts for Notion, Canva, Figma, Instagram, and marketplace previews.",
    "Never ask for or store API keys, Notion tokens, OAuth secrets, or private customer data.",
    "Avoid income guarantees, fake testimonials, medical advice, legal advice, and unverifiable claims.",
  ];

  const chatgptPrompt = [
    "You are Packsmith, a template-pack design assistant.",
    summary,
    "",
    "When the user gives a rough idea, respond with:",
    "1. Sellable pack angle",
    "2. Buyer and pain point",
    "3. Template assets to create",
    "4. Notion/Canva/Figma/Instagram design prompts",
    "5. INR price ladder",
    "6. Launch copy for Gumroad, LinkedIn, X, and Instagram",
    "7. Validation checklist",
    "",
    "Rules:",
    ...coreRules.map((rule) => `- ${rule}`),
  ].join("\n");

  const claudeProjectPrompt = [
    "# Packsmith Claude Project Context",
    "",
    summary,
    "",
    "Role: act as a product strategist and template editor. Help the user refine the pack, improve the copy, produce designer-friendly prompts, and prepare marketplace assets.",
    "",
    "Default workflow:",
    "- Ask for the niche only if it is missing.",
    "- Produce a first usable pack in one response.",
    "- Use INR for pricing.",
    "- Keep healthcare and regulated niches operational/marketing-focused, not advisory.",
    "",
    "Guardrails:",
    ...coreRules.map((rule) => `- ${rule}`),
  ].join("\n");

  const figmaCanvaPrompt = [
    `Design assets for ${pack.name}.`,
    `Audience: ${pack.audience || pack.buyer || "template buyers"}.`,
    `Promise: ${pack.promise}.`,
    "Create: marketplace cover, mobile preview, dashboard preview, Instagram carousel, and launch deck.",
    "Style: premium retro-modern, readable first, with clear buyer outcome and real template preview sections.",
    "Do not use placeholder-only cards; show the actual workflow screens and template content.",
  ].join("\n");

  const readme = [
    "# Packsmith Assistant Kit",
    "",
    "This folder turns Packsmith into a repo-friendly skill pack that users can paste into ChatGPT, Claude, Figma, or Canva workflows.",
    "",
    "## What It Does",
    "- Converts rough template ideas into launch-ready pack briefs.",
    "- Creates creator-friendly design prompts instead of technical schemas.",
    "- Keeps secrets out of prompts and browser storage.",
    "- Supports Notion, Canva, Figma, Instagram, Gumroad, LinkedIn, and X launch workflows.",
    "",
    "## Files",
    "- `chatgpt-packsmith-instructions.md`: paste into a custom GPT or ChatGPT project instructions.",
    "- `claude-packsmith-project.md`: paste into a Claude project knowledge/instructions area.",
    "- `figma-canva-handoff.md`: paste into Figma/Canva design generation workflows.",
    "",
    "## Safety",
    ...coreRules.map((rule) => `- ${rule}`),
  ].join("\n");

  return {
    schemaVersion: "2026-07-packsmith-assistant-kit-v1",
    surfaces: assistantSkillSurfaces,
    prompts: {
      chatgptPrompt,
      claudeProjectPrompt,
      figmaCanvaPrompt,
      readme,
    },
    security: {
      containsSecrets: false,
      storesTokens: false,
      requiresUserReviewBeforePublishing: true,
    },
  };
}

export function assistantSkillPackToMarkdown(pack, kit) {
  return [
    `# ${pack.name} Assistant Kit`,
    "",
    "## ChatGPT Instructions",
    kit.prompts.chatgptPrompt,
    "",
    "## Claude Project Prompt",
    kit.prompts.claudeProjectPrompt,
    "",
    "## Figma/Canva Handoff",
    kit.prompts.figmaCanvaPrompt,
    "",
    "## README",
    kit.prompts.readme,
  ].join("\n\n");
}
