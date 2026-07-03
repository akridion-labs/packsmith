import { describe, expect, it } from "vitest";
import { buildLaunchKit, buildNotionExport, getPreset } from "../packsmithData";
import { createNotionPayload, simulateNotionPublish } from "./notionConnector";

describe("Notion connector contract", () => {
  const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");
  const notionExport = buildNotionExport(pack);

  it("creates a backend-only publish payload", () => {
    const payload = createNotionPayload(notionExport, { parentPageId: "parent-123" });

    expect(payload.action).toBe("create_packsmith_workspace");
    expect(payload.parentPageId).toBe("parent-123");
    expect(payload.backendContract.path).toBe("/api/notion/publish");
    expect(payload.backendContract.requiredServerSecrets).toEqual(["NOTION_TOKEN"]);
    expect(JSON.stringify(payload)).not.toMatch(/notionToken/);
  });

  it("uses a safe placeholder parent page when none is supplied", () => {
    const payload = createNotionPayload(notionExport);

    expect(payload.parentPageId).toBe("notion-parent-page-id");
    expect(payload.workspace.databases.length).toBeGreaterThan(0);
  });

  it("reports missing parent page during simulation", () => {
    const simulation = simulateNotionPublish(notionExport);

    expect(simulation.status).toBe("missing_parent_page");
    expect(simulation.message).toMatch(/Do not store Notion tokens/i);
  });

  it("reports ready-to-publish simulation with database stats", () => {
    const simulation = simulateNotionPublish(notionExport, { parentPageId: "parent-123" });

    expect(simulation.status).toBe("ready_to_publish");
    expect(simulation.createdPreview.databases[0]).toEqual(
      expect.objectContaining({
        name: "Clients",
        properties: expect.any(Number),
        sampleRecords: expect.any(Number),
      }),
    );
  });
});
