import { describe, expect, it } from "vitest";
import { buildFigmaExportSchema } from "./figmaExport";
import { buildMarketingKit } from "./marketingData";
import { buildLaunchKit, getPreset } from "./packsmithData";

describe("figma export schema", () => {
  it("builds a Figma-ready product kit export without credentials", () => {
    const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
    const kit = buildMarketingKit(pack);
    const exportSchema = buildFigmaExportSchema(pack, kit);

    expect(exportSchema.schemaVersion).toBe("2026-07-packsmith-figma-export-v1");
    expect(exportSchema.security.containsSecrets).toBe(false);
    expect(exportSchema.security.storesTokens).toBe(false);
    expect(exportSchema.frames.map((frame) => frame.id)).toEqual(
      expect.arrayContaining([
        "landing-page-kit",
        "dashboard-ui-kit",
        "marketplace-preview-kit",
        "mobile-preview-kit",
      ]),
    );
    expect(exportSchema.designSystem.colorTokens.map((token) => token.name)).toContain("forgeGold");
    expect(JSON.stringify(exportSchema)).not.toContain("access_token");
  });

  it("includes active pack Figma source items and product launches", () => {
    const pack = buildLaunchKit(getPreset("saasLaunch").brief, "saasLaunch");
    const kit = buildMarketingKit(pack);
    const exportSchema = buildFigmaExportSchema(pack, kit);

    expect(exportSchema.pack.name).toBe(pack.name);
    expect(exportSchema.sourceItems.length).toBeGreaterThan(0);
    expect(exportSchema.productLaunches).toHaveLength(3);
    expect(exportSchema.handoffChecklist).toContain("Create color variables before components");
  });
});
