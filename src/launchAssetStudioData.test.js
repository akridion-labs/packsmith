import { describe, expect, it } from "vitest";
import {
  buildInitialLaunchAssetTracking,
  buildLaunchAssetStudioItems,
  buildLaunchAssetTrackingSummary,
  launchAssetStatuses,
} from "./launchAssetStudioData";
import { buildLaunchKit, getPreset } from "./packsmithData";
import { buildMarketingKit } from "./marketingData";

const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
const kit = buildMarketingKit(pack);

describe("launch asset studio data", () => {
  it("builds copyable studio items for classic, emerging, and AI channels", () => {
    const items = buildLaunchAssetStudioItems(kit);

    expect(items.map((item) => item.id)).toEqual([
      "linkedin",
      "x",
      "video",
      "screenshots",
      "figma",
      "emerging",
      "ai-platforms",
    ]);
    expect(items.find((item) => item.id === "figma").content).toContain("Landing Page Kit");
    expect(items.find((item) => item.id === "ai-platforms").content).toContain("Adobe Firefly");
  });

  it("creates safe default tracking states and preserves valid existing states", () => {
    const tracking = buildInitialLaunchAssetTracking(kit, {
      linkedin: "Posted",
      x: "Invalid",
      figma: "Converted",
    });

    expect(launchAssetStatuses).toContain("Needs rewrite");
    expect(tracking.linkedin).toBe("Posted");
    expect(tracking.x).toBe("Drafted");
    expect(tracking.figma).toBe("Converted");
  });

  it("summarizes action tracking for launch progress", () => {
    const summary = buildLaunchAssetTrackingSummary({
      linkedin: "Posted",
      x: "Tested",
      video: "Converted",
      screenshots: "Needs rewrite",
      figma: "Drafted",
    });

    expect(summary).toEqual({
      total: 5,
      drafted: 1,
      posted: 1,
      tested: 1,
      converted: 1,
      needsRewrite: 1,
    });
  });
});
