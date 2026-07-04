import { describe, expect, it } from "vitest";
import {
  buildDashboardMetrics,
  buildLaunchTracker,
  buildPackExportChecklist,
  createForgeResumePayload,
  normalizePackHistory,
  packToEditableBrief,
} from "./dashboardData";
import { buildLaunchKit, getPreset } from "./packsmithData";

const pack = buildLaunchKit(getPreset("aiAgency").brief, "aiAgency");

describe("dashboard history helpers", () => {
  it("normalizes local and cloud saved packs into newest-first history", () => {
    const history = normalizePackHistory({
      localPacks: [{ ...pack, savedAt: "2026-07-01T10:00:00.000Z" }],
      cloudPacks: [
        {
          id: "cloud-1",
          name: "Cloud Pack",
          preset_id: "aiAgency",
          pack_json: { ...pack, name: "Cloud Pack" },
          notion_payload_json: { workspace: { name: "Cloud Pack" } },
          created_at: "2026-07-02T10:00:00.000Z",
        },
      ],
    });

    expect(history).toHaveLength(2);
    expect(history[0].source).toBe("cloud");
    expect(history[0].notionReady).toBe(true);
    expect(history[1].source).toBe("local");
  });

  it("builds founder dashboard metrics from history and waitlist leads", () => {
    const history = normalizePackHistory({
      localPacks: [{ ...pack, savedAt: "2026-07-01T10:00:00.000Z" }],
    });
    const metrics = buildDashboardMetrics({
      history,
      waitlistLeads: [{ email: "founder@example.com" }, { email: "builder@example.com" }],
    });

    expect(metrics.totalPacks).toBe(1);
    expect(metrics.localPacks).toBe(1);
    expect(metrics.waitlistLeads).toBe(2);
    expect(metrics.averageQuality).toBe(pack.quality.overall);
    expect(metrics.launchAssets).toBe(pack.launchChannels.length);
  });

  it("marks export checklist items ready when a pack has full launch outputs", () => {
    const checklist = buildPackExportChecklist(pack);

    expect(checklist).toHaveLength(4);
    expect(checklist.every((item) => item.ready)).toBe(true);
  });

  it("turns launch channels into trackable action statuses", () => {
    const tracker = buildLaunchTracker(pack);

    expect(tracker[0].name).toBe("Gumroad");
    expect(tracker[0].status).toBe("Ready for first push");
    expect(tracker.every((channel) => channel.assetCount >= 4)).toBe(true);
  });

  it("derives an editable brief for older saved packs", () => {
    const brief = packToEditableBrief(pack);

    expect(brief.buyer).toBe(pack.buyer);
    expect(brief.promise).toBe(pack.promise);
    expect(brief.marketplaceTarget).toBe(pack.marketplaceTarget);
  });

  it("creates a forge resume payload without requiring URL data or sensitive fields", () => {
    const history = normalizePackHistory({
      localPacks: [
        {
          ...pack,
          notionToken: "should-not-survive",
          savedAt: "2026-07-01T10:00:00.000Z",
        },
      ],
    });
    const payload = createForgeResumePayload(history[0]);

    expect(payload.version).toBe("2026-07-dashboard-resume-v1");
    expect(payload.presetId).toBe("aiAgency");
    expect(payload.pack.name).toBe(pack.name);
    expect(payload.brief.buyer).toBe(pack.buyer);
    expect(payload.pack.notionToken).toBeUndefined();
    expect(payload.pack.sections[2].items.join(" ")).toMatch(/Design tokens/i);
  });
});
