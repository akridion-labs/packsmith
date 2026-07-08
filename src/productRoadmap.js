export const providerOptions = [
  {
    id: "local",
    name: "Local Rules",
    status: "Live now",
    cost: "₹0",
    readiness: 100,
    useCase: "Reliable demos, preset packs, and offline founder workflows.",
    nextStep: "Keep as fallback after real AI is connected.",
  },
  {
    id: "openai",
    name: "OpenAI",
    status: "Provider-ready",
    cost: "Paid API",
    readiness: 64,
    useCase: "Best first path for high-quality pack copy, asset expansion, and structured JSON.",
    nextStep: "Add server route with secret storage and schema validation.",
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    status: "Research path",
    cost: "Depends on credits",
    readiness: 42,
    useCase: "Useful if we later want multimodal generation, agent workflows, or GPU-backed demos.",
    nextStep: "Validate available endpoints and free-credit limits before product dependency.",
  },
  {
    id: "notion",
    name: "Notion API",
    status: "Contract ready",
    cost: "₹0 platform API",
    readiness: 70,
    useCase: "Publish generated workspace payloads into a real Notion parent page.",
    nextStep: "Build backend POST /api/notion/publish and never store tokens in the browser.",
  },
];

export const founderMilestones = [
  {
    id: "beta",
    label: "Beta Trust",
    horizon: "Next 2 days",
    outcome: "Make the app feel credible enough for 10 founder demos.",
    tasks: [
      "Add real AI route behind the current local generator interface",
      "Add export history and reload saved packs into the active workspace",
      "Record a 60-second product walkthrough using the Marketing Kit shot list",
    ],
  },
  {
    id: "paid-pack",
    label: "First Revenue",
    horizon: "This week",
    outcome: "Sell or pre-sell the first AI Agency Launch Kit.",
    tasks: [
      "Create Gumroad product page with eight preview screenshots",
      "Post LinkedIn/X build-in-public launch thread for AI agency freelancers",
      "Offer first 10 buyers a founder setup review for feedback and testimonials",
    ],
  },
  {
    id: "connector",
    label: "Connector Proof",
    horizon: "Next 7-10 days",
    outcome: "Turn Notion from simulation into a real publish path.",
    tasks: [
      "Implement server-only Notion token handling",
      "Validate database creation and page-block rendering with one test workspace",
      "Add publish result screen with created page/database IDs and retryable errors",
    ],
  },
  {
    id: "market",
    label: "Market Expansion",
    horizon: "After first buyers",
    outcome: "Use buyer signal to pick SaaS or Healthcare as the second paid pack.",
    tasks: [
      "Run comparison demos with 5 SaaS founders and 5 healthcare operators",
      "Measure which niche asks for setup help or pays fastest",
      "Convert winning niche into a dedicated landing/product page",
    ],
  },
];

export function buildFounderPriorityPlan(pack) {
  const quality = pack.quality?.overall || 0;
  const primaryChannel = pack.comparison?.bestMarketplace || pack.marketplaceTarget || "Gumroad";
  const fastestChannel = pack.comparison?.fastestChannel || "LinkedIn/X";

  const launchReadiness =
    quality >= 82 ? "Ready for founder demos" : quality >= 70 ? "Needs sharper buyer proof" : "Needs focus";

  return {
    score: Math.round((quality * 0.55) + 32),
    launchReadiness,
    headline: `Next best move: validate ${pack.name} through ${fastestChannel}, then sell on ${primaryChannel}.`,
    focus: [
      {
        label: "Build",
        priority: "P0",
        action: "Wire real AI behind the same generate flow without removing local fallback.",
        reason: "The UI already proves the workflow. Real generation is the next credibility jump.",
      },
      {
        label: "Market",
        priority: "P0",
        action: `Publish one concrete before/after demo for ${pack.audience}.`,
        reason: "Screenshots and use-case proof beat broad template claims.",
      },
      {
        label: "Revenue",
        priority: "P1",
        action: `Create a ${primaryChannel} preorder page with launch pricing and setup-review bonus.`,
        reason: "Early money is the fastest signal that this is not just a nice internal tool.",
      },
      {
        label: "Connector",
        priority: "P1",
        action: "Ship Notion publish behind a backend route after the first demo feedback.",
        reason: "Useful, but less urgent than proving people want the generated pack.",
      },
    ],
    experiments: [
      {
        name: "Concierge Pack Build",
        price: "₹8,499-₹24,999",
        buyer: pack.audience,
        offer: "Generate the pack in Packsmith, then manually polish and deliver the buyer's first version.",
      },
      {
        name: "Launch Kit Preorder",
        price: pack.suggestedPrice,
        buyer: pack.audience,
        offer: `Sell ${pack.name} with setup-review bonus for the first 10 buyers.`,
      },
      {
        name: "Creator OS Subscription",
        price: "₹1,499-₹3,999/mo",
        buyer: "Repeat template sellers and freelancers",
        offer: "Monthly access to new preset engines, launch boards, and connector exports.",
      },
    ],
  };
}

export function founderPlanToMarkdown(pack, priorityPlan) {
  return `# Packsmith Founder Priority Plan

Active pack: ${pack.name}
Buyer: ${pack.audience}
Readiness: ${priorityPlan.launchReadiness}
Score: ${priorityPlan.score}/100

## Next Best Move
${priorityPlan.headline}

## Priorities
${priorityPlan.focus
  .map((item) => `### ${item.priority} ${item.label}\nAction: ${item.action}\n\nWhy: ${item.reason}`)
  .join("\n\n")}

## Revenue Experiments
${priorityPlan.experiments
  .map((item) => `### ${item.name}\nPrice: ${item.price}\nBuyer: ${item.buyer}\n\n${item.offer}`)
  .join("\n\n")}

## Milestones
${founderMilestones
  .map((milestone) => `### ${milestone.label} (${milestone.horizon})\nOutcome: ${milestone.outcome}\n\n${milestone.tasks.map((task) => `- ${task}`).join("\n")}`)
  .join("\n\n")}

## Provider Readiness
${providerOptions
  .map((provider) => `- ${provider.name}: ${provider.status} (${provider.readiness}/100) - ${provider.nextStep}`)
  .join("\n")}
`;
}
