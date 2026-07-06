const sensitiveKeyPattern = /(token|secret|password|api[-_]?key|access[-_]?token|refresh[-_]?token|authorization|credential)/i;

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
