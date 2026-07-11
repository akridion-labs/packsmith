import { describe, expect, it } from "vitest";
import { assistantSkillPackToMarkdown, buildAssistantSkillPack } from "./assistantSkillData";
import { buildLaunchKit, getPreset } from "./packsmithData";

describe("assistant skill data", () => {
  it("creates ChatGPT, Claude, Figma, and Canva handoff prompts", () => {
    const pack = buildLaunchKit(getPreset("saasLaunch").brief, "saasLaunch");
    const kit = buildAssistantSkillPack(pack);

    expect(kit.schemaVersion).toBe("2026-07-packsmith-assistant-kit-v1");
    expect(kit.surfaces.map((surface) => surface.id)).toEqual(
      expect.arrayContaining(["chatgpt", "claude", "figma", "canva"]),
    );
    expect(kit.prompts.chatgptPrompt).toContain(pack.name);
    expect(kit.prompts.claudeProjectPrompt).toContain("INR");
    expect(kit.prompts.figmaCanvaPrompt).toContain("Create");
    expect(kit.security.containsSecrets).toBe(false);
    expect(kit.security.storesTokens).toBe(false);
  });

  it("exports a single markdown assistant kit", () => {
    const pack = buildLaunchKit(getPreset("healthcareGrowth").brief, "healthcareGrowth");
    const kit = buildAssistantSkillPack(pack);
    const markdown = assistantSkillPackToMarkdown(pack, kit);

    expect(markdown).toContain("ChatGPT Instructions");
    expect(markdown).toContain("Claude Project Prompt");
    expect(markdown).toContain("Figma/Canva Handoff");
    expect(markdown).toContain("medical advice");
  });
});
