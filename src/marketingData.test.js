import { describe, expect, it } from "vitest";
import { buildLaunchKit, getPreset } from "./packsmithData";
import { buildMarketingKit, marketingKitToMarkdown } from "./marketingData";

describe("marketing kit generation", () => {
  it("generates launch assets for the active pack", () => {
    const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
    const kit = buildMarketingKit(pack);

    expect(kit.videoScript).toHaveLength(5);
    expect(kit.productStack.map((item) => item.id)).toEqual([
      "notion",
      "figma",
      "canva",
      "mobile",
      "assistants",
    ]);
    expect(kit.figmaProductLaunches).toHaveLength(3);
    expect(kit.mobileLaunchCampaign.linkedinPost).toContain("Figma product/UI kit");
    expect(kit.mobileLaunchCampaign.xThread).toHaveLength(6);
    expect(kit.mobileLaunchCampaign.shortVideoScript).toHaveLength(5);
    expect(kit.mobileLaunchCampaign.screenshotChecklist).toEqual(
      expect.arrayContaining(["Figma product launch section", "Dashboard saved-pack reopen flow"]),
    );
    expect(kit.emergingSharingStreams.map((item) => item.platform)).toEqual(
      expect.arrayContaining(["Lemon8 / Pinterest", "Loops / Fediverse video"]),
    );
    expect(kit.aiCreativePlatforms.map((item) => item.platform)).toEqual(
      expect.arrayContaining(["Gemini / Nano Banana", "Adobe Firefly / Adobe Express"]),
    );
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
    expect(markdown).toContain("## Product Stack");
    expect(markdown).toContain("## Figma Product Launches");
    expect(markdown).toContain("## Mobile Launch Campaign");
    expect(markdown).toContain("## Emerging Sharing Streams");
    expect(markdown).toContain("## AI Creative Platforms");
    expect(markdown).toContain("## Canva Presentation Outline");
  });
});
