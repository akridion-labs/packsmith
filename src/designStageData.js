export const designStageFormats = [
  {
    id: "instagram-carousel",
    label: "Instagram carousel",
    size: "1080 x 1350",
    outcome: "A swipeable education or launch post people can understand without opening a doc.",
    sections: ["Hook", "Problem", "System preview", "Template proof", "Launch CTA"],
  },
  {
    id: "gumroad-cover",
    label: "Gumroad cover",
    size: "1600 x 900",
    outcome: "A marketplace hero image that makes the pack feel packaged and ready to buy.",
    sections: ["Pack name", "Buyer promise", "Included assets", "Price anchor", "Preview strip"],
  },
  {
    id: "notion-dashboard",
    label: "Notion dashboard",
    size: "Responsive workspace",
    outcome: "A clean command center preview for the actual template workspace.",
    sections: ["Home dashboard", "Trackers", "Launch checklist", "Content calendar", "Buyer notes"],
  },
  {
    id: "canva-deck",
    label: "Canva deck",
    size: "16:9 presentation",
    outcome: "A sales deck or walkthrough users can customize without touching design tools deeply.",
    sections: ["Title slide", "Who it helps", "Workflow", "Template pages", "Offer slide"],
  },
  {
    id: "figma-board",
    label: "Figma preview board",
    size: "1440 board",
    outcome: "A designer-friendly board with frames, colors, components, and handoff notes.",
    sections: ["Cover frame", "Landing mock", "Mobile mock", "Component strip", "Export notes"],
  },
];

export const designStageMoods = [
  {
    id: "retro-forge",
    label: "Retro forge",
    direction: "dark console base, amber highlights, green signal states, thin blueprint grid, metal shadows",
    colors: ["#f0bd64", "#42d1a0", "#101719", "#f7f1de"],
  },
  {
    id: "clean-saas",
    label: "Clean SaaS",
    direction: "white workspace, charcoal type, electric blue actions, crisp cards, product screenshot rhythm",
    colors: ["#f7fafc", "#111827", "#2f80ed", "#19b394"],
  },
  {
    id: "creator-pop",
    label: "Creator pop",
    direction: "bold creator gradients, sticker labels, social-first cards, energetic cover typography",
    colors: ["#ff4f9a", "#7c3cff", "#ffe66d", "#101018"],
  },
  {
    id: "clinic-calm",
    label: "Clinic calm",
    direction: "soft teal, deep navy, warm neutral surfaces, trustworthy spacing, no clinical claims",
    colors: ["#2bb3a3", "#112f3a", "#eef7f3", "#f4b56a"],
  },
  {
    id: "bold-launch",
    label: "Bold launch",
    direction: "high-contrast launch poster, large numbers, proof blocks, strong CTA bar, founder energy",
    colors: ["#101014", "#f4d35e", "#ee6352", "#5ad2f4"],
  },
];

export const designStageTones = [
  {
    id: "practical-founder",
    label: "Practical founder",
    copyRule: "Make the promise specific, useful, and validation-focused.",
  },
  {
    id: "friendly-creator",
    label: "Friendly creator",
    copyRule: "Use simple, warm language and avoid technical template jargon.",
  },
  {
    id: "premium-agency",
    label: "Premium agency",
    copyRule: "Make the pack feel client-ready, polished, and worth paying for.",
  },
  {
    id: "direct-sales",
    label: "Direct sales",
    copyRule: "Lead with the buyer pain, outcome, and what is included.",
  },
];

export const defaultDesignStage = {
  formatId: "instagram-carousel",
  moodId: "retro-forge",
  toneId: "friendly-creator",
};

function findOption(options, id) {
  return options.find((option) => option.id === id) || options[0];
}

function firstItems(pack, count = 5) {
  return (pack.sections || [])
    .flatMap((section) => section.items || [])
    .slice(0, count);
}

export function buildDesignStageModel(pack, settings = defaultDesignStage) {
  const format = findOption(designStageFormats, settings.formatId);
  const mood = findOption(designStageMoods, settings.moodId);
  const tone = findOption(designStageTones, settings.toneId);
  const sourceItems = firstItems(pack);
  const cards = format.sections.map((section, index) => ({
    label: section,
    headline:
      index === 0
        ? pack.name
        : sourceItems[index - 1] || `${section} for ${pack.audience || pack.buyer || "the buyer"}`,
    detail:
      index === 0
        ? pack.promise
        : `Show this as a ${format.label.toLowerCase()} moment with ${mood.label.toLowerCase()} styling.`,
  }));

  const prompt = [
    `Create a ${format.label} for ${pack.name}.`,
    `Audience: ${pack.audience || pack.buyer || "template buyers"}.`,
    `Promise: ${pack.promise}.`,
    `Visual style: ${mood.direction}.`,
    `Copy tone: ${tone.copyRule}`,
    `Must include: ${cards.map((card) => card.label).join(", ")}.`,
    "Avoid fake testimonials, inflated earnings claims, and storing any customer secrets.",
  ].join("\n");

  return {
    schemaVersion: "2026-07-packsmith-design-stage-v1",
    format,
    mood,
    tone,
    cards,
    prompt,
    visualDirection: `${mood.label}: ${mood.direction}. ${format.label} sized for ${format.size}. ${tone.copyRule}`,
    security: {
      containsSecrets: false,
      storesTokens: false,
      userEditable: true,
    },
  };
}

export function designStageToMarkdown(pack, model) {
  return [
    `# ${pack.name} Design Brief`,
    "",
    `Format: ${model.format.label}`,
    `Size: ${model.format.size}`,
    `Mood: ${model.mood.label}`,
    `Tone: ${model.tone.label}`,
    "",
    "## Outcome",
    model.format.outcome,
    "",
    "## Visual Direction",
    model.visualDirection,
    "",
    "## Preview Frames",
    ...model.cards.map((card, index) => `${index + 1}. ${card.label}: ${card.headline}`),
    "",
    "## Copy/Paste Prompt",
    model.prompt,
    "",
    "## Safety",
    "- Do not include API keys, personal data, or private customer information.",
    "- Use this as a design brief; the user should review claims before publishing.",
  ].join("\n");
}
