import { describe, expect, it } from "vitest";
import { buildDesignStageModel, designStageToMarkdown } from "./designStageData";
import { buildLaunchKit, getPreset } from "./packsmithData";

describe("design stage data", () => {
  it("builds a creator-friendly design model without secrets", () => {
    const pack = buildLaunchKit(getPreset("instagramCreator").brief, "instagramCreator");
    const model = buildDesignStageModel(pack, {
      formatId: "instagram-carousel",
      moodId: "creator-pop",
      toneId: "friendly-creator",
    });

    expect(model.schemaVersion).toBe("2026-07-packsmith-design-stage-v1");
    expect(model.format.label).toBe("Instagram carousel");
    expect(model.cards.length).toBeGreaterThan(3);
    expect(model.prompt).toContain(pack.name);
    expect(model.security.containsSecrets).toBe(false);
    expect(model.security.storesTokens).toBe(false);
  });

  it("exports a markdown design brief for the active pack", () => {
    const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
    const model = buildDesignStageModel(pack);
    const markdown = designStageToMarkdown(pack, model);

    expect(markdown).toContain(`# ${pack.name} Design Brief`);
    expect(markdown).toContain("Copy/Paste Prompt");
    expect(markdown).toContain("Do not include API keys");
  });
});
