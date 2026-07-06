const sensitiveKeyPattern = /(token|secret|password|api[-_]?key|access[-_]?token|refresh[-_]?token|authorization|credential)/i;

const defaultRevenueFunnelStages = [
  {
    id: "home",
    label: "Homepage",
    eventTypes: ["viewed_home_page"],
  },
  {
    id: "launch",
    label: "Launch page",
    eventTypes: ["viewed_launch_page"],
  },
  {
    id: "product",
    label: "AI kit page",
    eventTypes: ["viewed_ai_agency_product_page"],
  },
  {
    id: "cta",
    label: "Gumroad intent",
    eventTypes: ["gumroad_cta_clicked"],
  },
  {
    id: "lead",
    label: "Buyer lead",
    eventTypes: ["submitted_ai_agency_waitlist", "submitted_ai_agency_waitlist_local_fallback"],
  },
  {
    id: "export",
    label: "Revenue brief",
    eventTypes: ["exported_ai_agency_revenue_brief"],
  },
];

export function sanitizeAnalyticsMetadata(value) {
  if (Array.isArray(value)) return value.map(sanitizeAnalyticsMetadata);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !sensitiveKeyPattern.test(key))
      .map(([key, childValue]) => [key, sanitizeAnalyticsMetadata(childValue)]),
  );
}

export function buildAnalyticsEvent(type, metadata = {}, now = new Date()) {
  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    metadata: sanitizeAnalyticsMetadata(metadata),
    createdAt: now.toISOString(),
  };
}

export function buildCloudAnalyticsPayload(event, { userId = null, anonymousId = "", page = "" } = {}) {
  const metadata = sanitizeAnalyticsMetadata(event.metadata || {});
  return {
    user_id: userId || null,
    anonymous_id: anonymousId || "anonymous",
    event_type: event.type,
    page: page || metadata.page || null,
    metadata_json: metadata,
    created_at: event.createdAt || new Date().toISOString(),
  };
}

export function normalizeCloudAnalyticsRow(row = {}) {
  return {
    id: row.id,
    type: row.event_type,
    metadata: sanitizeAnalyticsMetadata(row.metadata_json || {}),
    createdAt: row.created_at,
  };
}

export function appendAnalyticsEvent(events = [], event, limit = 250) {
  return [event, ...events].slice(0, limit);
}

export function summarizeAnalyticsEvents(events = []) {
  const countType = (matcher) => events.filter((event) => matcher(event.type)).length;

  return {
    total: events.length,
    pageViews: countType((type) => type.startsWith("viewed_")),
    copies: countType((type) => type.startsWith("copied_")),
    exports: countType((type) => type.startsWith("exported_")),
    saves: countType((type) => type === "saved_pack_local" || type === "saved_pack_cloud"),
    reopens: countType((type) => type === "reopened_saved_pack"),
    ctaClicks: countType((type) => type.endsWith("_cta_clicked")),
  };
}

function percentage(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function buildRevenueFunnel(events = [], stages = defaultRevenueFunnelStages) {
  return stages.map((stage, index) => {
    const count = events.filter((event) => stage.eventTypes.includes(event.type)).length;
    const previousStage = index > 0 ? stages[index - 1] : null;
    const previousCount = previousStage
      ? events.filter((event) => previousStage.eventTypes.includes(event.type)).length
      : count;
    const firstCount = events.filter((event) => stages[0].eventTypes.includes(event.type)).length;

    return {
      ...stage,
      count,
      conversionFromPrevious: index === 0 ? 100 : percentage(count, previousCount),
      conversionFromStart: index === 0 ? 100 : percentage(count, firstCount),
    };
  });
}

export function buildPricingExperiment(events = [], tiers = []) {
  const pricingEvents = events.filter((event) => event.type === "gumroad_cta_clicked");
  const totalClicks = pricingEvents.length;
  const tierRows = tiers.map((tier) => {
    const tierClicks = pricingEvents.filter((event) => event.metadata?.tier === tier.name);
    const latestClick = tierClicks
      .map((event) => event.createdAt)
      .filter(Boolean)
      .sort()
      .at(-1);

    return {
      name: tier.name,
      price: tier.price,
      promise: tier.promise,
      clicks: tierClicks.length,
      share: percentage(tierClicks.length, totalClicks),
      lastClickedAt: latestClick || null,
    };
  });
  const recommendedTier = tierRows.reduce(
    (winner, tier) => {
      if (tier.clicks > winner.clicks) return tier;
      if (tier.clicks === winner.clicks && tier.clicks > 0) {
        const winnerPrice = Number(String(winner.price || "").replace(/[^0-9.]/g, "")) || 0;
        const tierPrice = Number(String(tier.price || "").replace(/[^0-9.]/g, "")) || 0;
        return tierPrice > winnerPrice ? tier : winner;
      }
      return winner;
    },
    { name: "Collect more clicks", price: "--", clicks: 0, share: 0 },
  );

  return {
    totalClicks,
    tiers: tierRows,
    recommendedTier,
  };
}
