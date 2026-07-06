import { describe, expect, it } from "vitest";
import {
  appendAnalyticsEvent,
  buildCloudAnalyticsPayload,
  buildPricingExperiment,
  buildRevenueFunnel,
  buildAnalyticsEvent,
  normalizeCloudAnalyticsRow,
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

  it("builds a sanitized cloud analytics payload", () => {
    const event = buildAnalyticsEvent(
      "viewed_launch_page",
      { page: "/launch", notionToken: "hidden", nested: { apiKey: "hidden", tier: "Premium" } },
      new Date("2026-07-06T00:00:00.000Z"),
    );

    const payload = buildCloudAnalyticsPayload(event, {
      userId: "user-123",
      anonymousId: "anon-456",
    });

    expect(payload).toEqual({
      user_id: "user-123",
      anonymous_id: "anon-456",
      event_type: "viewed_launch_page",
      page: "/launch",
      metadata_json: {
        page: "/launch",
        nested: { tier: "Premium" },
      },
      created_at: "2026-07-06T00:00:00.000Z",
    });
  });

  it("normalizes cloud analytics rows into local event shape", () => {
    const event = normalizeCloudAnalyticsRow({
      id: "event-1",
      event_type: "gumroad_cta_clicked",
      metadata_json: { tier: "Commercial", secret: "hidden" },
      created_at: "2026-07-06T00:00:00.000Z",
    });

    expect(event).toEqual({
      id: "event-1",
      type: "gumroad_cta_clicked",
      metadata: { tier: "Commercial" },
      createdAt: "2026-07-06T00:00:00.000Z",
    });
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

  it("builds revenue funnel conversion percentages", () => {
    const events = [
      { type: "viewed_home_page" },
      { type: "viewed_home_page" },
      { type: "viewed_launch_page" },
      { type: "viewed_ai_agency_product_page" },
      { type: "gumroad_cta_clicked" },
      { type: "submitted_ai_agency_waitlist" },
    ];

    const funnel = buildRevenueFunnel(events);

    expect(funnel.map((stage) => [stage.id, stage.count, stage.conversionFromPrevious])).toEqual([
      ["home", 2, 100],
      ["launch", 1, 50],
      ["product", 1, 100],
      ["cta", 1, 100],
      ["lead", 1, 100],
      ["export", 0, 0],
    ]);
  });

  it("builds pricing experiment intent and recommends the strongest tier", () => {
    const tiers = [
      { name: "Launch", price: "$29", promise: "Starter pack" },
      { name: "Premium", price: "$79", promise: "Best bundle" },
      { name: "Commercial", price: "$149", promise: "Client license" },
    ];
    const events = [
      { type: "gumroad_cta_clicked", metadata: { tier: "Premium" }, createdAt: "2026-07-06T00:00:00.000Z" },
      { type: "gumroad_cta_clicked", metadata: { tier: "Commercial" }, createdAt: "2026-07-06T00:01:00.000Z" },
      { type: "gumroad_cta_clicked", metadata: { tier: "Commercial" }, createdAt: "2026-07-06T00:02:00.000Z" },
    ];

    const experiment = buildPricingExperiment(events, tiers);

    expect(experiment.totalClicks).toBe(3);
    expect(experiment.tiers.map((tier) => [tier.name, tier.clicks, tier.share])).toEqual([
      ["Launch", 0, 0],
      ["Premium", 1, 33],
      ["Commercial", 2, 67],
    ]);
    expect(experiment.recommendedTier.name).toBe("Commercial");
  });
});
