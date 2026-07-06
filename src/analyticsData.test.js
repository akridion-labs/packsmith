import { describe, expect, it } from "vitest";
import {
  appendAnalyticsEvent,
  buildAnalyticsEvent,
  sanitizeAnalyticsMetadata,
  summarizeAnalyticsEvents,
} from "./analyticsData";

describe("analytics data helpers", () => {
  it("removes secrets and tokens from event metadata", () => {
    const metadata = sanitizeAnalyticsMetadata({
      pack: "AI Agency Launch Kit",
      notionToken: "secret",
      nested: {
        apiKey: "hidden",
        channel: "gumroad",
      },
    });

    expect(metadata.pack).toBe("AI Agency Launch Kit");
    expect(metadata.notionToken).toBeUndefined();
    expect(metadata.nested.apiKey).toBeUndefined();
    expect(metadata.nested.channel).toBe("gumroad");
  });

  it("builds and appends newest-first events with a limit", () => {
    const first = buildAnalyticsEvent("viewed_launch_page", { page: "/launch" }, new Date("2026-07-06T00:00:00.000Z"));
    const second = buildAnalyticsEvent("exported_figma_json", { pack: "AI Agency" }, new Date("2026-07-06T00:01:00.000Z"));
    const events = appendAnalyticsEvent(appendAnalyticsEvent([], first), second, 2);

    expect(events.map((event) => event.type)).toEqual(["exported_figma_json", "viewed_launch_page"]);
    expect(events[0].metadata.pack).toBe("AI Agency");
  });

  it("summarizes traction event categories", () => {
    const events = [
      { type: "viewed_launch_page" },
      { type: "viewed_ai_agency_product_page" },
      { type: "copied_launch_asset" },
      { type: "exported_figma_json" },
      { type: "saved_pack_local" },
      { type: "reopened_saved_pack" },
      { type: "gumroad_cta_clicked" },
    ];

    expect(summarizeAnalyticsEvents(events)).toEqual({
      total: 7,
      pageViews: 2,
      copies: 1,
      exports: 1,
      saves: 1,
      reopens: 1,
      ctaClicks: 1,
    });
  });
});
