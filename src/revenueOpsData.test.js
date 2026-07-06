import { describe, expect, it } from "vitest";
import { buildGumroadCheckoutPlan, buildGumroadListingMarkdown } from "./revenueOpsData";

const pack = {
  name: "AI Agency Launch Kit",
  sections: [
    {
      label: "Notion OS",
      summary: "Client CRM and delivery dashboard",
      items: ["Lead tracker", "Project tracker", "Client notes"],
    },
  ],
};

const pricing = [
  { name: "Launch", price: "$29", promise: "Core workspace" },
  { name: "Commercial", price: "$149", promise: "Client-use license" },
];

const kit = {
  productStack: [
    {
      platform: "Figma",
      product: "Launch page frames",
    },
  ],
};

describe("revenue ops data", () => {
  it("builds a Gumroad checkout plan with pricing, license, and refund terms", () => {
    const plan = buildGumroadCheckoutPlan({
      pack,
      pricing,
      kit,
      checkoutUrl: "https://packsmith.gumroad.com/l/ai-agency",
    });

    expect(plan.productName).toBe("AI Agency Launch Kit");
    expect(plan.pricingTiers).toHaveLength(2);
    expect(plan.pricingTiers[0].checkoutUrl).toBe("https://packsmith.gumroad.com/l/ai-agency");
    expect(plan.deliverables).toContain("Figma: Launch page frames");
    expect(plan.license.prohibited).toContain("redistribute");
    expect(plan.refundPolicy.window).toBe("7 days");
  });

  it("exports Gumroad listing markdown with buyer-facing sections", () => {
    const markdown = buildGumroadListingMarkdown(
      buildGumroadCheckoutPlan({
        pack,
        pricing,
        kit,
      }),
    );

    expect(markdown).toContain("# AI Agency Launch Kit for automation freelancers");
    expect(markdown).toContain("## What Is Included");
    expect(markdown).toContain("## License");
    expect(markdown).toContain("## Refund Policy");
    expect(markdown).toContain("## Setup Checklist");
  });
});
