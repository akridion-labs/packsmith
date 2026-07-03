import { describe, expect, it } from "vitest";
import { buildCustomNotionExport, buildCustomPack } from "./localPackGenerator";

const brief = {
  niche: "Podcast creator launch systems",
  buyer: "Independent podcast creators selling templates to sponsors and guests",
  painPoint: "They need a repeatable system for episodes, sponsors, and launch content.",
  promise: "Package the podcast launch workflow into a sellable template pack.",
  assets: "Episode tracker, sponsor CRM, guest outreach board",
  platforms: ["Notion", "Canva"],
  style: "Retro-futuristic forge",
  marketplaceTarget: "Gumroad",
  visualDirection: "Dark console with clear creator workflow previews.",
};

describe("local custom pack generator", () => {
  it("generates a custom pack from a rough brief", () => {
    const pack = buildCustomPack(brief);

    expect(pack.name).toBe("Podcast creator launch Template Launch Kit");
    expect(pack.presetId).toBe("custom");
    expect(pack.launchChannels.map((channel) => channel.id)).toEqual(["gumroad", "linkedin", "x", "reddit"]);
    expect(pack.listing.title).toContain("Podcast creator launch");
  });

  it("filters platform sections to selected platforms", () => {
    const pack = buildCustomPack({ ...brief, platforms: ["Notion"] });

    expect(pack.sections.map((section) => section.id)).toEqual(["notion"]);
  });

  it("falls back to useful default assets when the asset list is empty", () => {
    const pack = buildCustomPack({ ...brief, assets: "" });
    const notionSection = pack.sections.find((section) => section.id === "notion");

    expect(notionSection.items.join(" ")).toContain("dashboard");
    expect(pack.quality.overall).toBeGreaterThan(40);
  });

  it("builds a custom Notion payload with databases and seed records", () => {
    const pack = buildCustomPack(brief);
    const notionExport = buildCustomNotionExport(pack);

    expect(notionExport.workspaceName).toBe(pack.name);
    expect(notionExport.databases.map((database) => database.id)).toEqual([
      "assets",
      "signals",
      "launch_tasks",
    ]);
    expect(notionExport.databases.every((database) => database.sampleRecords.length > 0)).toBe(true);
  });
});
