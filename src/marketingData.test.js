import { describe, expect, it } from "vitest";
import { buildLaunchKit, getPreset } from "./packsmithData";
import { buildMarketingKit, marketingKitToMarkdown } from "./marketingData";

describe("marketing kit generation", () => {
  it("generates launch assets for the active pack", () => {
    const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
    const kit = buildMarketingKit(pack);

    expect(kit.videoScript).toHaveLength(5);
    expect(kit.linkedinPost).toContain("Packsmith");
    expect(kit.xThread.length).toBeGreaterThanOrEqual(5);
    expect(kit.runwayPrompts.every((prompt) => prompt.length > 20)).toBe(true);
    expect(kit.canvaOutline.some((slide) => slide.includes(pack.name))).toBe(true);
  });

  it("exports marketing kit as readable markdown", () => {
    const pack = buildLaunchKit(getPreset("saasLaunch").brief, "saasLaunch");
    const kit = buildMarketingKit(pack);
    const markdown = marketingKitToMarkdown(pack, kit);

    expect(markdown).toContain(`# ${pack.name} Marketing Kit`);
    expect(markdown).toContain("## 60-Second Demo Script");
    expect(markdown).toContain("## X Thread");
    expect(markdown).toContain("## Canva Presentation Outline");
  });
});
