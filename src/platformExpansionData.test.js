import { describe, expect, it } from "vitest";
import {
  buildPlatformExpansionMarkdown,
  buildPlatformExpansionSummary,
  platformExpansionPaths,
} from "./platformExpansionData";

describe("platform expansion data", () => {
  it("prioritizes ChatGPT and Claude in the first wave", () => {
    const summary = buildPlatformExpansionSummary(platformExpansionPaths);

    expect(summary.total).toBeGreaterThanOrEqual(7);
    expect(summary.firstWave).toContain("ChatGPT");
    expect(summary.firstWave).toContain("Claude");
    expect(summary.recommendation).toContain("API/MCP");
  });

  it("keeps every platform path actionable and security-aware", () => {
    platformExpansionPaths.forEach((path) => {
      expect(path.mvpActions.length).toBeGreaterThanOrEqual(3);
      expect(path.dataBoundary.length).toBeGreaterThan(20);
      expect(path.monetization.length).toBeGreaterThan(20);
      expect(path.risk.length).toBeGreaterThan(20);
    });
  });

  it("exports a markdown roadmap", () => {
    const markdown = buildPlatformExpansionMarkdown(platformExpansionPaths);

    expect(markdown).toContain("# Packsmith Platform Expansion Plan");
    expect(markdown).toContain("### ChatGPT");
    expect(markdown).toContain("### Adobe Express");
    expect(markdown).toContain("Security boundary:");
  });
});
