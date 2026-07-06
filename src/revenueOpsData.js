export function buildGumroadCheckoutPlan({ pack, pricing = [], kit = {}, checkoutUrl = "" }) {
  const productStack = kit.productStack || [];
  const sectionHighlights = (pack.sections || []).slice(0, 5).map((section) => ({
    label: section.label,
    summary: section.summary,
    items: (section.items || []).slice(0, 3),
  }));

  return {
    productName: pack.name || "AI Agency Launch Kit",
    checkoutUrl,
    title: `${pack.name || "AI Agency Launch Kit"} for automation freelancers`,
    subtitle: "Notion OS, Figma product surfaces, Canva launch assets, and sales copy in one launch-ready bundle.",
    shortDescription:
      "A paid template-pack system for AI agency freelancers who need a polished client pipeline, offer assets, and launch materials without starting from a blank page.",
    gumroadDescription: [
      "Turn a rough AI agency idea into a sellable operating system.",
      "This kit gives automation freelancers a practical starting point for tracking leads, packaging offers, presenting services, and launching with better proof.",
      "It is built for operators who want an editable workflow system, not another static PDF.",
    ],
    targetBuyer: "AI automation freelancers, solo agency founders, and service operators building productized AI offers.",
    deliverables: [
      ...productStack.map((item) => `${item.platform}: ${item.product}`),
      ...sectionHighlights.map((section) => `${section.label}: ${section.summary}`),
    ].slice(0, 10),
    pricingTiers: pricing.map((tier) => ({
      ...tier,
      checkoutUrl,
      ctaLabel: checkoutUrl ? `Open ${tier.name} checkout` : "Gumroad URL pending",
    })),
    previewAssetChecklist: [
      "Hero screenshot showing the AI Agency dashboard outcome.",
      "Notion CRM database preview with safe sample records.",
      "Figma launch page and dashboard frame preview.",
      "Canva carousel or pitch deck cover mockup.",
      "Mobile handoff screenshot for Notion, Claude, or ChatGPT workflow.",
      "Pricing ladder screenshot with Launch, Premium, and Commercial tiers.",
    ],
    license: {
      personal:
        "Buyer may use and customize the templates for their own business, internal workflows, and client acquisition.",
      commercial:
        "Commercial tier buyers may adapt the system for client delivery, provided they do not resell the unchanged Packsmith source files as a competing template product.",
      prohibited:
        "Do not redistribute the original files, publish them as a free clone, use them for spam, or imply Packsmith provides legal, medical, financial, or platform-specific compliance advice.",
      support:
        "Launch buyers receive access to product updates for this kit during the MVP beta. Setup-review bonus applies only while explicitly offered on the product page.",
    },
    refundPolicy: {
      window: "7 days",
      terms:
        "Refunds are available if the buyer cannot access the delivered files or the product materially differs from the listing. Refunds are not intended for completed downloads that were successfully copied into a live workspace.",
      supportContact: "Use the email/contact method shown on the Gumroad product receipt during the beta.",
    },
    faq: [
      {
        question: "Is this a real AI agency business in a box?",
        answer:
          "No. It is a template and launch asset system. The buyer still needs their own offer, client work, positioning, and delivery quality.",
      },
      {
        question: "Can buyers edit everything?",
        answer:
          "Yes. The kit is designed around editable Notion, Figma, Canva, and marketing-copy outputs.",
      },
      {
        question: "Does it include live API integrations?",
        answer:
          "The current MVP is template and export-first. Live connector publishing is prepared separately through Packsmith's backend roadmap.",
      },
    ],
    setupChecklist: [
      "Create Gumroad product with three variants: Launch, Premium, Commercial.",
      "Paste listing copy and upload preview images.",
      "Attach Notion/Figma/Canva delivery instructions or exported files.",
      "Add license and refund policy blocks.",
      "Connect the CTA URL through VITE_GUMROAD_AI_AGENCY_URL.",
      "Run one test purchase before public launch.",
    ],
    seoKeywords: [
      "AI agency template",
      "Notion CRM for AI agency",
      "AI automation freelancer kit",
      "Figma UI kit for agency launch",
      "Canva launch templates for freelancers",
      "Gumroad template pack",
    ],
  };
}

export function buildGumroadListingMarkdown(plan) {
  const lines = [
    `# ${plan.title}`,
    "",
    plan.subtitle,
    "",
    "## Short Description",
    plan.shortDescription,
    "",
    "## Product Description",
    ...plan.gumroadDescription.map((paragraph) => `${paragraph}`),
    "",
    "## Who It Is For",
    plan.targetBuyer,
    "",
    "## What Is Included",
    ...plan.deliverables.map((item) => `- ${item}`),
    "",
    "## Pricing",
    ...plan.pricingTiers.map((tier) => `- ${tier.name} ${tier.price}: ${tier.promise}`),
    "",
    "## Preview Image Checklist",
    ...plan.previewAssetChecklist.map((item) => `- ${item}`),
    "",
    "## License",
    `Personal: ${plan.license.personal}`,
    `Commercial: ${plan.license.commercial}`,
    `Not allowed: ${plan.license.prohibited}`,
    "",
    "## Refund Policy",
    `${plan.refundPolicy.window}: ${plan.refundPolicy.terms}`,
    "",
    "## FAQ",
    ...plan.faq.flatMap((item) => [`### ${item.question}`, item.answer, ""]),
    "## Setup Checklist",
    ...plan.setupChecklist.map((item) => `- ${item}`),
    "",
    "## SEO Keywords",
    plan.seoKeywords.join(", "),
  ];

  return lines.join("\n");
}
