export const launchAssetStatuses = ["Drafted", "Posted", "Tested", "Converted", "Needs rewrite"];

export function buildLaunchAssetStudioItems(kit) {
  return [
    {
      id: "linkedin",
      label: "LinkedIn post",
      icon: "file",
      content: kit.mobileLaunchCampaign?.linkedinPost || kit.linkedinPost,
      helper: "Founder launch story for the full product stack.",
    },
    {
      id: "x",
      label: "X thread",
      icon: "clipboard",
      content: (kit.mobileLaunchCampaign?.xThread || kit.xThread)
        .map((item, index) => `${index + 1}. ${item}`)
        .join("\n"),
      helper: "Short-form thread for curiosity and validation.",
    },
    {
      id: "video",
      label: "Short video script",
      icon: "play",
      content: (kit.mobileLaunchCampaign?.shortVideoScript || kit.videoScript.map((item) => `${item.time}: ${item.voiceover}`)).join("\n"),
      helper: "60-second demo arc for phone, Figma, dashboard, and exports.",
    },
    {
      id: "screenshots",
      label: "Screenshot checklist",
      icon: "phone",
      content: (kit.mobileLaunchCampaign?.screenshotChecklist || kit.shotList)
        .map((item, index) => `${index + 1}. ${item}`)
        .join("\n"),
      helper: "Exact shots to capture for the launch post and Gumroad page.",
    },
    {
      id: "figma",
      label: "Figma bundle copy",
      icon: "figma",
      content: kit.figmaProductLaunches
        .map((item) => `${item.name}\n${item.buyerPromise}\nMarketplace: ${item.marketplace}`)
        .join("\n\n"),
      helper: "Use this to pitch Figma Community, UI8, or Gumroad bundle upgrades.",
    },
    {
      id: "emerging",
      label: "Emerging sharing streams",
      icon: "trending",
      content: kit.emergingSharingStreams
        .map((item) => `${item.platform}\nFormat: ${item.format}\nAngle: ${item.angle}\nPrompt: ${item.prompt}`)
        .join("\n\n"),
      helper: "TikTok/Reels/Shorts, Threads/Bluesky, Lemon8/Pinterest, Loops, and Reddit-ready angles.",
    },
    {
      id: "ai-platforms",
      label: "AI creative platforms",
      icon: "brain",
      content: kit.aiCreativePlatforms
        .map((item) => `${item.platform}\nUse: ${item.use}\nPrompt: ${item.prompt}`)
        .join("\n\n"),
      helper: "Nano Banana/Gemini, Adobe Firefly, Runway, Canva, CapCut, and avatar-video prompts.",
    },
  ];
}

export function buildInitialLaunchAssetTracking(kit, existing = {}) {
  return Object.fromEntries(
    buildLaunchAssetStudioItems(kit).map((item) => [
      item.id,
      launchAssetStatuses.includes(existing[item.id]) ? existing[item.id] : "Drafted",
    ]),
  );
}

export function buildLaunchAssetTrackingSummary(tracking = {}) {
  const values = Object.values(tracking);
  return {
    total: values.length,
    drafted: values.filter((status) => status === "Drafted").length,
    posted: values.filter((status) => status === "Posted").length,
    tested: values.filter((status) => status === "Tested").length,
    converted: values.filter((status) => status === "Converted").length,
    needsRewrite: values.filter((status) => status === "Needs rewrite").length,
  };
}
