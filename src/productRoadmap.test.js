import { describe, expect, it } from "vitest";
import { buildFounderPriorityPlan, buildProductWorkQueue, founderPlanToMarkdown } from "./productRoadmap";
import { buildLaunchKit, getPreset } from "./packsmithData";

describe("product roadmap", () => {
  it("builds an actionable product work queue for a pack", () => {
    const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
    const queue = buildProductWorkQueue(pack);

    expect(queue.length).toBeGreaterThanOrEqual(6);
    expect(queue[0]).toMatchObject({
      id: "design-proof",
      priority: "P0",
      defaultDone: true,
    });
    expect(queue.map((item) => item.id)).toEqual(
      expect.arrayContaining(["market-proof", "revenue-proof", "notion-publish", "assistant-beta"]),
    );
    expect(queue.every((item) => item.action && item.successMetric)).toBe(true);
  });

  it("includes the work queue in founder plan markdown", () => {
    const pack = buildLaunchKit(getPreset("saasLaunch").brief, "saasLaunch");
    const plan = buildFounderPriorityPlan(pack);
    const markdown = founderPlanToMarkdown(pack, plan);

    expect(markdown).toContain("Product Work Queue");
    expect(markdown).toContain("Open the Gumroad validation page");
    expect(markdown).toContain("Ship the assistant-kit beta");
  });
});
