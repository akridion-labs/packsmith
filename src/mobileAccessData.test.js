import { describe, expect, it } from "vitest";
import {
  buildAssistantHandoffPrompt,
  buildMobileAccessChecklist,
  mobileAccessModes,
  nativeAppDecision,
} from "./mobileAccessData";

describe("mobile access strategy", () => {
  it("covers PWA, tablet, Notion, and assistant access modes", () => {
    expect(mobileAccessModes.map((mode) => mode.id)).toEqual(["pwa", "tablet", "notion", "assistants"]);
    expect(nativeAppDecision.recommendation).toMatch(/PWA/i);
  });

  it("marks cloud and Notion access based on backend readiness", () => {
    const localChecklist = buildMobileAccessChecklist({ hasSupabase: false, hasNotionParent: false });
    const cloudChecklist = buildMobileAccessChecklist({ hasSupabase: true, hasNotionParent: true });

    expect(localChecklist.find((item) => item.id === "cloud-sync").ready).toBe(false);
    expect(localChecklist.find((item) => item.id === "assistant-handoff").ready).toBe(true);
    expect(cloudChecklist.find((item) => item.id === "notion-mobile").ready).toBe(true);
  });

  it("builds a safe assistant handoff prompt", () => {
    const prompt = buildAssistantHandoffPrompt("AI Agency Launch Kit");

    expect(prompt).toContain("AI Agency Launch Kit");
    expect(prompt).toMatch(/medical, legal, or financial advice/i);
    expect(prompt).toMatch(/paste back into Packsmith/i);
  });
});
