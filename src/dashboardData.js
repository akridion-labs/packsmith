export function normalizePackHistory({ localPacks = [], cloudPacks = [] } = {}) {
  const localRows = localPacks.map((pack, index) => ({
    id: pack.savedAt || `local-${index}`,
    name: pack.name || "Untitled Pack",
    presetId: pack.presetId || pack.id || "custom",
    source: "local",
    createdAt: pack.savedAt || pack.createdAt || new Date(0).toISOString(),
    quality: pack.quality?.overall || 0,
    sectionCount: pack.sections?.length || 0,
    channelCount: pack.launchChannels?.length || 0,
    notionReady: Boolean(pack.sections?.some((section) => section.id === "notion")),
    raw: pack,
  }));

  const cloudRows = cloudPacks.map((row) => {
    const pack = row.pack_json || {};
    return {
      id: row.id,
      name: row.name || pack.name || "Untitled Cloud Pack",
      presetId: row.preset_id || pack.presetId || pack.id || "custom",
      source: "cloud",
      createdAt: row.created_at || row.updated_at || new Date(0).toISOString(),
      updatedAt: row.updated_at || row.created_at || null,
      quality: pack.quality?.overall || 0,
      sectionCount: pack.sections?.length || 0,
      channelCount: pack.launchChannels?.length || 0,
      notionReady: Boolean(row.notion_payload_json || pack.sections?.some((section) => section.id === "notion")),
      raw: pack,
      cloudRow: row,
    };
  });

  return [...cloudRows, ...localRows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function buildDashboardMetrics({ history = [], waitlistLeads = [] } = {}) {
  const qualityRows = history.filter((row) => row.quality > 0);
  const averageQuality = qualityRows.length
    ? Math.round(qualityRows.reduce((sum, row) => sum + row.quality, 0) / qualityRows.length)
    : 0;

  return {
    totalPacks: history.length,
    cloudPacks: history.filter((row) => row.source === "cloud").length,
    localPacks: history.filter((row) => row.source === "local").length,
    waitlistLeads: waitlistLeads.length,
    averageQuality,
    notionReady: history.filter((row) => row.notionReady).length,
    launchAssets: history.reduce((sum, row) => sum + row.channelCount, 0),
  };
}

export function buildPackExportChecklist(pack = {}) {
  const hasNotion = Boolean(pack.sections?.some((section) => section.id === "notion"));
  const hasListing = Boolean(pack.listing?.title && pack.listing?.description);
  const hasLaunch = Boolean(pack.launchChannels?.length);
  const hasMarketing = Boolean(pack.launchPlan?.length);

  return [
    {
      id: "markdown",
      label: "Markdown pack export",
      status: pack.name && pack.sections?.length ? "Ready" : "Needs pack output",
      ready: Boolean(pack.name && pack.sections?.length),
    },
    {
      id: "notion",
      label: "Notion publish payload",
      status: hasNotion ? "Ready to simulate" : "Needs Notion section",
      ready: hasNotion,
    },
    {
      id: "marketplace",
      label: "Marketplace listing JSON",
      status: hasListing ? "Listing ready" : "Needs listing copy",
      ready: hasListing,
    },
    {
      id: "launch",
      label: "Launch calendar and posts",
      status: hasLaunch && hasMarketing ? "Launch assets ready" : "Needs channel plan",
      ready: hasLaunch && hasMarketing,
    },
  ];
}

export function buildLaunchTracker(pack = {}) {
  return (pack.launchChannels || []).map((channel) => {
    const isPrimary = channel.priority === "Primary" || channel.id === "gumroad";
    const isWarm = ["linkedin", "x", "reddit"].includes(channel.id);

    return {
      id: channel.id,
      name: channel.name,
      priority: channel.priority,
      status: isPrimary ? "Ready for first push" : isWarm ? "Copy ready" : "Later validation",
      readiness: channel.readiness,
      assetCount: [
        channel.listingTitle,
        channel.description,
        channel.launchPost,
        channel.previewChecklist?.length,
        channel.riskNotes,
      ].filter(Boolean).length,
    };
  });
}
