import { describe, expect, it } from "vitest";
import {
  buildLaunchCalendar,
  buildLaunchKit,
  buildNotionExport,
  calculateQualityScore,
  defaultPresetId,
  getPreset,
  nichePresets,
} from "./packsmithData";

describe("packsmith preset engine", () => {
  it("falls back to the default preset for unknown preset ids", () => {
    expect(getPreset("missing").id).toBe(defaultPresetId);
  });

  it("builds complete packs for every niche preset", () => {
    for (const preset of Object.values(nichePresets)) {
      const pack = buildLaunchKit(preset.brief, preset.id);

      expect(pack.name).toBe(preset.name);
      expect(pack.sections.map((section) => section.id)).toEqual(["notion", "canva", "figma"]);
      expect(pack.launchChannels.length).toBeGreaterThanOrEqual(8);
      expect(pack.quality.overall).toBeGreaterThan(70);
      expect(pack.listing.title).toBeTruthy();
    }
  });

  it("keeps healthcare positioning operational instead of clinical", () => {
    const preset = getPreset("healthcareGrowth");
    const pack = buildLaunchKit(preset.brief, preset.id);

    expect(pack.safetyNote).toMatch(/not medical\/legal advice/i);
    expect(pack.promise).toMatch(/operations|workflow|growth/i);
  });

  it("builds preset-specific Notion exports", () => {
    const pack = buildLaunchKit(getPreset("saasLaunch").brief, "saasLaunch");
    const notionExport = buildNotionExport(pack);

    expect(notionExport.workspaceName).toBe("SaaS Launch Kit");
    expect(notionExport.databases.map((database) => database.name)).toEqual(
      expect.arrayContaining(["Customers", "Feedback", "Roadmap", "Launch Tasks", "Metrics"]),
    );
    expect(notionExport.pages.length).toBeGreaterThan(2);
  });

  it("scores stronger briefs higher than sparse briefs", () => {
    const weak = calculateQualityScore({
      buyer: "founders",
      assets: "dashboard",
      marketplaceTarget: "",
      platforms: ["Notion"],
    });
    const strong = calculateQualityScore(getPreset("aiAgency").brief);

    expect(strong.overall).toBeGreaterThan(weak.overall);
    expect(strong.parts.connectorReadiness).toBe(90);
  });

  it("creates a five-day launch calendar", () => {
    const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
    const calendar = buildLaunchCalendar(pack);

    expect(calendar).toHaveLength(5);
    expect(calendar[0].action).toContain(pack.name);
    expect(calendar[3].focus).toBe("Launch");
  });
});
