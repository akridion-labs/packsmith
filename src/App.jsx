import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  Clock3,
  Cpu,
  Database,
  Download,
  Edit3,
  ExternalLink,
  Figma,
  FileText,
  FileJson,
  Flame,
  Gauge,
  History,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  PenTool,
  Play,
  Rocket,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  Target,
  TrendingUp,
  Trash2,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  appendAnalyticsEvent,
  buildPricingExperiment,
  buildRevenueFunnel,
  buildAnalyticsEvent,
  summarizeAnalyticsEvents,
} from "./analyticsData";
import { buildApiConsoleModel } from "./apiConsoleData";
import { buildAssistantSkillPack, assistantSkillPackToMarkdown } from "./assistantSkillData";
import {
  buildDashboardMetrics,
  buildLaunchTracker,
  buildPackExportChecklist,
  createForgeResumePayload,
  normalizePackHistory,
} from "./dashboardData";
import {
  buildDesignStageModel,
  defaultDesignStage,
  designStageFormats,
  designStageMoods,
  designStageToMarkdown,
  designStageTones,
} from "./designStageData";
import { buildFigmaExportSchema } from "./figmaExport";
import { createNotionPayload, simulateNotionPublish } from "./integrations/notionConnector";
import {
  buildInitialLaunchAssetTracking,
  buildLaunchAssetStudioItems,
  buildLaunchAssetTrackingSummary,
  launchAssetStatuses,
} from "./launchAssetStudioData";
import {
  getCurrentSession,
  isSupabaseConfigured,
  listAnalyticsEvents,
  listTemplatePacks,
  onAuthStateChange,
  publishNotionWorkspace,
  saveAnalyticsEvent,
  saveTemplatePack,
  saveWaitlistLead,
  signInWithProvider,
  signOut,
  upsertProfile,
} from "./integrations/supabaseClient";
import { buildCustomNotionExport, buildCustomPack } from "./localPackGenerator";
import { buildMarketingKit, marketingKitToMarkdown } from "./marketingData";
import {
  buildAssistantHandoffPrompt,
  buildMobileAccessChecklist,
  mobileAccessModes,
  nativeAppDecision,
} from "./mobileAccessData";
import {
  buildFounderPriorityPlan,
  buildProductWorkQueue,
  founderMilestones,
  founderPlanToMarkdown,
  providerOptions,
} from "./productRoadmap";
import {
  buildPlatformExpansionMarkdown,
  buildPlatformExpansionSummary,
  platformExpansionPaths,
} from "./platformExpansionData";
import {
  backendContract,
  buildLaunchCalendar,
  buildLaunchKit,
  buildNotionExport,
  connectorRoadmap,
  defaultPresetId,
  getPreset,
  nichePresets,
  pipelineStages,
  platformOptions,
} from "./packsmithData";
import { buildPackCoverSvg } from "./packCoverGenerator";
import { buildGumroadCheckoutPlan, buildGumroadListingMarkdown } from "./revenueOpsData";

const sectionIcons = {
  notion: Database,
  canva: PenTool,
  figma: Figma,
};

const platformIds = {
  Notion: "notion",
  Canva: "canva",
  Figma: "figma",
};

const initialCustomBrief = {
  niche: "Premium creator operations",
  buyer: "Solo creators turning services, systems, or expertise into digital template products",
  painPoint:
    "They have a useful idea but struggle to package it into platform-ready assets, launch copy, and a credible product page.",
  promise:
    "Generate a launch-ready template pack blueprint from one rough product idea without using an external AI API.",
  assets: "Command dashboard, content pack, UI starter, launch board, marketplace listing",
  platforms: platformOptions,
  style: "Retro-futuristic forge",
  marketplaceTarget: "Gumroad",
  visualDirection: "Dark command center, blueprint grid, amber/green terminal accents, launch-console cards.",
};

const landingStats = [
  ["4", "sellable niche presets"],
  ["5", "export paths"],
  ["60s", "demo script included"],
];

const landingLiveSignals = [
  "Generating INR-ready price ladder",
  "Rendering mobile pack preview",
  "Preparing workspace pages",
  "Building Instagram templates",
];

const landingProof = [
  {
    icon: Sparkles,
    label: "From rough idea",
    title: "No blank-page start",
    text: "Begin with a niche, buyer, pain point, and asset list. Packsmith turns it into a complete product direction.",
  },
  {
    icon: Layers3,
    label: "To platform assets",
    title: "Notion, Canva, Figma",
    text: "Generate workspace pages, visual template ideas, marketplace listing, and launch calendar in one flow.",
  },
  {
    icon: Target,
    label: "To first sale",
    title: "Launch board built in",
    text: "Get Gumroad copy, LinkedIn/X posts, preview checklist, pricing ladder, and risk notes for each niche.",
  },
];

const heavyLiftPromises = [
  {
    icon: Brain,
    label: "Positioning",
    title: "We turn a rough idea into a clear buyer promise.",
    text: "Packsmith helps choose the niche, buyer, pain point, offer angle, included assets, and INR price ladder before the user starts designing.",
  },
  {
    icon: Wand2,
    label: "Creation",
    title: "We create the first pack shape for them.",
    text: "Workspace pages, social templates, preview screens, listing copy, launch calendar, cover image, and video prompts are generated as one product bundle.",
  },
  {
    icon: TrendingUp,
    label: "Validation",
    title: "We give them launch proof, not just files.",
    text: "Every pack includes channels, posts, risk notes, preview checklist, and pricing tests so creators can validate demand before overbuilding.",
  },
];

const validationLoop = [
  {
    step: "01",
    title: "Bring the idea",
    detail: "One line is enough: niche, buyer, pain, or even a messy Instagram/template idea.",
  },
  {
    step: "02",
    title: "Packsmith builds the first version",
    detail: "The app shapes the template pack, product visuals, launch assets, and INR pricing ladder.",
  },
  {
    step: "03",
    title: "User validates in the market",
    detail: "Copy launch posts, share previews, test Gumroad/Etsy/LinkedIn/Instagram, and capture buyer signals.",
  },
  {
    step: "04",
    title: "Improve the pack from feedback",
    detail: "Edit the outputs, save versions, reopen from dashboard, and prepare the next stronger pack.",
  },
];

const pluginAccessCards = [
  {
    name: "ChatGPT",
    status: "First plugin path",
    detail: "Turn a chat brief into a Packsmith template pack, listing copy, and launch plan.",
  },
  {
    name: "Claude",
    status: "First assistant path",
    detail: "Use Packsmith outputs as clean context for refinement, editing, and repackaging.",
  },
  {
    name: "Adobe Express",
    status: "Creative path",
    detail: "Move launch copy and visual prompts into creator-friendly posts, decks, and promos.",
  },
  {
    name: "Canva / Figma",
    status: "Design path",
    detail: "Use Packsmith as the source for preview screens, social packs, and marketplace visuals.",
  },
  {
    name: "Notion / Gumroad",
    status: "Publish path",
    detail: "Turn the generated workspace and listing into something users can share, sell, and update.",
  },
  {
    name: "Browser helper",
    status: "Later research path",
    detail: "Capture inspiration from marketplaces and communities only after the core product proves demand.",
  },
];

const outputShowcase = [
  {
    icon: Database,
    name: "Notion OS",
    detail: "Pages, trackers, example rows, and a safe preview before publishing.",
  },
  {
    icon: PenTool,
    name: "Canva Pack",
    detail: "Pitch deck outline, social content prompts, preview checklist, and launch creatives.",
  },
  {
    icon: Figma,
    name: "Figma Starter",
    detail: "UI tokens, landing frames, dashboard components, and handoff notes.",
  },
  {
    icon: Rocket,
    name: "Market Kit",
    detail: "Listing copy, launch posts, pricing tests, video script, and channel plan.",
  },
];

const walkthroughSteps = [
  {
    id: "brief",
    label: "Choose niche",
    title: "Start with the buyer, pain, and platform mix.",
    copy:
      "Pick AI Agency, SaaS, Healthcare, or Instagram Creator. Packsmith loads the right buyer promise, assets, and INR price ladder.",
    metric: "4 presets",
    preview: ["Buyer clarity", "Pain point", "Assets", "₹ pricing"],
  },
  {
    id: "generate",
    label: "Forge pack",
    title: "Generate the first sellable pack shape.",
    copy:
      "The builder creates workspace pages, social template ideas, preview screens, listing copy, launch calendar, and quality score.",
    metric: "88/100",
    preview: ["Workspace pages", "Canva ideas", "Preview screens", "Launch copy"],
  },
  {
    id: "inspect",
    label: "Inspect output",
    title: "See exactly what the buyer gets.",
    copy:
      "Open the visual board, cover image, template tabs, and workspace preview before exporting anything.",
    metric: "5 exports",
    preview: ["Cover image", "Sales notes", "Listing copy", "Workspace plan"],
  },
  {
    id: "launch",
    label: "Launch assets",
    title: "Move from product idea to traction actions.",
    copy:
      "Use the Launch Asset Studio for Gumroad, LinkedIn, X, Instagram/Reels, Etsy, Reddit, and creator video prompts.",
    metric: "10 channels",
    preview: ["Gumroad", "LinkedIn", "Instagram/Reels", "Etsy"],
  },
];

const launchAssets = {
  linkedin:
    "I’m building Packsmith: a template-pack forge for solo founders. It turns one rough niche idea into workspace pages, Canva-ready templates, preview screens, marketplace listing, launch calendar, and video script. Today’s wedge: AI Agency, SaaS Launch, Healthcare Practice Growth, and Instagram Creator kits.",
  xThread: [
    "I’m building Packsmith: rough idea -> sellable template pack.",
    "Pick a niche: AI Agency, SaaS Launch, or Healthcare Practice Growth.",
    "Generate workspace pages, Canva-ready ideas, preview screens, Gumroad copy, launch calendar, and video prompts in one forge flow.",
    "Try first, then login with Google to save packs and prepare Notion publishing.",
  ],
  gumroad:
    "Packsmith helps solo founders turn a niche idea into a ready-to-sell template pack: workspace pages, Canva launch assets, preview screens, marketplace copy, and a launch board.",
  video:
    "Show Packsmith homepage, pick AI Agency Launch Kit, generate a custom pack, reveal quality score, open Notion simulation, copy Gumroad listing, and end on the launch page CTA.",
  prompt:
    "Retro-futuristic SaaS product demo, dark founder command center, amber and green terminal accents, UI cards assembling into Notion Canva Figma launch pack, premium cinematic lighting, no readable text.",
};

const launchMobileMoments = [
  {
    label: "Phone",
    title: "Open the forge on the train, in a DM, or after a client call.",
    detail: "Mobile web and PWA shell make Packsmith feel reachable before a native app is needed.",
  },
  {
    label: "Tablet",
    title: "Edit saved packs with enough room to think.",
    detail: "Dashboard history, output blocks, exports, and launch tracking stay tablet-friendly.",
  },
  {
    label: "Notion",
    title: "Publish once, then open the workspace in the Notion app.",
    detail: "The product remains export-first until the secure backend publish path is configured.",
  },
  {
    label: "Claude / ChatGPT",
    title: "Send clean exports instead of messy screenshots.",
    detail: "Assistant handoff keeps Packsmith useful inside the tools founders already use.",
  },
];

const generationalLaunchAngles = [
  {
    label: "Retro pull",
    title: "Make it feel familiar, tactile, and worth sharing.",
    detail:
      "Y2K/early-web signals, console UI, device frames, and playful motion create the first click without making the product feel unserious.",
  },
  {
    label: "Upgrade pull",
    title: "Let users co-create instead of just watch.",
    detail:
      "Editable packs, saved history, assistant handoff, and mobile installability make the product feel like a tool they can shape.",
  },
  {
    label: "Trust bridge",
    title: "Show the practical path from curiosity to output.",
    detail:
      "The page now connects the story to real actions: try the forge, reopen a pack, export for Notion, and carry it into Claude or ChatGPT.",
  },
];

const aiAgencyPricing = [
  {
    name: "Launch",
    price: "₹2,499",
    promise: "Core Notion OS, launch board, and starter marketing copy.",
    bestFor: "Freelancers validating the kit quickly.",
  },
  {
    name: "Premium",
    price: "₹6,499",
    promise: "Notion OS, Figma product kit, Canva launch pack, and full Launch Asset Studio exports.",
    bestFor: "Operators who want the full product bundle.",
  },
  {
    name: "Commercial",
    price: "₹12,999",
    promise: "Premium bundle plus commercial-use license and founder setup-review bonus.",
    bestFor: "Agencies selling or adapting the system for clients.",
  },
];

const socialAuthProviders = [
  { id: "google", label: "Google", helper: "Gmail", status: "ready" },
  { id: "facebook", label: "Facebook", helper: "Meta", status: "ready" },
  { id: "instagram", label: "Instagram", helper: "via Meta setup", status: "setup" },
];

const forgeGuideSteps = [
  {
    id: "brief",
    label: "Pick the right niche",
    detail: "Start with a proven preset instead of a blank prompt. Instagram is best for visual traction; AI Agency is best for paid service buyers.",
    action: "Choose a niche card and review buyer, pain, assets, and marketplace target.",
  },
  {
    id: "generate",
    label: "Shape the pack",
    detail: "Use the quality score and editable output blocks to make the pack specific enough to sell.",
    action: "Edit one asset line, then check workspace, social, and preview tabs.",
  },
  {
    id: "price",
    label: "Validate INR pricing",
    detail: "Keep pricing in Indian amounts and test launch, premium, and commercial tiers per niche.",
    action: "Pick the tier you would test first and use it in Gumroad/direct outreach copy.",
  },
  {
    id: "launch",
    label: "Prepare launch proof",
    detail: "The buyer needs to see what they get, not just read claims. Use cover, screenshots, and channel posts.",
    action: "Export cover SVG, copy a launch post, then save the pack locally or to cloud.",
  },
];

const nichePricingLadders = {
  aiAgency: [
    { name: "Launch", price: "₹2,499", angle: "First buyers", includes: "Core Notion OS, launch board, and starter copy." },
    { name: "Premium", price: "₹6,499", angle: "Best demo tier", includes: "Workspace pages, preview screens, social templates, and Launch Asset Studio." },
    { name: "Commercial", price: "₹12,999", angle: "Agency license", includes: "Premium bundle plus client-use rights and setup review." },
  ],
  saasLaunch: [
    { name: "Launch", price: "₹3,299", angle: "Indie founder entry", includes: "Launch OS, feedback inbox, roadmap, and listing copy." },
    { name: "Founder Pack", price: "₹8,499", angle: "Best founder tier", includes: "Full workspace, social templates, preview screens, metrics, and update assets." },
    { name: "Commercial", price: "₹16,499", angle: "Studio/license tier", includes: "Reusable client/advisory license with launch review bonus." },
  ],
  healthcareGrowth: [
    { name: "Launch", price: "₹4,199", angle: "Consultant test", includes: "Lead, referral, review, appointment, and campaign workflows." },
    { name: "Practice Pack", price: "₹8,499", angle: "Best clinic tier", includes: "Full operations kit with compliant marketing asset planning." },
    { name: "Consultant License", price: "₹16,499", angle: "B2B service tier", includes: "Commercial adaptation rights with compliance checklist." },
  ],
  instagramCreator: [
    { name: "Launch", price: "₹1,499", angle: "Creator impulse buy", includes: "Content OS, reels planner, caption bank, and preview checklist." },
    { name: "Creator Pack", price: "₹3,999", angle: "Best visual tier", includes: "Canva carousel, story, reel cover, and brand prompt set." },
    { name: "Commercial", price: "₹7,999", angle: "Freelancer tier", includes: "Client-use license for social media managers and small studios." },
  ],
  custom: [
    { name: "Launch", price: "₹1,499", angle: "Quick validation", includes: "Core generated pack, listing copy, and launch checklist." },
    { name: "Premium", price: "₹3,999", angle: "Best custom tier", includes: "Full workspace, social templates, preview screens, and marketing exports." },
    { name: "Commercial", price: "₹8,499", angle: "Client-use tier", includes: "Commercial-use option and founder setup review." },
  ],
};

const creatorOutputLabels = {
  notion: {
    friendly: "Workspace pages",
    action: "Open the planning system",
    buyerView: "A ready-to-use workspace for tracking ideas, tasks, buyers, and launch work.",
  },
  canva: {
    friendly: "Social templates",
    action: "Create posts and decks",
    buyerView: "Editable post, story, carousel, pitch, and preview ideas for Canva-style creation.",
  },
  figma: {
    friendly: "Preview screens",
    action: "Show the product visually",
    buyerView: "Landing page, mobile mockup, dashboard, and marketplace preview screens.",
  },
};

const creatorExportLabels = {
  markdown: "Download sales notes",
  marketplace: "Download listing copy",
  figma: "Download preview plan",
  notion: "Download workspace plan",
  cover: "Download cover image",
};

const privacyVersion = "2026-07-02";
const forgeResumeKey = "packsmith.resumePack";
const launchAssetTrackingKey = "packsmith.launchAssetTracking";
const analyticsEventsKey = "packsmith.analyticsEvents";
const analyticsAnonymousIdKey = "packsmith.analyticsAnonymousId";
const productWorkQueueKey = "packsmith.productWorkQueue";
const productWorkRunsKey = "packsmith.productWorkRuns";
const gumroadAiAgencyUrl = import.meta.env.VITE_GUMROAD_AI_AGENCY_URL || "";

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function saveWaitlistLocal(email, source) {
  const existing = JSON.parse(localStorage.getItem("packsmith.waitlist") || "[]");
  localStorage.setItem(
    "packsmith.waitlist",
    JSON.stringify(
      [
        {
          email,
          source,
          consentVersion: privacyVersion,
          privacyAcceptedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        ...existing,
      ].slice(0, 100),
    ),
  );
}

function fallbackCloudMessage(action) {
  return isSupabaseConfigured
    ? `Login with Google or Facebook to ${action}.`
    : `Supabase is not configured yet. Add env vars to ${action}; local mode still works.`;
}

function SocialAuthButtons({ user, onLogin, onSignOut }) {
  if (user) {
    return (
      <button className="navAuthButton" type="button" onClick={onSignOut}>
        <LogOut size={14} />
        Sign out
      </button>
    );
  }

  return (
    <div className="socialAuthCluster" aria-label="Account login options">
      {socialAuthProviders.map((provider) => (
        <button
          className={provider.status === "setup" ? "navAuthButton setup" : "navAuthButton"}
          key={provider.id}
          type="button"
          onClick={() => onLogin(provider.id)}
          title={provider.status === "setup" ? "Instagram business login needs Meta OAuth setup." : `Continue with ${provider.label}`}
        >
          <LogIn size={14} />
          <span>{provider.label}</span>
          <small>{provider.helper}</small>
        </button>
      ))}
    </div>
  );
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function packToMarkdown(pack, editedItems) {
  const list = (items) => items.map((item) => `- ${item}`).join("\n");
  return `# ${pack.name}

${pack.promise}

Buyer: ${pack.buyer}
Pain point: ${pack.painPoint}
Price: ${pack.suggestedPrice}
Quality score: ${pack.quality.overall}/100

## Platform Sections
${pack.sections
  .map((section) => {
    const items = editedItems[section.id] || section.items;
    return `### ${section.label}\n${section.summary}\n${list(items)}`;
  })
  .join("\n\n")}

## Listing
${pack.listing.title}

${pack.listing.description}

Tags: ${pack.listing.tags.join(", ")}

## Launch Plan
${list(pack.launchPlan)}
`;
}

function launchCalendarToMarkdown(calendar, pack) {
  return `# ${pack.name} Launch Calendar

${calendar.map((item) => `## ${item.day}: ${item.focus}\nOwner: ${item.owner}\n\n${item.action}`).join("\n\n")}
`;
}

function marketplaceToJson(pack) {
  return {
    pack: pack.name,
    primaryChannel: pack.marketplaceTarget,
    listing: pack.listing,
    launchChannels: pack.launchChannels,
  };
}

function readJsonObject(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeJsonObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getAnalyticsAnonymousId() {
  try {
    const existing = localStorage.getItem(analyticsAnonymousIdKey);
    if (existing) return existing;
    const next = `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(analyticsAnonymousIdKey, next);
    return next;
  } catch {
    return "anon-unavailable";
  }
}

function trackLocalAnalytics(type, metadata = {}) {
  const event = buildAnalyticsEvent(type, metadata);
  try {
    const current = JSON.parse(localStorage.getItem(analyticsEventsKey) || "[]");
    const safeCurrent = Array.isArray(current) ? current : [];
    const next = appendAnalyticsEvent(safeCurrent, event);
    localStorage.setItem(analyticsEventsKey, JSON.stringify(next));
  } catch {
    localStorage.setItem(analyticsEventsKey, JSON.stringify([event]));
  }

  if (!isSupabaseConfigured) return;
  try {
    const anonymousId = getAnalyticsAnonymousId();
    getCurrentSession()
      .then((session) =>
        saveAnalyticsEvent({
          event,
          userId: session?.user?.id || null,
          anonymousId,
        }),
      )
      .catch(() => {});
  } catch {
    // Analytics must never block product workflows.
  }
}

const launchStudioIconMap = {
  brain: Brain,
  clipboard: Clipboard,
  figma: Figma,
  file: FileText,
  phone: Smartphone,
  play: Play,
  trending: TrendingUp,
};

function LaunchAssetStudio({ pack, kit, compact = false, onCopy, onExport, onFigmaExport }) {
  const assetScope = `${pack.presetId || pack.id || "custom"}:${slugify(pack.name)}`;
  const assets = useMemo(() => buildLaunchAssetStudioItems(kit), [kit]);
  const [tracking, setTracking] = useState(() => {
    const allTracking = readJsonObject(launchAssetTrackingKey);
    return buildInitialLaunchAssetTracking(kit, allTracking[assetScope] || {});
  });
  const trackingSummary = useMemo(() => buildLaunchAssetTrackingSummary(tracking), [tracking]);

  useEffect(() => {
    const allTracking = readJsonObject(launchAssetTrackingKey);
    setTracking(buildInitialLaunchAssetTracking(kit, allTracking[assetScope] || {}));
  }, [assetScope, kit]);

  function updateAssetStatus(assetId, status) {
    if (!launchAssetStatuses.includes(status)) return;
    const nextTracking = { ...tracking, [assetId]: status };
    const allTracking = readJsonObject(launchAssetTrackingKey);
    allTracking[assetScope] = nextTracking;
    writeJsonObject(launchAssetTrackingKey, allTracking);
    setTracking(nextTracking);
  }

  return (
    <section className={compact ? "launchAssetStudio compact" : "panel launchAssetStudio"}>
      <div className="boardHeader">
        <div>
          <p className="eyebrow">Launch Asset Studio</p>
          <h2>{compact ? "Copy launch assets" : "Copy, ship, and test the product story"}</h2>
        </div>
        <button type="button" onClick={() => onExport?.(kit, tracking)}>
          <Download size={17} />
          Export studio
        </button>
        <button type="button" onClick={() => onFigmaExport?.()}>
          <Figma size={17} />
          Preview plan
        </button>
      </div>
      {!compact && (
        <p className="muted">
          Built for {pack.name}: workspace pages, preview screens, social templates, mobile access,
          and Claude/ChatGPT handoff.
        </p>
      )}
      <div className="launchTrackingSummary" aria-label="Launch asset action tracking summary">
        <span>{trackingSummary.posted} posted</span>
        <span>{trackingSummary.tested} tested</span>
        <span>{trackingSummary.converted} converted</span>
        <span>{trackingSummary.needsRewrite} rewrites</span>
      </div>
      <div className="launchAssetGrid">
        {assets.map((asset) => {
          const Icon = launchStudioIconMap[asset.icon] || FileText;
          return (
            <article key={asset.id}>
              <div>
                <Icon size={18} />
                <span>{asset.label}</span>
              </div>
              <p>{asset.helper}</p>
              <label className="assetStatusControl">
                Status
                <select
                  value={tracking[asset.id] || "Drafted"}
                  onChange={(event) => updateAssetStatus(asset.id, event.target.value)}
                >
                  {launchAssetStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <textarea readOnly value={asset.content} />
              <button type="button" onClick={() => onCopy?.(asset.content, `${asset.label} copied.`)}>
                <Clipboard size={16} />
                Copy
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LandingPage() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [activeWalkthroughId, setActiveWalkthroughId] = useState(walkthroughSteps[0].id);
  const activeWalkthrough = walkthroughSteps.find((step) => step.id === activeWalkthroughId) || walkthroughSteps[0];

  useEffect(() => {
    trackLocalAnalytics("viewed_home_page", { page: "/" });
  }, []);

  async function saveWaitlist(event) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    if (!privacyAccepted) {
      setNotice("Please accept the privacy notice before joining.");
      return;
    }
    try {
      if (isSupabaseConfigured) {
        await saveWaitlistLead({ email: value, source: "homepage", consentVersion: privacyVersion });
        setNotice("Saved to the early builder list.");
      } else {
        saveWaitlistLocal(value, "homepage-local");
        setNotice("Saved locally. Add Supabase env vars to capture real leads.");
      }
    } catch {
      saveWaitlistLocal(value, "homepage-fallback");
      setNotice("Cloud save failed, so I saved this lead locally.");
    }
    setEmail("");
  }

  return (
    <main className="landingFrame">
      <section className="landingHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <div className="brandLockup">
            <div className="brandMark">
              <Flame size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Retro template-pack forge</span>
            </div>
          </div>
          <div className="navPills">
            <span>Idea to product</span>
            <span>INR validation</span>
            <span>Plugins</span>
            <a href="/ai-agency-launch-kit">AI Agency Kit</a>
            <a href="/launch">Launch kit</a>
            <a href="/plugins">Plugins</a>
            <a href="/api-console">API Console</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/mobile">Mobile</a>
            <a href="/privacy">Privacy</a>
            <a href="/app">Try now</a>
          </div>
        </nav>

        <div className="landingGrid">
          <motion.div
            className="heroCopy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow gold">Template-pack forge for solo founders</p>
            <h1>Packsmith</h1>
            <p>
              Bring a rough template idea. Packsmith does the heavy lift: shapes the pack, builds the
              first assets, prepares launch proof, and helps you validate demand before you overbuild.
            </p>
            <div className="heroActions">
              <a href="/app">
                Try the forge
                <ArrowRight size={17} />
              </a>
              <a className="ghostLink" href="#presets">View niches</a>
              <a className="ghostLink" href="#walkthrough">Walkthrough</a>
              <a className="ghostLink" href="/launch">Marketing kit</a>
            </div>
            <div className="heroStats" aria-label="Packsmith product stats">
              {landingStats.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="liveSignalRail" aria-label="Live product activity">
              {landingLiveSignals.map((signal, index) => (
                <span key={signal} style={{ "--delay": `${index * 0.55}s` }}>
                  <i />
                  {signal}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="landingProductShot"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.5 }}
          >
            <div className="consoleHeader">
              <span />
              <span />
              <span />
              <strong>packsmith://forge</strong>
            </div>
            <div className="productShotGrid">
              <div className="holoRing" aria-hidden="true" />
              <article className="ideaTerminal">
                <span>Rough input</span>
                <strong>AI agency launch kit for freelancers</strong>
                <p>Buyer, pain, assets, platform targets, visual style, marketplace.</p>
              </article>
              <article className="qualityDial">
                <Gauge size={28} />
                <div>
                  <span>Pack quality</span>
                  <strong>88/100</strong>
                </div>
              </article>
              <article className="outputStack">
                {["Notion OS", "Canva Pack", "Figma Kit", "Gumroad Listing"].map((item) => (
                  <div key={item}>
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </article>
            </div>
            <div className="packRevealStrip" aria-label="Pack reveal preview">
              <article>
                <span>Sellability</span>
                <strong>₹6,499 test</strong>
              </article>
              <article>
                <span>Assets</span>
                <strong>14 ready</strong>
              </article>
              <article>
                <span>Launch</span>
                <strong>82%</strong>
              </article>
            </div>
            <div className="miniPipeline">
              {pipelineStages.map((stage, index) => (
                <article key={stage.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stage.label}</strong>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landingSection proofSection">
        <div className="sectionIntro">
          <p className="eyebrow">Why try it</p>
          <h2>A template business cockpit, not another blank generator.</h2>
        </div>
        <div className="proofGrid">
          {landingProof.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={22} />
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landingSection heavyLiftSection">
        <div className="sectionIntro">
          <p className="eyebrow">Heavy lift promise</p>
          <h2>Users should feel: “Packsmith made my template idea real.”</h2>
        </div>
        <div className="heavyLiftGrid">
          {heavyLiftPromises.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={23} />
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landingSection validationLoopSection">
        <div className="sectionIntro">
          <p className="eyebrow">Validation loop</p>
          <h2>Do not just create templates. Create proof people want them.</h2>
        </div>
        <div className="validationLoopGrid">
          {validationLoop.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection" id="presets">
        <div className="sectionIntro">
          <p className="eyebrow">Niche presets</p>
          <h2>Start with a marketable wedge, then generate the pack.</h2>
        </div>
        <div className="landingPresetGrid">
          {Object.values(nichePresets).map((preset) => (
            <a className="landingPresetCard" href="/app" key={preset.id}>
              <span>{preset.shortName}</span>
              <strong>{preset.name}</strong>
              <p>{preset.heroLine}</p>
              <small>
                {preset.comparison.expectedPrice} / {preset.comparison.bestMarketplace}
              </small>
              <b>Open preset</b>
            </a>
          ))}
        </div>
      </section>

      <section className="landingSection pluginAccessSection">
        <div className="sectionIntro">
          <p className="eyebrow">Plugin-ready path</p>
          <h2>Packsmith should meet users where they already create.</h2>
        </div>
        <div className="pluginAccessGrid">
          {pluginAccessCards.map((item) => (
            <article key={item.name}>
              <span>{item.status}</span>
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className="pluginAccessCta">
          <p>
            The web app remains the core experience, but the plugin path makes Packsmith easier to talk about:
            start in ChatGPT or Claude, polish in creative tools, publish through Notion/Gumroad-style workflows.
          </p>
          <a href="/plugins">
            View plugin roadmap
            <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <section className="landingSection outputSection">
        <div className="sectionIntro">
          <p className="eyebrow">Outputs</p>
          <h2>Everything needed to make the first template pack feel real.</h2>
        </div>
        <div className="outputShowcaseGrid">
          {outputShowcase.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name}>
                <Icon size={24} />
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landingSection walkthroughSection" id="walkthrough">
        <div className="sectionIntro">
          <p className="eyebrow">Product walkthrough</p>
          <h2>Click through the Packsmith flow before opening the app.</h2>
        </div>
        <div className="walkthroughShell">
          <div className="walkthroughSteps" role="tablist" aria-label="Packsmith walkthrough steps">
            {walkthroughSteps.map((step, index) => (
              <button
                key={step.id}
                className={activeWalkthrough.id === step.id ? "active" : ""}
                type="button"
                onClick={() => setActiveWalkthroughId(step.id)}
                role="tab"
                aria-selected={activeWalkthrough.id === step.id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.label}</strong>
              </button>
            ))}
          </div>
          <motion.article
            className="walkthroughPreview"
            key={activeWalkthrough.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="consoleHeader">
              <span />
              <span />
              <span />
              <strong>walkthrough://{activeWalkthrough.id}</strong>
            </div>
            <div className="walkthroughPreviewGrid">
              <div>
                <p className="eyebrow gold">{activeWalkthrough.label}</p>
                <h3>{activeWalkthrough.title}</h3>
                <p>{activeWalkthrough.copy}</p>
                <a href="/app">
                  Try this step in the forge
                  <ArrowRight size={16} />
                </a>
              </div>
              <aside>
                <span>Live signal</span>
                <strong>{activeWalkthrough.metric}</strong>
                <div className="walkthroughBars" aria-hidden="true">
                  {activeWalkthrough.preview.map((item, index) => (
                    <i key={item} style={{ "--bar": `${48 + index * 13}%` }} />
                  ))}
                </div>
              </aside>
            </div>
            <div className="walkthroughChips">
              {activeWalkthrough.preview.map((item) => (
                <span key={item}>
                  <CheckCircle2 size={15} />
                  {item}
                </span>
              ))}
            </div>
          </motion.article>
        </div>
      </section>

      <section className="landingSection beforeAfter">
        <div className="sectionIntro">
          <p className="eyebrow">Before / After</p>
          <h2>From scattered idea to launch command center.</h2>
        </div>
        <div className="beforeAfterGrid">
          <article>
            <span>Before</span>
            <h3>Messy creator idea</h3>
            <p>Loose notes, vague buyer, generic AI copy, no product bundle, no launch channel plan.</p>
          </article>
          <article>
            <span>Forge</span>
            <h3>Packsmith pipeline</h3>
            <p>Brief, quality score, template outputs, workspace preview, launch board, marketing kit.</p>
          </article>
          <article>
            <span>After</span>
            <h3>Sellable template pack</h3>
            <p>Sales notes, listing copy, launch calendar, video script, social posts, pitch outline.</p>
          </article>
        </div>
      </section>

      <section className="landingSection waitlistPanel" id="waitlist">
        <div>
          <p className="eyebrow">Start now</p>
          <h2>Try the forge, then join the early builder list.</h2>
          <p className="muted">
            The public MVP is ready to explore. Drop an email locally for now, then use the app to generate
            the AI Agency, SaaS, or Healthcare template pack.
          </p>
        </div>
        <form onSubmit={saveWaitlist}>
          <a className="waitlistCta" href="/app">
            Open Packsmith
            <ArrowRight size={17} />
          </a>
          <input
            type="email"
            placeholder="founder@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className="consentLine">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
            />
            <span>
              I agree to the <a href="/privacy">privacy notice</a> and consent to Packsmith storing this email for early access.
            </span>
          </label>
          <button className="primary" type="submit">
            <Mail size={17} />
            Join list
          </button>
          {notice && <p>{notice}</p>}
        </form>
      </section>
    </main>
  );
}

function LaunchPage() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const featuredPack = useMemo(
    () => buildLaunchKit(getPreset(defaultPresetId).brief, defaultPresetId),
    [],
  );
  const featuredMarketingKit = useMemo(() => buildMarketingKit(featuredPack), [featuredPack]);

  useEffect(() => {
    trackLocalAnalytics("viewed_launch_page", { page: "/launch", pack: featuredPack.name });
  }, [featuredPack.name]);

  async function copyLaunchCopy(label, value) {
    try {
      await navigator.clipboard.writeText(Array.isArray(value) ? value.join("\n") : value);
      trackLocalAnalytics("copied_launch_asset", { label, page: "/launch" });
      setNotice(`${label} copied.`);
    } catch {
      setNotice("Copy was blocked by the browser.");
    }
  }

  async function saveLaunchLead(event) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    if (!privacyAccepted) {
      setNotice("Please accept the privacy notice before joining.");
      return;
    }
    try {
      if (isSupabaseConfigured) {
        await saveWaitlistLead({ email: value, source: "launch-page", consentVersion: privacyVersion });
        setNotice("You are on the early builder list.");
      } else {
        saveWaitlistLocal(value, "launch-page-local");
        setNotice("Saved locally. Add Supabase env vars to capture real leads.");
      }
      trackLocalAnalytics("submitted_launch_waitlist", { source: "launch-page" });
      setEmail("");
    } catch {
      saveWaitlistLocal(value, "launch-page-fallback");
      setNotice("Cloud save failed, so this lead was saved locally.");
      setEmail("");
    }
  }

  function exportLaunchKit() {
    downloadFile(
      "packsmith-launch-kit.json",
      JSON.stringify(
        {
          featuredPack: featuredPack.name,
          launchAssets,
          productStack: featuredMarketingKit.productStack,
          figmaProductLaunches: featuredMarketingKit.figmaProductLaunches,
          mobileLaunchCampaign: featuredMarketingKit.mobileLaunchCampaign,
          emergingSharingStreams: featuredMarketingKit.emergingSharingStreams,
          aiCreativePlatforms: featuredMarketingKit.aiCreativePlatforms,
        },
        null,
        2,
      ),
      "application/json",
    );
    trackLocalAnalytics("exported_launch_kit_json", { pack: featuredPack.name });
    setNotice("Launch kit exported.");
  }

  return (
    <main className="landingFrame launchFrame">
      <section className="landingHero launchHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <Flame size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Launch kit</span>
            </div>
          </a>
          <div className="navPills">
            <a href="/">Home</a>
            <a href="/ai-agency-launch-kit">AI Agency Kit</a>
            <a href="/plugins">Plugins</a>
            <a href="/api-console">API Console</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/mobile">Mobile</a>
            <a href="/privacy">Privacy</a>
            <a href="/app">Try the forge</a>
          </div>
        </nav>

        <div className="landingGrid">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow gold">Today’s traction page</p>
            <h1>Retro enough to explore. Useful enough to return.</h1>
            <p>
              Packsmith turns curiosity into a working template business flow: mobile-ready forge,
              saved packs, Notion handoff, launch copy, and assistant-ready exports.
            </p>
            <div className="heroActions">
              <a href="/app">
                Try the forge
                <ArrowRight size={17} />
              </a>
              <a className="ghostLink" href="/mobile">
                See mobile flow
                <Smartphone size={17} />
              </a>
              <a className="ghostLink" href="#launch-copy">Copy launch assets</a>
            </div>
          </motion.div>

          <motion.div className="launchCommandCard" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="consoleHeader">
              <span />
              <span />
              <span />
              <strong>packsmith://traction</strong>
            </div>
            <article>
              <span>Featured wedge</span>
              <strong>{featuredPack.name}</strong>
              <p>{featuredPack.listing.description}</p>
            </article>
            <div className="launchMetricGrid">
              <div>
                <strong>{featuredPack.quality.overall}</strong>
                <span>Quality score</span>
              </div>
              <div>
                <strong>{featuredPack.launchChannels.length}</strong>
                <span>Launch channels</span>
              </div>
              <div>
                <strong>{featuredPack.sections.length}</strong>
                <span>Pack surfaces</span>
              </div>
            </div>
            <div className="launchMobileMini">
              <Smartphone size={18} />
              <div>
                <strong>Mobile-ready PWA path</strong>
                <span>Phone, tablet, Notion app, Claude, ChatGPT</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landingSection">
        <div className="sectionIntro">
          <p className="eyebrow">What Packsmith does</p>
          <h2>Turns a product idea into launchable template assets.</h2>
        </div>
        <div className="proofGrid">
          {landingProof.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title}>
                <Icon size={22} />
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landingSection retroUpgradeBand">
        <div className="sectionIntro">
          <p className="eyebrow">Retro x upgrade</p>
          <h2>Nostalgia gets the click. Co-creation keeps the user.</h2>
          <p className="muted">
            The marketing page now pairs retro-futuristic energy with modern proof: mobile access,
            editable packs, saved history, Notion compatibility, and AI assistant handoff.
          </p>
        </div>
        <div className="retroUpgradeGrid">
          {generationalLaunchAngles.map((angle) => (
            <article key={angle.label}>
              <span>{angle.label}</span>
              <h3>{angle.title}</h3>
              <p>{angle.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection">
        <div className="sectionIntro">
          <p className="eyebrow">Pick a niche</p>
          <h2>Start with the buyer most likely to pay or give feedback.</h2>
        </div>
        <div className="landingPresetGrid">
          {Object.values(nichePresets).map((preset) => (
            <a className="landingPresetCard" href="/app" key={preset.id}>
              <span>{preset.shortName}</span>
              <strong>{preset.name}</strong>
              <p>{preset.heroLine}</p>
              <small>{preset.comparison.fastestChannel}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="landingSection outputSection">
        <div className="sectionIntro">
          <p className="eyebrow">Launch assets included</p>
          <h2>The first marketing push is generated with the product.</h2>
        </div>
        <div className="outputShowcaseGrid">
          {outputShowcase.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name}>
                <Icon size={24} />
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landingSection productStackSection">
        <div className="sectionIntro">
          <p className="eyebrow">Not only Notion</p>
          <h2>Sell a complete template product, not a single workspace.</h2>
          <p className="muted">
            The strongest version of Packsmith bundles the operating system, product design layer,
            launch creative, mobile access, and assistant handoff.
          </p>
        </div>
        <div className="productStackGrid">
          {featuredMarketingKit.productStack.map((item) => (
            <article key={item.id} className={`productStackCard ${item.id}`}>
              <span>{item.platform}</span>
              <h3>{item.product}</h3>
              <strong>{item.angle}</strong>
              <p>{item.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection figmaProductSection">
        <div className="sectionIntro">
          <p className="eyebrow">Figma product wedge</p>
          <h2>Make the pack look premium before the buyer even opens Notion.</h2>
          <p className="muted">
            Figma gives Packsmith a visually catchy product path: UI kits, landing pages,
            dashboard screens, and marketplace preview assets.
          </p>
        </div>
        <div className="figmaProductGrid">
          {featuredMarketingKit.figmaProductLaunches.map((item) => (
            <article key={item.name}>
              <Figma size={22} />
              <span>{item.marketplace}</span>
              <h3>{item.name}</h3>
              <p>{item.buyerPromise}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection emergingStreamsSection">
        <div className="sectionIntro">
          <p className="eyebrow">Beyond regular channels</p>
          <h2>Launch where people already remix and share.</h2>
          <p className="muted">
            Packsmith prepares copy and prompts for classic channels plus newer short-form,
            visual-discovery, fediverse, and AI creative workflows.
          </p>
        </div>
        <div className="emergingStreamsGrid">
          {featuredMarketingKit.emergingSharingStreams.map((item) => (
            <article key={item.id}>
              <TrendingUp size={19} />
              <span>{item.format}</span>
              <h3>{item.platform}</h3>
              <p>{item.angle}</p>
            </article>
          ))}
        </div>
        <div className="aiPlatformStrip">
          {featuredMarketingKit.aiCreativePlatforms.map((item) => (
            <article key={item.id}>
              <Brain size={18} />
              <div>
                <strong>{item.platform}</strong>
                <span>{item.use}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection launchMobileShowcase">
        <div className="sectionIntro">
          <p className="eyebrow">Mobile-first curiosity</p>
          <h2>It should feel alive on the device where the idea appears.</h2>
          <p className="muted">
            Packsmith starts as an installable mobile web app, then grows into native only when the signal is real.
          </p>
        </div>
        <div className="launchMobileGrid">
          <div className="marketingPhoneStack" aria-label="Packsmith mobile marketing preview">
            <div className="phoneShell launchPhoneShell">
              <div className="phoneSpeaker" />
              <article>
                <span>Saved pack</span>
                <strong>AI Agency Launch Kit</strong>
                <p>Reopen, edit, export, publish path.</p>
              </article>
              <article>
                <span>Quality</span>
                <strong>90/100</strong>
                <p>Buyer clarity, assets, marketplace, setup readiness.</p>
              </article>
              <article>
                <span>Launch</span>
                <strong>Gumroad + LinkedIn</strong>
                <p>Copy, calendar, video prompts.</p>
              </article>
            </div>
          </div>
          <div className="launchMobileMoments">
            {launchMobileMoments.map((moment) => (
              <article key={moment.label}>
                <span>{moment.label}</span>
                <h3>{moment.title}</h3>
                <p>{moment.detail}</p>
              </article>
            ))}
            <div className="mobileLaunchCtas">
              <a href="/mobile">
                Explore mobile access
                <ArrowRight size={17} />
              </a>
              <a className="ghostLink" href="/app">
                Try the forge
                <Sparkles size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="landingSection launchCopySection" id="launch-copy">
        <div className="sectionIntro">
          <p className="eyebrow">Today’s launch copy</p>
          <h2>Copy the posts, record the demo, and start outreach.</h2>
        </div>
        <div className="launchCopyGrid">
          {Object.entries(launchAssets).map(([key, value]) => (
            <article key={key}>
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
              <p>{Array.isArray(value) ? value.join(" ") : value}</p>
              <button type="button" onClick={() => copyLaunchCopy(key, value)}>
                <Clipboard size={16} />
                Copy
              </button>
            </article>
          ))}
        </div>
        <div className="mobileCampaignPanel">
          <div>
            <p className="eyebrow">Shareable launch angle</p>
            <h3>Phone, tablet, Notion, Figma, Claude, ChatGPT.</h3>
            <p>{featuredMarketingKit.mobileLaunchCampaign.linkedinPost}</p>
          </div>
          <button
            type="button"
            onClick={() =>
              copyLaunchCopy("Mobile launch post", featuredMarketingKit.mobileLaunchCampaign.linkedinPost)
            }
          >
            <Clipboard size={16} />
            Copy mobile launch post
          </button>
        </div>
        <button className="primary exportLaunchButton" type="button" onClick={exportLaunchKit}>
          <FileJson size={17} />
          Export launch kit
        </button>
      </section>

      <section className="landingSection waitlistPanel">
        <div>
          <p className="eyebrow">Join early builder list</p>
          <h2>Capture the lead, then send them into the forge.</h2>
          <p className="muted">
            Supabase stores this when configured. Without credentials, Packsmith keeps the lead locally
            so the demo still works.
          </p>
        </div>
        <form onSubmit={saveLaunchLead}>
          <a className="waitlistCta" href="/app">
            Open Packsmith
            <ArrowRight size={17} />
          </a>
          <input
            type="email"
            placeholder="founder@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className="consentLine">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
            />
            <span>
              I agree to the <a href="/privacy">privacy notice</a> and consent to Packsmith storing this email for early access.
            </span>
          </label>
          <button className="primary" type="submit">
            <Mail size={17} />
            Join list
          </button>
          {notice && <p>{notice}</p>}
        </form>
      </section>
    </main>
  );
}

function AiAgencyLaunchKitPage() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const pack = useMemo(() => buildLaunchKit(getPreset("aiAgency").brief, "aiAgency"), []);
  const kit = useMemo(() => buildMarketingKit(pack), [pack]);
  const figmaSchema = useMemo(() => buildFigmaExportSchema(pack, kit), [pack, kit]);
  const notionExport = useMemo(() => buildNotionExport(pack), [pack]);
  const gumroadPlan = useMemo(
    () => buildGumroadCheckoutPlan({ pack, pricing: aiAgencyPricing, kit, checkoutUrl: gumroadAiAgencyUrl }),
    [pack, kit],
  );

  useEffect(() => {
    trackLocalAnalytics("viewed_ai_agency_product_page", { pack: pack.name });
  }, [pack.name]);

  async function saveProductLead(event) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    if (!privacyAccepted) {
      setNotice("Please accept the privacy notice before joining.");
      return;
    }
    try {
      if (isSupabaseConfigured) {
        await saveWaitlistLead({ email: value, source: "ai-agency-product-page", consentVersion: privacyVersion });
        setNotice("You are on the early buyer list.");
      } else {
        saveWaitlistLocal(value, "ai-agency-product-page-local");
        setNotice("Saved locally. Add Supabase env vars to capture real leads.");
      }
      trackLocalAnalytics("submitted_ai_agency_waitlist", { pack: pack.name });
      setEmail("");
    } catch {
      saveWaitlistLocal(value, "ai-agency-product-page-fallback");
      trackLocalAnalytics("submitted_ai_agency_waitlist_local_fallback", { pack: pack.name });
      setNotice("Cloud save failed, so this lead was saved locally.");
      setEmail("");
    }
  }

  function clickGumroadPlaceholder(tier = "Premium") {
    trackLocalAnalytics("gumroad_cta_clicked", { pack: pack.name, tier, checkoutReady: Boolean(gumroadPlan.checkoutUrl) });
    if (gumroadPlan.checkoutUrl) {
      window.open(gumroadPlan.checkoutUrl, "_blank", "noopener,noreferrer");
      setNotice(`${tier} checkout opened in a new tab.`);
      return;
    }
    setNotice("Gumroad checkout is ready for a URL. Add VITE_GUMROAD_AI_AGENCY_URL after the product is created.");
  }

  function exportRevenuePageBrief() {
    downloadFile(
      "ai-agency-launch-kit-revenue-brief.json",
      JSON.stringify(
        {
          pack: pack.name,
          pricing: aiAgencyPricing,
          gumroadPlan,
          listing: pack.listing,
          productStack: kit.productStack,
          figmaFrames: figmaSchema.frames,
          notionDatabases: notionExport.databases.map((database) => database.name),
        },
        null,
        2,
      ),
      "application/json",
    );
    trackLocalAnalytics("exported_ai_agency_revenue_brief", { pack: pack.name });
    setNotice("Revenue brief exported.");
  }

  function exportGumroadListing() {
    downloadFile(
      "ai-agency-launch-kit-gumroad-listing.md",
      buildGumroadListingMarkdown(gumroadPlan),
      "text/markdown",
    );
    trackLocalAnalytics("exported_gumroad_listing_markdown", { pack: pack.name });
    setNotice("Gumroad listing markdown exported.");
  }

  function exportCheckoutTerms() {
    downloadFile(
      "ai-agency-launch-kit-checkout-terms.json",
      JSON.stringify(
        {
          productName: gumroadPlan.productName,
          pricingTiers: gumroadPlan.pricingTiers,
          license: gumroadPlan.license,
          refundPolicy: gumroadPlan.refundPolicy,
          faq: gumroadPlan.faq,
          setupChecklist: gumroadPlan.setupChecklist,
        },
        null,
        2,
      ),
      "application/json",
    );
    trackLocalAnalytics("exported_gumroad_checkout_terms", { pack: pack.name });
    setNotice("Checkout terms exported.");
  }

  return (
    <main className="landingFrame revenueFrame">
      <section className="revenueHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <Rocket size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>AI Agency Launch Kit</span>
            </div>
          </a>
          <div className="navPills">
            <a href="/">Home</a>
            <a href="/ai-agency-launch-kit">AI Agency Kit</a>
            <a href="/launch">Launch kit</a>
            <a href="/mobile">Mobile</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/app">Forge</a>
          </div>
        </nav>

        <div className="revenueHeroGrid">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow gold">First revenue product</p>
            <h1>AI Agency Launch Kit</h1>
            <p>
              A ready-to-sell operating system for automation freelancers: Notion CRM, Figma product
              surfaces, Canva launch assets, mobile access story, and launch copy in one bundle.
            </p>
            <div className="heroActions">
              <button type="button" onClick={() => clickGumroadPlaceholder("Premium")}>
                {gumroadPlan.checkoutUrl ? "Open Gumroad checkout" : "Track preorder intent"}
                <ArrowRight size={17} />
              </button>
              <a className="ghostLink" href="/app">
                Try in forge
                <Sparkles size={17} />
              </a>
              <button type="button" onClick={exportRevenuePageBrief}>
                <FileJson size={17} />
                Export brief
              </button>
            </div>
          </motion.div>

          <motion.div className="revenuePreviewPanel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="consoleHeader">
              <span />
              <span />
              <span />
              <strong>packsmith://paid-pack</strong>
            </div>
            <article>
              <span>Bundle value</span>
              <strong>{pack.quality.overall}/100</strong>
              <p>{pack.promise}</p>
            </article>
            <div className="revenueMiniGrid">
              <div>
                <strong>{notionExport.databases.length}</strong>
                <span>Notion databases</span>
              </div>
              <div>
                <strong>{figmaSchema.frames.length}</strong>
                <span>Figma frames</span>
              </div>
              <div>
                <strong>{kit.mobileLaunchCampaign.screenshotChecklist.length}</strong>
                <span>Preview shots</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landingSection revenueStackSection">
        <div className="sectionIntro">
          <p className="eyebrow">What buyers get</p>
          <h2>Not a loose template. A launchable product system.</h2>
        </div>
        <div className="productStackGrid">
          {kit.productStack.map((item) => (
            <article className={`productStackCard ${item.id}`} key={item.id}>
              <span>{item.platform}</span>
              <h3>{item.product}</h3>
              <strong>{item.angle}</strong>
              <p>{item.proof}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection revenuePreviewSection">
        <div className="sectionIntro">
          <p className="eyebrow">Product preview</p>
          <h2>The pieces that make the bundle feel premium.</h2>
        </div>
        <div className="revenuePreviewGrid">
          {pack.sections.map((section) => (
            <article key={section.id}>
              <span>{section.label}</span>
              <h3>{section.summary}</h3>
              <ul>
                {section.items.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection revenuePricingSection">
        <div className="sectionIntro">
          <p className="eyebrow">Pricing ladder</p>
          <h2>Start low, learn fast, and keep room for commercial value.</h2>
        </div>
        <div className="pricingGrid">
          {gumroadPlan.pricingTiers.map((tier) => (
            <article key={tier.name} className={tier.name === "Premium" ? "featured" : ""}>
              <span>{tier.name}</span>
              <strong>{tier.price}</strong>
              <p>{tier.promise}</p>
              <small>{tier.bestFor}</small>
              <button type="button" onClick={() => clickGumroadPlaceholder(tier.name)}>
                {gumroadPlan.checkoutUrl ? tier.ctaLabel : "Track Gumroad intent"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection gumroadPrepSection">
        <div className="sectionIntro">
          <p className="eyebrow">Checkout prep</p>
          <h2>Gumroad page assets are ready before the payment link is live.</h2>
        </div>
        <div className="gumroadPrepGrid">
          <article className="gumroadListingCard">
            <span>Listing copy</span>
            <h3>{gumroadPlan.title}</h3>
            <p>{gumroadPlan.shortDescription}</p>
            <ul>
              {gumroadPlan.deliverables.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="buttonRow">
              <button type="button" onClick={exportGumroadListing}>
                <FileText size={17} />
                Export listing
              </button>
              <button type="button" onClick={exportCheckoutTerms}>
                <ShieldCheck size={17} />
                Export terms
              </button>
            </div>
          </article>

          <article className="gumroadPolicyCard">
            <span>License and refund</span>
            <h3>Clear terms for a digital template product.</h3>
            <p>{gumroadPlan.license.commercial}</p>
            <p>{gumroadPlan.refundPolicy.window} refund window: {gumroadPlan.refundPolicy.terms}</p>
            <small>No payment information is collected by Packsmith. Checkout stays on Gumroad when connected.</small>
          </article>

          <article className="gumroadSetupCard">
            <span>Founder checklist</span>
            <h3>What to do in Gumroad next.</h3>
            <ol>
              {gumroadPlan.setupChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        </div>
      </section>

      <section className="landingSection waitlistPanel" id="early-access">
        <div>
          <p className="eyebrow">Founder setup-review bonus</p>
          <h2>First 10 buyers get a setup review.</h2>
          <p className="muted">
            This gives early buyers confidence and gives Packsmith real feedback before the full checkout
            flow is connected.
          </p>
        </div>
        <form onSubmit={saveProductLead}>
          <input
            type="email"
            placeholder="founder@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className="consentLine">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
            />
            <span>
              I agree to the <a href="/privacy">privacy notice</a> and consent to Packsmith storing this email for early access.
            </span>
          </label>
          <button className="primary" type="submit">
            <Mail size={17} />
            Join early buyer list
          </button>
          {notice && <p>{notice}</p>}
        </form>
      </section>

      {notice && (
        <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {notice}
        </motion.div>
      )}
    </main>
  );
}

function PrivacyPage() {
  useEffect(() => {
    trackLocalAnalytics("viewed_privacy_page", { page: "/privacy" });
  }, []);

  return (
    <main className="landingFrame privacyFrame">
      <section className="landingHero privacyHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <ShieldCheck size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Privacy and security</span>
            </div>
          </a>
          <div className="navPills">
            <a href="/">Home</a>
            <a href="/ai-agency-launch-kit">AI Agency Kit</a>
            <a href="/launch">Launch kit</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/mobile">Mobile</a>
            <a href="/app">Try the forge</a>
          </div>
        </nav>

        <div className="privacyContent">
          <div className="sectionIntro">
            <p className="eyebrow gold">Privacy notice v{privacyVersion}</p>
            <h1>Packsmith collects only what it needs to run the beta.</h1>
            <p className="muted">
              This page is a product privacy notice for the current MVP. It is not legal advice; before public launch,
              have the final policy reviewed for the countries where you operate.
            </p>
          </div>

          <div className="privacyGrid">
            <article>
              <h2>What we collect</h2>
              <ul>
                <li>Email address when you join the early builder list.</li>
                <li>Google profile basics through Supabase Auth when you choose to login.</li>
                <li>Template pack content you save to cloud storage.</li>
                <li>Launch-event metadata when you save marketing actions.</li>
                <li>Product analytics metadata such as page views, export clicks, CTA clicks, and pricing-tier intent.</li>
                <li>Notion parent page ID and workspace payload when you publish.</li>
              </ul>
            </article>
            <article>
              <h2>What we do not store in the browser</h2>
              <ul>
                <li>Notion API tokens.</li>
                <li>Supabase service-role keys.</li>
                <li>OAuth provider secrets.</li>
                <li>Payment information.</li>
                <li>Generated template payload bodies inside analytics events.</li>
              </ul>
            </article>
            <article>
              <h2>How data is protected</h2>
              <ul>
                <li>Supabase row-level security limits users to their own saved packs and launch events.</li>
                <li>Notion publishing uses a server-side Edge Function contract.</li>
                <li>Environment secrets are excluded from git through `.env` and `.env.local` ignores.</li>
                <li>The app keeps working in local-only mode when cloud credentials are missing.</li>
              </ul>
            </article>
            <article>
              <h2>Your choices</h2>
              <ul>
                <li>You can try the generator without logging in.</li>
                <li>Login is required only for cloud save and real publishing paths.</li>
                <li>You can request removal of saved data through the Packsmith operator before public launch.</li>
                <li>You can avoid cloud storage by using local export files only.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

function readLocalArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function DashboardPage() {
  const [session, setSession] = useState(null);
  const [cloudPacks, setCloudPacks] = useState([]);
  const [localPacks, setLocalPacks] = useState(() => readLocalArray("packsmith.saved.react"));
  const [waitlistLeads, setWaitlistLeads] = useState(() => readLocalArray("packsmith.waitlist"));
  const [analyticsEvents, setAnalyticsEvents] = useState(() => readLocalArray(analyticsEventsKey));
  const [cloudAnalyticsEvents, setCloudAnalyticsEvents] = useState([]);
  const [cloudAnalyticsStatus, setCloudAnalyticsStatus] = useState(isSupabaseConfigured ? "Login to load cloud events" : "Local-only mode");
  const [selectedId, setSelectedId] = useState("");
  const [notice, setNotice] = useState("");
  const user = session?.user || null;
  const cloudReady = isSupabaseConfigured;
  const history = useMemo(
    () => normalizePackHistory({ localPacks, cloudPacks }),
    [cloudPacks, localPacks],
  );
  const metrics = useMemo(
    () => buildDashboardMetrics({ history, waitlistLeads }),
    [history, waitlistLeads],
  );
  const analyticsSummary = useMemo(() => summarizeAnalyticsEvents(analyticsEvents), [analyticsEvents]);
  const cloudAnalyticsSummary = useMemo(() => summarizeAnalyticsEvents(cloudAnalyticsEvents), [cloudAnalyticsEvents]);
  const revenueFunnel = useMemo(() => buildRevenueFunnel(analyticsEvents), [analyticsEvents]);
  const cloudRevenueFunnel = useMemo(() => buildRevenueFunnel(cloudAnalyticsEvents), [cloudAnalyticsEvents]);
  const pricingExperiment = useMemo(
    () => buildPricingExperiment(analyticsEvents, aiAgencyPricing),
    [analyticsEvents],
  );
  const cloudPricingExperiment = useMemo(
    () => buildPricingExperiment(cloudAnalyticsEvents, aiAgencyPricing),
    [cloudAnalyticsEvents],
  );
  const selectedRow = history.find((row) => row.id === selectedId) || history[0] || null;
  const selectedPack = selectedRow?.raw || null;
  const selectedMarketingKit = useMemo(
    () => (selectedPack ? buildMarketingKit(selectedPack) : null),
    [selectedPack],
  );
  const exportChecklist = useMemo(
    () => buildPackExportChecklist(selectedPack || {}),
    [selectedPack],
  );
  const launchTracker = useMemo(
    () => buildLaunchTracker(selectedPack || {}),
    [selectedPack],
  );

  useEffect(() => {
    trackLocalAnalytics("viewed_dashboard_page", { page: "/dashboard" });
    setAnalyticsEvents(readLocalArray(analyticsEventsKey));
  }, []);

  useEffect(() => {
    if (!history.length) {
      setSelectedId("");
      return;
    }
    if (!history.some((row) => row.id === selectedId)) {
      setSelectedId(history[0].id);
    }
  }, [history, selectedId]);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    async function hydrateDashboard() {
      try {
        const nextSession = await getCurrentSession();
        setSession(nextSession);
        if (nextSession?.user) {
          await upsertProfile(nextSession.user);
          setCloudPacks(await listTemplatePacks(nextSession.user.id));
          const cloudEvents = await listAnalyticsEvents({ userId: nextSession.user.id });
          setCloudAnalyticsEvents(cloudEvents);
          setCloudAnalyticsStatus(`${cloudEvents.length} cloud events loaded`);
        }
      } catch {
        flash("Cloud history could not be loaded.");
      }
    }

    hydrateDashboard();
    return onAuthStateChange(async (nextSession) => {
      setSession(nextSession);
      try {
        if (nextSession?.user) {
          await upsertProfile(nextSession.user);
          setCloudPacks(await listTemplatePacks(nextSession.user.id));
          const cloudEvents = await listAnalyticsEvents({ userId: nextSession.user.id });
          setCloudAnalyticsEvents(cloudEvents);
          setCloudAnalyticsStatus(`${cloudEvents.length} cloud events loaded`);
        } else {
          setCloudPacks([]);
          setCloudAnalyticsEvents([]);
          setCloudAnalyticsStatus("Login to load cloud events");
        }
      } catch {
        setCloudPacks([]);
        setCloudAnalyticsEvents([]);
        setCloudAnalyticsStatus("Cloud analytics tables are not ready yet.");
        flash("Login worked, but saved pack tables are not ready yet.");
      }
    });
  }, []);

  function flash(message) {
    setNotice(message);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setNotice(""), 2800);
  }

  function refreshLocalHistory() {
    setLocalPacks(readLocalArray("packsmith.saved.react"));
    setWaitlistLeads(readLocalArray("packsmith.waitlist"));
    setAnalyticsEvents(readLocalArray(analyticsEventsKey));
    flash("Local history refreshed.");
  }

  async function refreshCloudHistory() {
    if (!cloudReady) {
      flash("Add Supabase env vars to enable cloud history.");
      return;
    }
    if (!user) {
      flash("Login with Google or Facebook to load cloud history.");
      return;
    }
    try {
      setCloudPacks(await listTemplatePacks(user.id));
      const cloudEvents = await listAnalyticsEvents({ userId: user.id });
      setCloudAnalyticsEvents(cloudEvents);
      setCloudAnalyticsStatus(`${cloudEvents.length} cloud events loaded`);
      flash("Cloud history refreshed.");
    } catch {
      flash("Cloud history failed. Check Supabase tables and policies.");
    }
  }

  async function handleSocialLogin(provider) {
    if (provider === "instagram") {
      flash("Create Instagram templates now; Instagram login needs Meta business OAuth setup next.");
      return;
    }
    try {
      await signInWithProvider(provider);
    } catch {
      flash(`${provider === "facebook" ? "Facebook" : "Google"} login needs Supabase env vars and OAuth setup.`);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setSession(null);
      setCloudPacks([]);
      setCloudAnalyticsEvents([]);
      setCloudAnalyticsStatus("Login to load cloud events");
      flash("Signed out.");
    } catch {
      flash("Sign out failed.");
    }
  }

  function exportDashboardSnapshot() {
    downloadFile(
      "packsmith-dashboard-snapshot.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          user: user ? { id: user.id, email: user.email } : null,
          metrics,
          revenueAnalytics: {
            summary: analyticsSummary,
            funnel: revenueFunnel,
            pricingExperiment,
            cloudSummary: cloudAnalyticsSummary,
            cloudFunnel: cloudRevenueFunnel,
            cloudPricingExperiment,
          },
          selectedPack: selectedPack?.name || null,
          history: history.map((row) => ({
            id: row.id,
            name: row.name,
            source: row.source,
            presetId: row.presetId,
            createdAt: row.createdAt,
            quality: row.quality,
            notionReady: row.notionReady,
          })),
        },
        null,
        2,
      ),
      "application/json",
    );
    trackLocalAnalytics("exported_dashboard_snapshot", { selectedPack: selectedPack?.name || null });
    flash("Dashboard snapshot exported.");
  }

  function exportLocalAnalytics() {
    const events = readLocalArray(analyticsEventsKey);
    downloadFile(
      "packsmith-local-analytics-events.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          summary: summarizeAnalyticsEvents(events),
          revenueFunnel: buildRevenueFunnel(events),
          pricingExperiment: buildPricingExperiment(events, aiAgencyPricing),
          cloudSummary: cloudAnalyticsSummary,
          cloudRevenueFunnel,
          cloudPricingExperiment,
          events,
          cloudEvents: cloudAnalyticsEvents,
        },
        null,
        2,
      ),
      "application/json",
    );
    trackLocalAnalytics("exported_local_analytics", { eventCount: events.length });
    flash("Local analytics exported.");
  }

  async function copyDashboardText(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
      trackLocalAnalytics("copied_dashboard_launch_asset", { message: successMessage });
      flash(successMessage);
    } catch {
      flash("Copy was blocked by the browser.");
    }
  }

  function exportDashboardLaunchStudio(kit = selectedMarketingKit, tracking = {}) {
    if (!selectedPack || !kit) {
      flash("Select a saved pack first.");
      return;
    }
    downloadFile(
      `packsmith-${slugify(selectedPack.name)}-launch-asset-studio.json`,
      JSON.stringify({ pack: selectedPack.name, launchAssetStudio: kit, actionTracking: tracking }, null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_dashboard_launch_asset_studio", { pack: selectedPack.name });
    flash("Launch Asset Studio exported.");
  }

  function exportDashboardFigmaSchema() {
    if (!selectedPack || !selectedMarketingKit) {
      flash("Select a saved pack first.");
      return;
    }
    downloadFile(
      `packsmith-${slugify(selectedPack.name)}-figma-export.json`,
      JSON.stringify(buildFigmaExportSchema(selectedPack, selectedMarketingKit), null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_dashboard_figma_json", { pack: selectedPack.name });
    flash("Preview plan downloaded.");
  }

  function openSelectedPackInForge() {
    if (!selectedRow) {
      flash("Select a saved pack first.");
      return;
    }
    trackLocalAnalytics("reopened_saved_pack", { pack: selectedRow.name, source: selectedRow.source });
    localStorage.setItem(forgeResumeKey, JSON.stringify(createForgeResumePayload(selectedRow)));
    window.location.href = "/app?resume=pack";
  }

  return (
    <main className="landingFrame dashboardFrame">
      <section className="dashboardHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Founder dashboard</span>
            </div>
          </a>
          <div className="navPills">
            <a href="/">Home</a>
            <a href="/launch">Launch kit</a>
            <a href="/plugins">Plugins</a>
            <a href="/api-console">API Console</a>
            <a href="/app">Forge</a>
            <a href="/mobile">Mobile</a>
            <a href="/privacy">Privacy</a>
            <SocialAuthButtons user={user} onLogin={handleSocialLogin} onSignOut={handleSignOut} />
          </div>
        </nav>

        <div className="dashboardHeroGrid">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow gold">Returning user workspace</p>
            <h1>Track every pack from idea to launch.</h1>
            <p>
              Saved packs, cloud history, export readiness, Notion status, and channel actions now live
              in one founder dashboard.
            </p>
            <div className="heroActions">
              <a href="/app">
                Build another pack
                <ArrowRight size={17} />
              </a>
              <button type="button" onClick={openSelectedPackInForge}>
                <Edit3 size={17} />
                Reopen selected pack
              </button>
              <button type="button" onClick={exportDashboardSnapshot}>
                <FileJson size={17} />
                Export snapshot
              </button>
            </div>
          </motion.div>

          <motion.div className="dashboardSignalPanel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="consoleHeader">
              <span />
              <span />
              <span />
              <strong>packsmith://history</strong>
            </div>
            <div className="dashboardMetricGrid">
              <article>
                <History size={20} />
                <strong>{metrics.totalPacks}</strong>
                <span>Total packs</span>
              </article>
              <article>
                <BarChart3 size={20} />
                <strong>{metrics.averageQuality || "--"}</strong>
                <span>Avg quality</span>
              </article>
              <article>
                <Database size={20} />
                <strong>{metrics.notionReady}</strong>
                <span>Notion-ready</span>
              </article>
              <article>
                <Rocket size={20} />
                <strong>{metrics.launchAssets}</strong>
                <span>Launch assets</span>
              </article>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="dashboardWorkspace">
        <aside className="dashboardRail">
          <section className="panel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">History</p>
                <h2>Saved packs</h2>
              </div>
              <button type="button" onClick={refreshLocalHistory}>
                <Clock3 size={16} />
                Refresh
              </button>
            </div>
            {history.length === 0 ? (
              <div className="emptyDashboardState">
                <Sparkles size={24} />
                <strong>No saved packs yet</strong>
                <p>Open the forge, generate a pack, and use Local save or Cloud save.</p>
                <a href="/app">Open forge</a>
              </div>
            ) : (
              <div className="historyList">
                {history.map((row) => (
                  <button
                    key={row.id}
                    className={selectedRow?.id === row.id ? "historyRow active" : "historyRow"}
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                  >
                    <span>{row.source}</span>
                    <strong>{row.name}</strong>
                    <small>{new Date(row.createdAt).toLocaleString()}</small>
                    <em>{row.quality ? `${row.quality}/100` : "No score"}</em>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panelHeader">
              <LockKeyhole size={18} />
              <div>
                <p className="eyebrow">Cloud sync</p>
                <h2>{cloudReady ? "Supabase path" : "Local mode"}</h2>
              </div>
            </div>
            <div className="dashboardCloudState">
              <span>{user ? user.email : fallbackCloudMessage("load saved history")}</span>
              <strong>{metrics.cloudPacks} cloud / {metrics.localPacks} local</strong>
            </div>
            <button className="wide" type="button" onClick={refreshCloudHistory}>
              <Database size={17} />
              Refresh cloud history
            </button>
          </section>
        </aside>

        <section className="dashboardMain">
          <section className="panel dashboardSelectedPack">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Selected pack</p>
                <h2>{selectedPack?.name || "No pack selected"}</h2>
              </div>
              <button className="panelLinkButton" type="button" onClick={openSelectedPackInForge}>
                Continue editing
                <ArrowRight size={16} />
              </button>
            </div>
            {selectedPack ? (
              <>
                <p>{selectedPack.promise || selectedPack.listing?.description}</p>
                <div className="selectedPackStats">
                  <article>
                    <strong>{selectedRow.quality || "--"}</strong>
                    <span>Quality</span>
                  </article>
                  <article>
                    <strong>{selectedRow.sectionCount}</strong>
                    <span>Surfaces</span>
                  </article>
                  <article>
                    <strong>{selectedRow.channelCount}</strong>
                    <span>Channels</span>
                  </article>
                  <article>
                    <strong>{selectedRow.notionReady ? "Ready" : "Draft"}</strong>
                    <span>Notion</span>
                  </article>
                </div>
              </>
            ) : (
              <p className="muted">Your dashboard will fill up after the first save.</p>
            )}
          </section>

          <section className="panel dashboardChecklistPanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Export readiness</p>
                <h2>What can ship now</h2>
              </div>
              <FileText size={22} />
            </div>
            <div className="dashboardChecklist">
              {exportChecklist.map((item) => (
                <article className={item.ready ? "ready" : ""} key={item.id}>
                  <CheckCircle2 size={18} />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel dashboardLaunchPanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Launch tracking</p>
                <h2>Channel actions</h2>
              </div>
              <Rocket size={22} />
            </div>
            {launchTracker.length ? (
              <div className="dashboardChannelGrid">
                {launchTracker.map((channel) => (
                  <article key={channel.id}>
                    <span>{channel.priority}</span>
                    <strong>{channel.name}</strong>
                    <p>{channel.status}</p>
                    <small>{channel.assetCount} assets / {channel.readiness}</small>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">Launch channels appear after selecting a saved pack.</p>
            )}
          </section>

          {selectedPack && selectedMarketingKit && (
            <LaunchAssetStudio
              compact
              pack={selectedPack}
              kit={selectedMarketingKit}
              onCopy={copyDashboardText}
              onExport={exportDashboardLaunchStudio}
              onFigmaExport={exportDashboardFigmaSchema}
            />
          )}
        </section>

        <aside className="dashboardRail">
          <section className="panel dashboardOpsPanel">
            <div className="panelHeader">
              <ShieldCheck size={18} />
              <div>
                <p className="eyebrow">Business ops</p>
                <h2>Today’s counters</h2>
              </div>
            </div>
            <div className="opsGrid">
              <article className="opsCard ready">
                <div>
                  <span>Waitlist</span>
                  <strong>{metrics.waitlistLeads}</strong>
                </div>
                <p>Local early-builder leads captured on homepage and launch page.</p>
              </article>
              <article className={cloudReady ? "opsCard ready" : "opsCard"}>
                <div>
                  <span>Auth</span>
                  <strong>{cloudReady ? "Ready" : "Setup"}</strong>
                </div>
                <p>{cloudReady ? "Google and Facebook login can be enabled from Supabase." : "Add Supabase env vars for login."}</p>
              </article>
              <article className="opsCard ready">
                <div>
                  <span>Privacy</span>
                  <strong>Live</strong>
                </div>
                <p>Dashboard exports avoid secrets and include only saved metadata.</p>
              </article>
            </div>
          </section>

          <section className="panel revenueFunnelPanel">
            <div className="panelHeader">
              <TrendingUp size={18} />
              <div>
                <p className="eyebrow">Revenue funnel</p>
                <h2>Drop-off map</h2>
              </div>
            </div>
            <div className="funnelList">
              {revenueFunnel.map((stage) => (
                <article key={stage.id}>
                  <div>
                    <strong>{stage.label}</strong>
                    <span>{stage.count} events</span>
                  </div>
                  <em>{stage.conversionFromPrevious}%</em>
                </article>
              ))}
            </div>
            <p className="privacyMicrocopy">
              Conversion shows each step against the previous step, so weak spots become obvious quickly.
            </p>
          </section>

          <section className="panel pricingExperimentPanel">
            <div className="panelHeader">
              <Gauge size={18} />
              <div>
                <p className="eyebrow">Pricing experiment</p>
                <h2>{pricingExperiment.totalClicks ? pricingExperiment.recommendedTier.name : "Collect clicks first"}</h2>
              </div>
            </div>
            <div className="recommendedPrice">
              <span>Recommended launch price</span>
              <strong>{pricingExperiment.totalClicks ? pricingExperiment.recommendedTier.price : "--"}</strong>
              <small>{pricingExperiment.totalClicks} Gumroad-intent clicks tracked</small>
            </div>
            <div className="pricingSignalList">
              {pricingExperiment.tiers.map((tier) => (
                <article key={tier.name}>
                  <div>
                    <strong>{tier.name}</strong>
                    <span>{tier.price}</span>
                  </div>
                  <div className="pricingSignalBar" aria-label={`${tier.name} click share ${tier.share}%`}>
                    <span style={{ width: `${tier.share}%` }} />
                  </div>
                  <em>{tier.clicks} clicks / {tier.share}%</em>
                </article>
              ))}
            </div>
            <p className="privacyMicrocopy">
              Start with intent clicks before checkout wiring, then replace placeholders with real Gumroad links.
            </p>
          </section>

          <section className="panel dashboardAnalyticsPanel">
            <div className="panelHeader">
              <BarChart3 size={18} />
              <div>
                <p className="eyebrow">Traction events</p>
                <h2>Local + cloud analytics</h2>
              </div>
            </div>
            <div className="analyticsModeGrid">
              <article>
                <span>Local</span>
                <strong>{analyticsSummary.total}</strong>
                <small>Browser events</small>
              </article>
              <article className={cloudReady ? "ready" : ""}>
                <span>Cloud</span>
                <strong>{cloudAnalyticsSummary.total}</strong>
                <small>{cloudAnalyticsStatus}</small>
              </article>
            </div>
            <div className="analyticsGrid">
              <article>
                <strong>{analyticsSummary.total}</strong>
                <span>Total</span>
              </article>
              <article>
                <strong>{analyticsSummary.pageViews}</strong>
                <span>Views</span>
              </article>
              <article>
                <strong>{analyticsSummary.exports}</strong>
                <span>Exports</span>
              </article>
              <article>
                <strong>{analyticsSummary.ctaClicks}</strong>
                <span>CTA clicks</span>
              </article>
              <article>
                <strong>{analyticsSummary.copies}</strong>
                <span>Copies</span>
              </article>
              <article>
                <strong>{analyticsSummary.reopens}</strong>
                <span>Reopens</span>
              </article>
            </div>
            <div className="cloudAnalyticsStrip">
              <span>Cloud funnel</span>
              <strong>{cloudRevenueFunnel.at(-1)?.conversionFromStart || 0}% to revenue brief</strong>
              <small>
                {cloudAnalyticsSummary.ctaClicks} CTA clicks / {cloudAnalyticsSummary.exports} exports / {cloudPricingExperiment.totalClicks} pricing clicks
              </small>
            </div>
            <button className="wide" type="button" onClick={exportLocalAnalytics}>
              <Download size={17} />
              Export analytics
            </button>
            <p className="privacyMicrocopy">
              Cloud upload is metadata-only when Supabase is configured. No API tokens, OAuth secrets, payment data, or generated payload bodies are stored in analytics.
            </p>
          </section>

          <section className="panel dashboardNextPanel">
            <div className="panelHeader">
              <Target size={18} />
              <div>
                <p className="eyebrow">Next revenue step</p>
                <h2>Founder focus</h2>
              </div>
            </div>
            <ol>
              <li>Save one polished AI Agency pack to cloud.</li>
              <li>Export Gumroad listing and launch calendar.</li>
              <li>Publish one LinkedIn post with product screenshots.</li>
              <li>Invite five beta users and track their packs here.</li>
            </ol>
          </section>
        </aside>
      </section>

      {notice && (
        <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {notice}
        </motion.div>
      )}
    </main>
  );
}

function MobileAccessPage() {
  const [notice, setNotice] = useState("");
  const checklist = useMemo(
    () => buildMobileAccessChecklist({ hasSupabase: isSupabaseConfigured, hasNotionParent: false }),
    [],
  );
  const assistantPrompt = useMemo(() => buildAssistantHandoffPrompt("a Packsmith-generated template pack"), []);

  useEffect(() => {
    trackLocalAnalytics("viewed_mobile_page", { page: "/mobile" });
  }, []);

  function flash(message) {
    setNotice(message);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setNotice(""), 2800);
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(assistantPrompt);
      trackLocalAnalytics("copied_mobile_assistant_prompt", { page: "/mobile" });
      flash("Assistant handoff prompt copied.");
    } catch {
      flash("Copy was blocked by the browser.");
    }
  }

  return (
    <main className="landingFrame mobileFrame">
      <section className="mobileHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <Smartphone size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Mobile access</span>
            </div>
          </a>
          <div className="navPills">
            <a href="/">Home</a>
            <a href="/ai-agency-launch-kit">AI Agency Kit</a>
            <a href="/app">Forge</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/plugins">Plugins</a>
            <a href="/launch">Launch kit</a>
            <a href="/privacy">Privacy</a>
          </div>
        </nav>

        <div className="mobileHeroGrid">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow gold">Phone, tablet, Notion, assistants</p>
            <h1>Use Packsmith anywhere your template business happens.</h1>
            <p>
              Start with the mobile web app and PWA path. Use tablets for deeper editing, Notion mobile
              after publish, and Claude or ChatGPT through clean exports.
            </p>
            <div className="heroActions">
              <a href="/app">
                Try on this device
                <ArrowRight size={17} />
              </a>
              <button type="button" onClick={copyPrompt}>
                <Clipboard size={17} />
                Copy assistant prompt
              </button>
            </div>
          </motion.div>

          <motion.div className="mobileDevicePreview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="phoneShell">
              <div className="phoneSpeaker" />
              <article>
                <span>Packsmith mobile</span>
                <strong>Dashboard</strong>
                <p>Saved packs, quality score, exports, launch channels.</p>
              </article>
              <article>
                <span>Notion handoff</span>
                <strong>Publish path</strong>
                <p>Simulate first, then open created pages in Notion mobile.</p>
              </article>
              <article>
                <span>Assistant handoff</span>
                <strong>Markdown + JSON</strong>
                <p>Claude and ChatGPT get clean context, not screenshots.</p>
              </article>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landingSection mobileAccessSection">
        <div className="sectionIntro">
          <p className="eyebrow">Access modes</p>
          <h2>Ship the mobile web app first. Keep native app as the second bet.</h2>
        </div>
        <div className="mobileModeGrid">
          {mobileAccessModes.map((mode) => (
            <article key={mode.id}>
              <div>
                <TabletSmartphone size={22} />
                <span>{mode.status}</span>
              </div>
              <h3>{mode.label}</h3>
              <strong>{mode.device}</strong>
              <p>{mode.promise}</p>
              <ul>
                {mode.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection mobileAccessSection">
        <div className="sectionIntro">
          <p className="eyebrow">Readiness</p>
          <h2>What is already accessible, and what needs backend setup.</h2>
        </div>
        <div className="mobileChecklistGrid">
          {checklist.map((item) => (
            <article className={item.ready ? "ready" : ""} key={item.id}>
              <CheckCircle2 size={18} />
              <div>
                <strong>{item.label}</strong>
                <span>{item.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection nativeDecisionPanel">
        <div>
          <p className="eyebrow">Native app decision</p>
          <h2>{nativeAppDecision.recommendation}</h2>
          <p>{nativeAppDecision.reason}</p>
        </div>
        <div>
          <h3>Build native when these signals show up</h3>
          <ul>
            {nativeAppDecision.nativeTriggers.map((trigger) => (
              <li key={trigger}>{trigger}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landingSection assistantPromptPanel">
        <div className="sectionIntro">
          <p className="eyebrow">Claude / ChatGPT prompt</p>
          <h2>Use exports as assistant context.</h2>
        </div>
        <article>
          <p>{assistantPrompt}</p>
          <button className="primary" type="button" onClick={copyPrompt}>
            <Clipboard size={17} />
            Copy prompt
          </button>
        </article>
      </section>

      {notice && (
        <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {notice}
        </motion.div>
      )}
    </main>
  );
}

function PlatformExpansionPage() {
  const [notice, setNotice] = useState("");
  const summary = useMemo(() => buildPlatformExpansionSummary(platformExpansionPaths), []);

  useEffect(() => {
    trackLocalAnalytics("viewed_platform_expansion_page", { page: window.location.pathname });
  }, []);

  function flash(message) {
    setNotice(message);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setNotice(""), 2800);
  }

  function exportPlatformPlan() {
    downloadFile(
      "packsmith-platform-expansion-plan.md",
      buildPlatformExpansionMarkdown(platformExpansionPaths),
      "text/markdown",
    );
    trackLocalAnalytics("exported_platform_expansion_plan", { platformCount: platformExpansionPaths.length });
    flash("Plugin roadmap exported.");
  }

  return (
    <main className="landingFrame platformFrame">
      <section className="platformHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <Boxes size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Plugin roadmap</span>
            </div>
          </a>
          <div className="navPills">
            <a href="/">Home</a>
            <a href="/ai-agency-launch-kit">AI Agency Kit</a>
            <a href="/launch">Launch kit</a>
            <a href="/api-console">Developer console</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/mobile">Mobile</a>
            <a href="/app">Forge</a>
          </div>
        </nav>

        <div className="platformHeroGrid">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow gold">Plugin and assistant strategy</p>
            <h1>Let users create Packsmith packs from the tools they already trust.</h1>
            <p>
              The web app is the home base. Plugins and assistants are the reach: ChatGPT and Claude for ideas,
              Adobe Express and Canva/Figma for creative output, Notion and Gumroad-style flows for publishing.
            </p>
            <div className="heroActions">
              <a href="/app">
                Build in forge
                <Sparkles size={17} />
              </a>
              <button type="button" onClick={exportPlatformPlan}>
                <Download size={17} />
                Export plugin roadmap
              </button>
            </div>
          </motion.div>

          <motion.div className="platformSignalPanel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="consoleHeader">
              <span />
              <span />
              <span />
              <strong>packsmith://plugins</strong>
            </div>
            <div className="platformSummaryGrid">
              <article>
                <strong>{summary.total}</strong>
                <span>Plugin paths</span>
              </article>
              <article>
                <strong>{summary.averageReadiness}</strong>
                <span>Avg readiness</span>
              </article>
              <article>
                <strong>{summary.firstWave.length}</strong>
                <span>First wave</span>
              </article>
            </div>
            <p>{summary.recommendation}</p>
          </motion.div>
        </div>
      </section>

      <section className="landingSection platformWaveSection">
        <div className="sectionIntro">
          <p className="eyebrow">Execution order</p>
          <h2>Start where users already describe, design, and sell.</h2>
        </div>
        <div className="platformWaveGrid">
          <article>
            <span>First</span>
            <strong>{summary.firstWave.join(" + ")}</strong>
            <p>Best for word of mouth because users can generate and refine packs inside everyday AI tools.</p>
          </article>
          <article>
            <span>Second</span>
            <strong>{summary.secondWave.join(" + ")}</strong>
            <p>Best for turning Packsmith outputs into social visuals, decks, and marketplace previews.</p>
          </article>
          <article>
            <span>Later</span>
            <strong>{summary.laterWave.join(" + ")}</strong>
            <p>Useful, but heavier review, permissions, and support surface make them later bets.</p>
          </article>
        </div>
      </section>

      <section className="landingSection platformPathSection">
        <div className="sectionIntro">
          <p className="eyebrow">Plugin map</p>
          <h2>Each plugin should remove one more piece of work for the user.</h2>
        </div>
        <div className="platformPathGrid">
          {platformExpansionPaths.map((path) => (
            <article key={path.id} className={`platformPathCard ${path.priority.toLowerCase()}`}>
              <div className="platformCardHeader">
                <div>
                  <span>{path.priority} wave</span>
                  <h3>{path.platform}</h3>
                </div>
                <strong>{path.readiness}</strong>
              </div>
              <p className="platformLane">{path.lane}</p>
              <p>{path.productIdea}</p>
              <div className="platformReadinessBar" aria-label={`${path.platform} readiness ${path.readiness}`}>
                <i style={{ width: `${path.readiness}%` }} />
              </div>
              <ul>
                {path.mvpActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
              <div className="platformBoundary">
                <strong>Security</strong>
                <span>{path.dataBoundary}</span>
              </div>
              <div className="platformBoundary">
                <strong>Revenue</strong>
                <span>{path.monetization}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {notice && (
        <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {notice}
        </motion.div>
      )}
    </main>
  );
}

function ApiConsolePage() {
  const [notice, setNotice] = useState("");
  const consoleModel = useMemo(() => buildApiConsoleModel(), []);

  useEffect(() => {
    trackLocalAnalytics("viewed_api_console_page", { page: "/api-console" });
  }, []);

  function flash(message) {
    setNotice(message);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setNotice(""), 2800);
  }

  function exportOpenApiSpec() {
    downloadFile(
      "packsmith-openapi.json",
      JSON.stringify(consoleModel.openApiSpec, null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_packsmith_openapi", { routeCount: consoleModel.routes.length });
    flash("OpenAPI schema exported.");
  }

  function exportActionSamples() {
    downloadFile(
      "packsmith-chatgpt-action-samples.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          baseUrl: consoleModel.baseUrl,
          instructions: consoleModel.instructions,
          samples: consoleModel.samples,
          securityChecklist: consoleModel.securityChecklist,
        },
        null,
        2,
      ),
      "application/json",
    );
    trackLocalAnalytics("exported_chatgpt_action_samples", { sampleCount: consoleModel.samples.length });
    flash("Action samples exported.");
  }

  async function copyStarterPrompt() {
    try {
      await navigator.clipboard.writeText(consoleModel.instructions.starterPrompt);
      trackLocalAnalytics("copied_chatgpt_action_prompt", { page: "/api-console" });
      flash("ChatGPT starter prompt copied.");
    } catch {
      flash("Copy was blocked by the browser.");
    }
  }

  return (
    <main className="landingFrame apiConsoleFrame">
      <section className="apiConsoleHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <FileJson size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>API console</span>
            </div>
          </a>
          <div className="navPills">
            <a href="/">Home</a>
            <a href="/plugins">Plugins</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/app">Forge</a>
            <a href="/launch">Launch kit</a>
          </div>
        </nav>

        <div className="apiConsoleHeroGrid">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow gold">ChatGPT Action spec</p>
            <h1>Turn Packsmith into an assistant action surface.</h1>
            <p>
              Export the OpenAPI contract, test safe example payloads, and use the starter prompt to create
              a Custom GPT that can generate template packs and marketplace-ready assets.
            </p>
            <div className="heroActions">
              <button type="button" onClick={exportOpenApiSpec}>
                <Download size={17} />
                Export OpenAPI
              </button>
              <button type="button" onClick={exportActionSamples}>
                <FileJson size={17} />
                Export samples
              </button>
              <button type="button" onClick={copyStarterPrompt}>
                <Clipboard size={17} />
                Copy GPT prompt
              </button>
            </div>
          </motion.div>

          <motion.div className="apiConsolePanel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="consoleHeader">
              <span />
              <span />
              <span />
              <strong>packsmith://openapi</strong>
            </div>
            <div className="apiSignalGrid">
              <article>
                <strong>{consoleModel.routes.length}</strong>
                <span>Routes</span>
              </article>
              <article>
                <strong>{consoleModel.samples.length}</strong>
                <span>Samples</span>
              </article>
              <article>
                <strong>0</strong>
                <span>Secrets</span>
              </article>
            </div>
            <p>{consoleModel.instructions.summary}</p>
          </motion.div>
        </div>
      </section>

      <section className="landingSection apiRouteSection">
        <div className="sectionIntro">
          <p className="eyebrow">Contract routes</p>
          <h2>One API surface for ChatGPT, Claude, and future plugin stores.</h2>
        </div>
        <div className="apiRouteGrid">
          {consoleModel.routes.map((route) => (
            <article key={route.id}>
              <span>{route.auth} auth</span>
              <h3>{route.id}</h3>
              <code>{route.method} {route.path}</code>
              <p>{route.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection chatGptSetupSection">
        <div className="sectionIntro">
          <p className="eyebrow">Custom GPT setup</p>
          <h2>Use this as the founder checklist for the ChatGPT Action.</h2>
        </div>
        <div className="chatGptSetupGrid">
          <article>
            <span>Steps</span>
            <ol>
              {consoleModel.instructions.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
          <article>
            <span>Auth and security</span>
            <ul>
              {consoleModel.instructions.authNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
          <article className="promptCard">
            <span>Starter prompt</span>
            <p>{consoleModel.instructions.starterPrompt}</p>
            <button type="button" onClick={copyStarterPrompt}>
              <Clipboard size={17} />
              Copy prompt
            </button>
          </article>
        </div>
      </section>

      <section className="landingSection apiSamplesSection">
        <div className="sectionIntro">
          <p className="eyebrow">Safe examples</p>
          <h2>Sample requests and responses avoid secrets and payment data.</h2>
        </div>
        <div className="apiSamplesGrid">
          {consoleModel.samples.map((sample) => (
            <article key={sample.id}>
              <span>{sample.routeId}</span>
              <h3>{sample.label}</h3>
              <div className="sampleCodeGrid">
                <div>
                  <strong>Request</strong>
                  <pre>{JSON.stringify(sample.request, null, 2)}</pre>
                </div>
                <div>
                  <strong>Response</strong>
                  <pre>{JSON.stringify(sample.response, null, 2)}</pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landingSection apiSecuritySection">
        <div className="sectionIntro">
          <p className="eyebrow">Security baseline</p>
          <h2>The action starts public for generation, private for save and publish.</h2>
        </div>
        <div className="securityChecklistGrid">
          {consoleModel.securityChecklist.map((item) => (
            <article key={item}>
              <ShieldCheck size={18} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      {notice && (
        <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {notice}
        </motion.div>
      )}
    </main>
  );
}

function ForgeApp() {
  const [activePresetId, setActivePresetId] = useState(defaultPresetId);
  const activePreset = getPreset(activePresetId);
  const [brief, setBrief] = useState(activePreset.brief);
  const [customBrief, setCustomBrief] = useState(initialCustomBrief);
  const [generatedPack, setGeneratedPack] = useState(null);
  const [generatedNotionExport, setGeneratedNotionExport] = useState(null);
  const [activeSection, setActiveSection] = useState("notion");
  const [activeChannel, setActiveChannel] = useState("gumroad");
  const [connection, setConnection] = useState({ parentPageId: "" });
  const [editedItems, setEditedItems] = useState({});
  const [designStage, setDesignStage] = useState(defaultDesignStage);
  const [notice, setNotice] = useState("");
  const [guideOpen, setGuideOpen] = useState(true);
  const [activeGuideStep, setActiveGuideStep] = useState(forgeGuideSteps[0].id);
  const [productWorkStatus, setProductWorkStatus] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(productWorkQueueKey) || "{}");
    } catch {
      return {};
    }
  });
  const [session, setSession] = useState(null);
  const [cloudPacks, setCloudPacks] = useState([]);
  const [publishResult, setPublishResult] = useState(null);
  const [savedPacks, setSavedPacks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("packsmith.saved.react") || "[]");
    } catch {
      return [];
    }
  });
  const user = session?.user || null;
  const cloudReady = isSupabaseConfigured;
  const cloudEnabled = cloudReady && user;

  const pack = useMemo(
    () => generatedPack || buildLaunchKit(brief, activePresetId),
    [activePresetId, brief, generatedPack],
  );
  const editScopeId = pack.presetId || pack.id;
  const notionExport = useMemo(
    () => generatedNotionExport || buildNotionExport(pack),
    [generatedNotionExport, pack],
  );
  const notionPayload = useMemo(
    () => createNotionPayload(notionExport, { parentPageId: connection.parentPageId }),
    [connection.parentPageId, notionExport],
  );
  const notionSimulation = useMemo(
    () => simulateNotionPublish(notionExport, { parentPageId: connection.parentPageId }),
    [connection.parentPageId, notionExport],
  );
  const notionPublishReveal = useMemo(() => {
    const livePages = publishResult?.createdPageIds || [];
    const liveDatabases = publishResult?.createdDatabaseIds || [];
    const pages = publishResult
      ? livePages.map((item) => ({
          name: typeof item === "string" ? "Published page" : item.name || "Published page",
          id: typeof item === "string" ? item : item.id,
        }))
      : notionSimulation.createdPreview.pages.map((name) => ({ name, id: "simulation" }));
    const databases = publishResult
      ? liveDatabases.map((item) => ({
          name: typeof item === "string" ? "Published database" : item.name || "Published database",
          id: typeof item === "string" ? item : item.id,
        }))
      : notionSimulation.createdPreview.databases.map((database) => ({
          name: database.name,
          id: `${database.properties} properties / ${database.sampleRecords} records`,
        }));

    return {
      mode: publishResult ? "Live response" : "Simulation",
      status: publishResult?.status || notionSimulation.status,
      parentPage: notionSimulation.createdPreview.parentPage,
      pages,
      databases,
      errors: publishResult?.errors || [],
    };
  }, [notionSimulation, publishResult]);
  const launchCalendar = useMemo(() => buildLaunchCalendar(pack), [pack]);
  const marketingKit = useMemo(() => buildMarketingKit(pack), [pack]);
  const figmaPreviewSchema = useMemo(() => buildFigmaExportSchema(pack, marketingKit), [pack, marketingKit]);
  const packCoverSvg = useMemo(() => buildPackCoverSvg(pack), [pack]);
  const designStageModel = useMemo(() => buildDesignStageModel(pack, designStage), [designStage, pack]);
  const assistantSkillKit = useMemo(() => buildAssistantSkillPack(pack), [pack]);
  const founderPlan = useMemo(() => buildFounderPriorityPlan(pack), [pack]);
  const productWorkQueue = useMemo(() => buildProductWorkQueue(pack), [pack]);
  const productWorkProgress = useMemo(() => {
    const doneCount = productWorkQueue.filter((item) => productWorkStatus[item.id] ?? item.defaultDone).length;
    return {
      doneCount,
      total: productWorkQueue.length,
      percent: productWorkQueue.length ? Math.round((doneCount / productWorkQueue.length) * 100) : 0,
    };
  }, [productWorkQueue, productWorkStatus]);
  const activePricingLadder = nichePricingLadders[pack.presetId || pack.id] || nichePricingLadders.custom;
  const activeGuide = forgeGuideSteps.find((step) => step.id === activeGuideStep) || forgeGuideSteps[0];
  const setupChecklist = useMemo(
    () => [
      {
        label: "Supabase env",
        status: cloudReady ? "Ready" : "Local fallback",
        ready: cloudReady,
        detail: cloudReady ? "Cloud features can initialize." : "Add VITE_SUPABASE_URL and anon key.",
      },
      {
        label: "Social login",
        status: user ? "Connected" : "Try-first mode",
        ready: Boolean(user),
        detail: user ? user.email : "Login is only required for cloud save and publish.",
      },
      {
        label: "Local data controls",
        status: "Ready",
        ready: true,
        detail: "Users can export or clear browser-stored Packsmith data.",
      },
      {
        label: "Privacy notice",
        status: "Live",
        ready: true,
        detail: `Consent version ${privacyVersion} is shown on waitlist forms.`,
      },
      {
        label: "Notion parent",
        status: connection.parentPageId ? "Provided" : "Missing",
        ready: Boolean(connection.parentPageId),
        detail: connection.parentPageId ? "Ready for Edge Function publish attempt." : "Paste a parent page ID.",
      },
      {
        label: "Notion secret",
        status: "Server-side",
        ready: cloudReady,
        detail: "Set NOTION_TOKEN in Supabase Edge Function secrets before live publish.",
      },
    ],
    [cloudReady, connection.parentPageId, user],
  );
  const selectedSection = pack.sections.find((section) => section.id === activeSection) || pack.sections[0];
  const selectedSectionLabel = creatorOutputLabels[selectedSection.id] || {
    friendly: selectedSection.label,
    action: "Review this output",
    buyerView: selectedSection.summary,
  };
  const selectedItems = editedItems[editScopeId]?.[selectedSection.id] || selectedSection.items;
  const selectedChannel =
    pack.launchChannels.find((channel) => channel.id === activeChannel) || pack.launchChannels[0];
  const SelectedIcon = sectionIcons[selectedSection.id] || Boxes;

  useEffect(() => {
    trackLocalAnalytics("viewed_forge_page", { page: "/app" });
  }, []);

  useEffect(() => {
    const rawResume = localStorage.getItem(forgeResumeKey);
    if (!rawResume) return;

    localStorage.removeItem(forgeResumeKey);

    try {
      const resume = JSON.parse(rawResume);
      if (!resume?.pack?.sections?.length) {
        flash("Saved pack could not be reopened.");
        return;
      }

      const restoredPack = resume.pack;
      const restoredPresetId = resume.presetId || restoredPack.presetId || restoredPack.id || "custom";
      const restoredScopeId = restoredPack.presetId || restoredPack.id || restoredPresetId;
      const restoresKnownPreset = Boolean(nichePresets[restoredPresetId]);
      const restoresCustomPack = restoredPresetId === "custom" || !restoresKnownPreset;
      const firstSection = restoredPack.sections[0]?.id || "notion";
      const firstChannel = restoredPack.launchChannels?.[0]?.id || "gumroad";
      const parentPageId = resume.notionPayload?.parentPageId || "";

      setActivePresetId(restoresCustomPack ? "custom" : restoredPresetId);
      setBrief(resume.brief || (restoresKnownPreset ? getPreset(restoredPresetId).brief : activePreset.brief));
      setGeneratedPack(restoresCustomPack ? restoredPack : null);
      setGeneratedNotionExport(
        restoresCustomPack ? buildCustomNotionExport(restoredPack) : null,
      );
      setEditedItems((current) => ({
        ...current,
        [restoredScopeId]: restoredPack.editedItems || current[restoredScopeId] || {},
      }));
      setActiveSection(firstSection);
      setActiveChannel(firstChannel);
      setConnection((current) => ({
        ...current,
        parentPageId: parentPageId === "notion-parent-page-id" ? "" : parentPageId,
      }));
      flash(`Reopened ${restoredPack.name}.`);
    } catch {
      flash("Saved pack could not be reopened.");
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    async function hydrateSession() {
      try {
        const nextSession = await getCurrentSession();
        setSession(nextSession);
        if (nextSession?.user) {
          await upsertProfile(nextSession.user);
          const rows = await listTemplatePacks(nextSession.user.id);
          setCloudPacks(rows);
        }
      } catch {
        flash("Cloud session could not be loaded.");
      }
    }

    hydrateSession();
    return onAuthStateChange(async (nextSession) => {
      setSession(nextSession);
      try {
        if (nextSession?.user) {
          await upsertProfile(nextSession.user);
          const rows = await listTemplatePacks(nextSession.user.id);
          setCloudPacks(rows);
        } else {
          setCloudPacks([]);
        }
      } catch {
        setCloudPacks([]);
        flash("Login worked, but cloud tables are not ready yet.");
      }
    });
  }, []);

  function selectPreset(presetId) {
    const preset = getPreset(presetId);
    setGeneratedPack(null);
    setGeneratedNotionExport(null);
    setActivePresetId(presetId);
    setBrief(preset.brief);
    setActiveSection("notion");
    setActiveChannel("gumroad");
  }

  function scrollToForge() {
    document.getElementById("forge-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToPanel(selector) {
    window.requestAnimationFrame(() => {
      document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function startGuidedMode() {
    setGuideOpen(true);
    setActiveGuideStep("brief");
    scrollToForge();
    flash("Guided walkthrough opened.");
  }

  function startInstagramPack() {
    selectPreset("instagramCreator");
    setActiveChannel("instagram");
    setActiveGuideStep("price");
    setGuideOpen(true);
    scrollToForge();
    flash("Instagram Growth Studio loaded with INR pricing.");
  }

  function updateBrief(field, value) {
    setBrief((current) => ({ ...current, [field]: value }));
  }

  function updateDesignStage(field, value) {
    setDesignStage((current) => ({ ...current, [field]: value }));
  }

  function applyDesignDirection() {
    updateBrief("visualDirection", designStageModel.visualDirection);
    trackLocalAnalytics("applied_design_stage", {
      pack: pack.name,
      format: designStageModel.format.id,
      mood: designStageModel.mood.id,
      tone: designStageModel.tone.id,
    });
    flash("Design direction applied to the pack.");
  }

  function toggleProductWorkItem(item) {
    const nextValue = !(productWorkStatus[item.id] ?? item.defaultDone);
    setProductWorkStatus((current) => {
      const next = { ...current, [item.id]: nextValue };
      localStorage.setItem(productWorkQueueKey, JSON.stringify(next));
      return next;
    });
    trackLocalAnalytics("updated_product_work_queue", {
      pack: pack.name,
      itemId: item.id,
      done: nextValue,
    });
    flash(`${item.label} marked ${nextValue ? "done" : "open"}.`);
  }

  function completeProductWorkItem(item) {
    setProductWorkStatus((current) => {
      const next = { ...current, [item.id]: true };
      localStorage.setItem(productWorkQueueKey, JSON.stringify(next));
      return next;
    });
  }

  function recordProductWorkRun(item, action) {
    const event = {
      id: `${item.id}-${Date.now()}`,
      itemId: item.id,
      label: item.label,
      action,
      pack: pack.name,
      presetId: pack.presetId || pack.id,
      createdAt: new Date().toISOString(),
    };
    try {
      const current = JSON.parse(localStorage.getItem(productWorkRunsKey) || "[]");
      const safeCurrent = Array.isArray(current) ? current : [];
      localStorage.setItem(productWorkRunsKey, JSON.stringify([event, ...safeCurrent].slice(0, 80)));
    } catch {
      localStorage.setItem(productWorkRunsKey, JSON.stringify([event]));
    }
    trackLocalAnalytics("ran_product_work_item", event);
  }

  async function runProductWorkItem(item) {
    if (item.id === "design-proof") {
      const nextDesignStage = {
        ...designStage,
        formatId: "gumroad-cover",
        moodId: designStage.moodId || "retro-forge",
        toneId: designStage.toneId || "friendly-creator",
      };
      const nextModel = buildDesignStageModel(pack, nextDesignStage);
      setDesignStage(nextDesignStage);
      updateBrief("visualDirection", nextModel.visualDirection);
      scrollToPanel(".designStagePanel");
      await copyText(nextModel.prompt, "Design proof prompt copied.");
      completeProductWorkItem(item);
      recordProductWorkRun(item, "prepared_design_stage_and_copied_prompt");
      return;
    }

    if (item.id === "market-proof") {
      const marketChannel =
        pack.launchChannels.find((channel) => /linkedin|x/i.test(`${channel.id} ${channel.name}`)) ||
        pack.launchChannels[0];
      setActiveChannel(marketChannel.id);
      scrollToPanel(".marketingPanel");
      await copyText(marketChannel.launchPost, `${marketChannel.name} proof post copied.`);
      completeProductWorkItem(item);
      recordProductWorkRun(item, "selected_marketing_channel_and_copied_post");
      return;
    }

    if (item.id === "revenue-proof") {
      const gumroadChannel =
        pack.launchChannels.find((channel) => /gumroad/i.test(`${channel.id} ${channel.name}`)) ||
        pack.launchChannels[0];
      setActiveChannel(gumroadChannel.id);
      scrollToPanel(".launchBoard");
      await copyText(
        `${pack.listing.title}\n\n${pack.listing.description}\n\nSuggested INR price: ${pack.suggestedPrice}`,
        "Revenue validation copy copied.",
      );
      completeProductWorkItem(item);
      recordProductWorkRun(item, "selected_revenue_channel_and_copied_listing");
      return;
    }

    if (item.id === "real-ai-route") {
      setGuideOpen(true);
      setActiveGuideStep("brief");
      scrollToPanel(".generatorPanel");
      completeProductWorkItem(item);
      recordProductWorkRun(item, "opened_custom_generator_for_provider_ready_flow");
      flash("Custom generator opened. Use this same surface for the real AI route next.");
      return;
    }

    if (item.id === "notion-publish") {
      setActiveSection("notion");
      scrollToPanel(".notionPanel");
      await copyText(
        `Packsmith Notion publish prep\n\nParent page needed: yes\nWorkspace pages: ${notionExport.pages.length}\nTrackers: ${notionExport.databases.length}\nSecurity: token stays server-side; do not paste Notion secrets into the browser.`,
        "Notion publish prep copied.",
      );
      completeProductWorkItem(item);
      recordProductWorkRun(item, "opened_notion_panel_and_copied_publish_prep");
      return;
    }

    if (item.id === "assistant-beta") {
      scrollToPanel(".assistantSkillPanel");
      await copyText(assistantSkillKit.prompts.chatgptPrompt, "Assistant beta instructions copied.");
      completeProductWorkItem(item);
      recordProductWorkRun(item, "opened_assistant_kit_and_copied_chatgpt_prompt");
      return;
    }

    await copyText(
      `${item.label}\n\nAction: ${item.action}\nSuccess metric: ${item.successMetric}`,
      "Next action copied.",
    );
    completeProductWorkItem(item);
    recordProductWorkRun(item, "copied_generic_next_action");
  }

  function updateCustomBrief(field, value) {
    setCustomBrief((current) => ({ ...current, [field]: value }));
  }

  function togglePlatform(platform, target = "brief") {
    const setter = target === "custom" ? setCustomBrief : setBrief;
    setter((current) => {
      const hasPlatform = current.platforms.includes(platform);
      const nextPlatforms = hasPlatform
        ? current.platforms.filter((item) => item !== platform)
        : [...current.platforms, platform];
      return { ...current, platforms: nextPlatforms.length ? nextPlatforms : [platform] };
    });
    setActiveSection(platformIds[platform] || "notion");
  }

  function generateCustomPack() {
    const nextPack = buildCustomPack(customBrief);
    setGeneratedPack(nextPack);
    setGeneratedNotionExport(buildCustomNotionExport(nextPack));
    setActivePresetId("custom");
    setActiveSection("notion");
    setActiveChannel("gumroad");
    flash("Custom local pack generated.");
  }

  function markPricingTier(tier) {
    trackLocalAnalytics("pricing_tier_reviewed", {
      pack: pack.name,
      presetId: pack.presetId || pack.id,
      tier: tier.name,
      price: tier.price,
    });
    flash(`${tier.name} at ${tier.price} marked for validation.`);
  }

  function updateGeneratedItem(sectionId, index, value) {
    setEditedItems((current) => {
      const scopeEdits = current[editScopeId] || {};
      const baseItems =
        scopeEdits[sectionId] || pack.sections.find((section) => section.id === sectionId)?.items || [];
      const nextItems = [...baseItems];
      nextItems[index] = value;
      return {
        ...current,
        [editScopeId]: {
          ...scopeEdits,
          [sectionId]: nextItems,
        },
      };
    });
  }

  function flash(message) {
    setNotice(message);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setNotice(""), 2800);
  }

  async function copyText(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
      trackLocalAnalytics("copied_forge_asset", { pack: pack.name, message: successMessage });
      flash(successMessage);
    } catch {
      flash("Copy was blocked by the browser.");
    }
  }

  function savePack() {
    const nextPack = {
      ...pack,
      brief,
      editedItems: editedItems[editScopeId] || {},
      notionPayload,
      savedAt: new Date().toISOString(),
    };
    const nextSaved = [nextPack, ...savedPacks].slice(0, 8);
    setSavedPacks(nextSaved);
    localStorage.setItem("packsmith.saved.react", JSON.stringify(nextSaved));
    trackLocalAnalytics("saved_pack_local", { pack: pack.name, presetId: pack.presetId || pack.id });
    flash("Pack saved locally.");
  }

  function exportLocalData() {
    const waitlist = JSON.parse(localStorage.getItem("packsmith.waitlist") || "[]");
    downloadFile(
      "packsmith-local-data-export.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          privacyVersion,
          savedPacks,
          waitlist,
          activeDraft: {
            pack: pack.name,
            presetId: pack.presetId || pack.id,
            editedItems: editedItems[editScopeId] || {},
          },
        },
        null,
        2,
      ),
      "application/json",
    );
    trackLocalAnalytics("exported_local_data", { pack: pack.name });
    flash("Local data exported.");
  }

  function clearLocalData() {
    localStorage.removeItem("packsmith.saved.react");
    localStorage.removeItem("packsmith.waitlist");
    setSavedPacks([]);
    flash("Local Packsmith data cleared from this browser.");
  }

  function exportCloudSummary() {
    downloadFile(
      "packsmith-cloud-summary.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          user: user ? { id: user.id, email: user.email } : null,
          cloudReady,
          cloudPackCount: cloudPacks.length,
          cloudPacks: cloudPacks.map((saved) => ({
            id: saved.id,
            name: saved.name,
            presetId: saved.preset_id,
            createdAt: saved.created_at,
          })),
        },
        null,
        2,
      ),
      "application/json",
    );
    flash(user ? "Cloud summary exported." : "Cloud summary exported in local mode.");
  }

  async function savePackToCloud() {
    if (!cloudReady) {
      flash("Add Supabase env vars to enable social login and cloud save.");
      return;
    }
    if (!user) {
      flash("Login with Google or Facebook to cloud save this pack.");
      return;
    }
    try {
      const saved = await saveTemplatePack({
        userId: user.id,
        pack: { ...pack, editedItems: editedItems[editScopeId] || {} },
        brief,
        notionPayload,
      });
      const rows = await listTemplatePacks(user.id);
      setCloudPacks(rows);
      trackLocalAnalytics("saved_pack_cloud", { pack: pack.name, presetId: pack.presetId || pack.id });
      flash(`Cloud saved: ${saved.name}`);
    } catch {
      flash("Cloud save failed. Check Supabase schema and login settings.");
    }
  }

  async function handleSocialLogin(provider) {
    if (provider === "instagram") {
      flash("Instagram templates are live; Instagram login needs Meta business OAuth setup next.");
      return;
    }
    try {
      await signInWithProvider(provider);
    } catch {
      flash(`${provider === "facebook" ? "Facebook" : "Google"} login needs Supabase env vars and OAuth setup.`);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setSession(null);
      setCloudPacks([]);
      flash("Signed out.");
    } catch {
      flash("Sign out failed.");
    }
  }

  async function publishToNotion() {
    if (!cloudReady) {
      flash("Add Supabase env vars before publishing to Notion.");
      return;
    }
    if (!user) {
      flash("Login with Google or Facebook to publish to Notion.");
      return;
    }
    if (!connection.parentPageId.trim()) {
      flash("Add a Notion parent page ID before publishing.");
      return;
    }
    try {
      const result = await publishNotionWorkspace({
        parentPageId: connection.parentPageId.trim(),
        notionPayload,
      });
      setPublishResult(result);
      trackLocalAnalytics("notion_publish_result_received", {
        pack: pack.name,
        status: result.status,
        pageCount: (result.createdPageIds || []).length,
        databaseCount: (result.createdDatabaseIds || []).length,
      });
      flash(result.status === "contract_ready" ? "Notion contract is ready; server token is next." : "Notion publish request sent.");
    } catch {
      flash("Notion publish failed. Check Edge Function deployment and secrets.");
    }
  }

  function exportMarkdown() {
    downloadFile(
      `packsmith-${slugify(pack.name)}.md`,
      packToMarkdown(pack, editedItems[editScopeId] || {}),
      "text/markdown",
    );
    trackLocalAnalytics("exported_markdown", { pack: pack.name });
    flash("Markdown exported.");
  }

  function exportNotionJson() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-notion-payload.json`,
      JSON.stringify(notionPayload, null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_notion_json", { pack: pack.name });
    flash("Workspace plan downloaded.");
  }

  function exportMarketplaceJson() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-marketplace.json`,
      JSON.stringify(marketplaceToJson(pack), null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_marketplace_json", { pack: pack.name });
    flash("Listing copy downloaded.");
  }

  function exportFigmaJson() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-figma-export.json`,
      JSON.stringify(buildFigmaExportSchema(pack, marketingKit), null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_figma_json", { pack: pack.name });
    flash("Preview plan downloaded.");
  }

  function exportDesignBrief() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-design-brief.md`,
      designStageToMarkdown(pack, designStageModel),
      "text/markdown",
    );
    trackLocalAnalytics("exported_design_brief", { pack: pack.name, format: designStageModel.format.id });
    flash("Design brief exported.");
  }

  function exportAssistantSkillKit() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-assistant-kit.md`,
      assistantSkillPackToMarkdown(pack, assistantSkillKit),
      "text/markdown",
    );
    trackLocalAnalytics("exported_assistant_skill_kit", { pack: pack.name });
    flash("Assistant kit exported.");
  }

  function exportPackCoverSvg() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-cover.svg`,
      packCoverSvg,
      "image/svg+xml",
    );
    trackLocalAnalytics("exported_pack_cover_svg", { pack: pack.name });
    flash("Pack cover SVG exported.");
  }

  function exportLaunchCalendar() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-launch-calendar.md`,
      launchCalendarToMarkdown(launchCalendar, pack),
      "text/markdown",
    );
    trackLocalAnalytics("exported_launch_calendar", { pack: pack.name });
    flash("Launch calendar exported.");
  }

  function exportMarketingMarkdown() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-marketing-kit.md`,
      marketingKitToMarkdown(pack, marketingKit),
      "text/markdown",
    );
    trackLocalAnalytics("exported_marketing_markdown", { pack: pack.name });
    flash("Marketing kit exported.");
  }

  function exportMarketingJson() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-social-copy.json`,
      JSON.stringify({ pack: pack.name, marketingKit }, null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_marketing_json", { pack: pack.name });
    flash("Social launch copy downloaded.");
  }

  function exportLaunchAssetStudio(kit = marketingKit, tracking = {}) {
    downloadFile(
      `packsmith-${slugify(pack.name)}-launch-asset-studio.json`,
      JSON.stringify({ pack: pack.name, launchAssetStudio: kit, actionTracking: tracking }, null, 2),
      "application/json",
    );
    trackLocalAnalytics("exported_launch_asset_studio", { pack: pack.name });
    flash("Launch Asset Studio exported.");
  }

  function exportFounderPlan() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-founder-plan.md`,
      founderPlanToMarkdown(pack, founderPlan),
      "text/markdown",
    );
    flash("Founder plan exported.");
  }

  return (
    <main className="appFrame">
      <section className="cinematicHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <a className="brandLockup" href="/">
            <div className="brandMark">
              <Flame size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Template pack forge</span>
            </div>
          </a>
          <div className="navPills">
            <span>Retro forge</span>
            <span>{pack.audience}</span>
            <span>{generatedPack ? "Local generated" : "Preset engine"}</span>
            <span>{cloudReady ? "Supabase ready" : "Local mode"}</span>
            <a href="/dashboard">Dashboard</a>
            <a href="/ai-agency-launch-kit">AI Agency Kit</a>
            <a href="/plugins">Plugins</a>
            <a href="/api-console">API Console</a>
            <a href="/mobile">Mobile</a>
            <a href="/privacy">Privacy</a>
            <SocialAuthButtons user={user} onLogin={handleSocialLogin} onSignOut={handleSignOut} />
          </div>
        </nav>

        <div className="heroGrid">
          <motion.div
            className="heroCopy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p className="eyebrow gold">6 PM product sprint</p>
            <h1>{pack.heroLine}</h1>
            <p>
              Packsmith now acts like a public product demo and internal forge: presets, custom local
              generation, Notion simulation, launch board, and marketing prompts.
            </p>
            <div className="heroActions">
              <button type="button" onClick={startGuidedMode}>
                <Play size={17} />
                Start guided build
              </button>
              <button type="button" onClick={startInstagramPack}>
                <Smartphone size={17} />
                Instagram starter
              </button>
              <button
                type="button"
                onClick={() => copyText(`${pack.listing.title}\n\n${pack.listing.description}`, "Listing copied.")}
              >
                Copy {pack.comparison.bestMarketplace} listing
              </button>
            </div>
            <div className="heroPresetGrid" aria-label="Niche presets">
              {Object.values(nichePresets).map((preset) => (
                <button
                  key={preset.id}
                  className={activePresetId === preset.id ? "presetHeroCard active" : "presetHeroCard"}
                  type="button"
                  onClick={() => selectPreset(preset.id)}
                >
                  <span>{preset.shortName}</span>
                  <strong>{preset.name}</strong>
                  <small>
                    {preset.comparison.expectedPrice} / {preset.comparison.bestMarketplace}
                  </small>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="forgePipeline"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.16, duration: 0.55 }}
          >
            <div className="pipelineDeckGlow" aria-hidden="true" />
            {pipelineStages.map((stage, index) => (
              <motion.article
                className="pipelineNode"
                key={stage.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + index * 0.12 }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage.label}</strong>
                <p>{stage.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="workspace" id="forge-workspace">
        <aside className="leftRail">
          <section className="panel briefPanel">
            <div className="panelHeader">
              <Sparkles size={18} />
              <div>
                <p className="eyebrow">Create Pack</p>
                <h2>Guided brief</h2>
              </div>
            </div>

            <div className="presetSwitch">
              {Object.values(nichePresets).map((preset) => (
                <button
                  key={preset.id}
                  className={activePresetId === preset.id ? "selected" : ""}
                  type="button"
                  onClick={() => selectPreset(preset.id)}
                >
                  <strong>{preset.shortName}</strong>
                  <span>{preset.comparison.fastestChannel}</span>
                </button>
              ))}
            </div>

            <label>
              Niche
              <input value={brief.niche} onChange={(event) => updateBrief("niche", event.target.value)} />
            </label>

            <label>
              Buyer
              <textarea value={brief.buyer} onChange={(event) => updateBrief("buyer", event.target.value)} />
            </label>

            <label>
              Pain point
              <textarea
                value={brief.painPoint}
                onChange={(event) => updateBrief("painPoint", event.target.value)}
              />
            </label>

            <label>
              Product promise
              <textarea
                value={brief.promise}
                onChange={(event) => updateBrief("promise", event.target.value)}
              />
            </label>

            <label>
              Included assets
              <textarea value={brief.assets} onChange={(event) => updateBrief("assets", event.target.value)} />
            </label>

            <div className="fieldGroup">
              <span>Output types</span>
              <div className="toggleGrid">
                {platformOptions.map((platform) => (
                  <button
                    key={platform}
                    className={brief.platforms.includes(platform) ? "selected" : ""}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <label>
              Marketplace target
              <input
                value={brief.marketplaceTarget}
                onChange={(event) => updateBrief("marketplaceTarget", event.target.value)}
              />
            </label>

            <label>
              Visual direction
              <textarea
                value={brief.visualDirection}
                onChange={(event) => updateBrief("visualDirection", event.target.value)}
              />
            </label>
          </section>

          <section className="panel generatorPanel">
            <div className="panelHeader">
              <Wand2 size={18} />
              <div>
                <p className="eyebrow">Custom builder</p>
                <h2>Generate your own pack</h2>
              </div>
            </div>
            <p className="muted">
              Create a first version from your own niche, buyer, pain point, and asset list.
            </p>
            <label>
              Custom niche
              <input value={customBrief.niche} onChange={(event) => updateCustomBrief("niche", event.target.value)} />
            </label>
            <label>
              Custom buyer
              <textarea value={customBrief.buyer} onChange={(event) => updateCustomBrief("buyer", event.target.value)} />
            </label>
            <label>
              Custom pain point
              <textarea
                value={customBrief.painPoint}
                onChange={(event) => updateCustomBrief("painPoint", event.target.value)}
              />
            </label>
            <label>
              Custom included assets
              <textarea value={customBrief.assets} onChange={(event) => updateCustomBrief("assets", event.target.value)} />
            </label>
            <div className="fieldGroup">
              <span>Custom platforms</span>
              <div className="toggleGrid">
                {platformOptions.map((platform) => (
                  <button
                    key={platform}
                    className={customBrief.platforms.includes(platform) ? "selected" : ""}
                    type="button"
                    onClick={() => togglePlatform(platform, "custom")}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
            <button className="primary wide" type="button" onClick={generateCustomPack}>
              <Wand2 size={17} />
              Generate local pack
            </button>
          </section>

          <section className="panel savePanel">
            <div className="panelHeader">
              <Save size={18} />
              <div>
                <p className="eyebrow">Memory</p>
                <h2>Saved runs</h2>
              </div>
            </div>
            <div className="cloudNotice">
              <LockKeyhole size={16} />
              <span>
                {user
                  ? `Cloud enabled for ${user.email}`
                  : fallbackCloudMessage("save packs to your account")}
              </span>
            </div>
            <p className="privacyMicrocopy">
              Try first without login. Google or Facebook login is used only for cloud saves and publishing. Notion tokens stay server-side.
            </p>
            <div className="dataControlGrid">
              <button type="button" onClick={exportLocalData}>
                <Download size={15} />
                Export local data
              </button>
              <button type="button" onClick={clearLocalData}>
                <Trash2 size={15} />
                Clear local data
              </button>
              <button type="button" onClick={exportCloudSummary}>
                <FileJson size={15} />
                Cloud summary
              </button>
            </div>
            {savedPacks.length === 0 ? (
              <p className="muted">Local saves appear here when a direction feels useful.</p>
            ) : (
              <div className="savedList">
                {savedPacks.map((saved) => (
                  <button key={saved.savedAt} className="savedRun" type="button">
                    <strong>{saved.name}</strong>
                    <span>{new Date(saved.savedAt).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}
            {cloudPacks.length > 0 && (
              <div className="savedList cloudSavedList">
                <p className="eyebrow">Cloud saves</p>
                {cloudPacks.map((saved) => (
                  <button key={saved.id} className="savedRun" type="button">
                    <strong>{saved.name}</strong>
                    <span>{new Date(saved.created_at).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className="centerStage">
          {guideOpen && (
            <section className="panel forgeGuidePanel">
              <div className="boardHeader">
                <div>
                  <p className="eyebrow">Guided walkthrough</p>
                  <h2>{activeGuide.label}</h2>
                </div>
                <button type="button" onClick={() => setGuideOpen(false)}>
                  Hide guide
                </button>
              </div>
              <div className="forgeGuideGrid">
                <div className="forgeGuideSteps" role="tablist" aria-label="Forge guided walkthrough">
                  {forgeGuideSteps.map((step, index) => (
                    <button
                      key={step.id}
                      className={activeGuide.id === step.id ? "active" : ""}
                      type="button"
                      role="tab"
                      aria-selected={activeGuide.id === step.id}
                      onClick={() => setActiveGuideStep(step.id)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{step.label}</strong>
                    </button>
                  ))}
                </div>
                <article className="forgeGuideDetail">
                  <span>{pack.shortName || pack.name}</span>
                  <p>{activeGuide.detail}</p>
                  <strong>{activeGuide.action}</strong>
                </article>
              </div>
            </section>
          )}

          <header className="stageHeader">
            <div>
              <p className="eyebrow">Pack blueprint</p>
              <h2>{pack.name}</h2>
              <p>{pack.promise}</p>
              {pack.safetyNote && (
                <div className="safetyNote">
                  <ShieldCheck size={16} />
                  <span>{pack.safetyNote}</span>
                </div>
              )}
            </div>
            <div className="actions">
              <button type="button" onClick={savePack}>
                <Save size={17} />
                Local save
              </button>
              <button type="button" onClick={savePackToCloud}>
                <LockKeyhole size={17} />
                Cloud save
              </button>
              <button type="button" onClick={exportMarkdown}>
                <Download size={17} />
                {creatorExportLabels.markdown}
              </button>
              <button type="button" onClick={exportMarketplaceJson}>
                <FileJson size={17} />
                {creatorExportLabels.marketplace}
              </button>
              <button type="button" onClick={exportFigmaJson}>
                <Figma size={17} />
                {creatorExportLabels.figma}
              </button>
              <button type="button" className="primary" onClick={exportNotionJson}>
                <Database size={17} />
                {creatorExportLabels.notion}
              </button>
            </div>
          </header>

          <div className="scoreGrid">
            <article className="scoreHero">
              <div className="scoreHalo" aria-hidden="true" />
              <Gauge size={28} />
              <div>
                <span>Pack quality</span>
                <strong>{pack.quality.overall}/100</strong>
              </div>
            </article>
            {Object.entries(pack.quality.parts).map(([label, score]) => (
              <article className="scoreCard" key={label}>
                <span>{label.replace(/([A-Z])/g, " $1")}</span>
                <strong>{score}</strong>
                <div className="scoreBar">
                  <i style={{ width: `${score}%` }} />
                </div>
              </article>
            ))}
          </div>

          <section className="panel designStagePanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Design stage</p>
                <h2>Make the template feel real before export.</h2>
              </div>
              <div className="actions">
                <button type="button" onClick={applyDesignDirection}>
                  <Sparkles size={17} />
                  Apply to pack
                </button>
                <button
                  type="button"
                  onClick={() => copyText(designStageModel.prompt, "Design prompt copied.")}
                >
                  <Clipboard size={17} />
                  Copy prompt
                </button>
                <button type="button" onClick={exportDesignBrief}>
                  <Download size={17} />
                  Design brief
                </button>
              </div>
            </div>
            <div className="designStageGrid">
              <div className="designControls">
                <div className="designControlGroup">
                  <span>Output people can see</span>
                  <div className="designOptionGrid">
                    {designStageFormats.map((format) => (
                      <button
                        key={format.id}
                        className={designStage.formatId === format.id ? "active" : ""}
                        type="button"
                        onClick={() => updateDesignStage("formatId", format.id)}
                      >
                        <strong>{format.label}</strong>
                        <small>{format.size}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="designControlGroup">
                  <span>Visual mood</span>
                  <div className="designOptionGrid">
                    {designStageMoods.map((mood) => (
                      <button
                        key={mood.id}
                        className={designStage.moodId === mood.id ? "active" : ""}
                        type="button"
                        onClick={() => updateDesignStage("moodId", mood.id)}
                      >
                        <strong>{mood.label}</strong>
                        <small>{mood.direction.split(",").slice(0, 2).join(",")}</small>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="designControlGroup compact">
                  <span>Copy tone</span>
                  <div className="toneButtonRow">
                    {designStageTones.map((tone) => (
                      <button
                        key={tone.id}
                        className={designStage.toneId === tone.id ? "active" : ""}
                        type="button"
                        onClick={() => updateDesignStage("toneId", tone.id)}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <article className="designLivePreview">
                <div className="designPreviewHeader">
                  <div>
                    <span>{designStageModel.format.label}</span>
                    <strong>{pack.shortName || pack.name}</strong>
                  </div>
                  <small>{designStageModel.format.outcome}</small>
                </div>
                <div
                  className="designPreviewCanvas"
                  style={{
                    "--design-a": designStageModel.mood.colors[0],
                    "--design-b": designStageModel.mood.colors[1],
                    "--design-c": designStageModel.mood.colors[2],
                    "--design-d": designStageModel.mood.colors[3],
                  }}
                >
                  {designStageModel.cards.map((card, index) => (
                    <motion.article
                      className="designPreviewCard"
                      key={`${card.label}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <span>{String(index + 1).padStart(2, "0")} / {card.label}</span>
                      <strong>{card.headline}</strong>
                      <p>{card.detail}</p>
                    </motion.article>
                  ))}
                </div>
                <div className="designSwatchRow" aria-label="Selected design colors">
                  {designStageModel.mood.colors.map((color) => (
                    <span key={color} style={{ "--swatch": color }}>
                      {color}
                    </span>
                  ))}
                </div>
                <textarea readOnly value={designStageModel.prompt} aria-label="Design prompt preview" />
              </article>
            </div>
          </section>

          <section className="panel visualPreviewPanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Buyer-facing preview</p>
                <h2>Show the template before asking people to buy.</h2>
              </div>
              <button type="button" onClick={exportFigmaJson}>
                <Figma size={17} />
                {creatorExportLabels.figma}
              </button>
              <button type="button" onClick={exportPackCoverSvg}>
                <Download size={17} />
                {creatorExportLabels.cover}
              </button>
            </div>
            <div className="creatorPreviewStrip" aria-label="Creator-friendly output summary">
              {pack.sections.map((section) => {
                const friendly = creatorOutputLabels[section.id] || {
                  friendly: section.label,
                  action: "Review output",
                  buyerView: section.summary,
                };
                return (
                  <article key={section.id}>
                    <span>{friendly.friendly}</span>
                    <strong>{friendly.action}</strong>
                    <p>{friendly.buyerView}</p>
                  </article>
                );
              })}
            </div>
            <div className="previewBoard">
              <article className="packCoverFrame">
                <div className="generatedCoverPreview" dangerouslySetInnerHTML={{ __html: packCoverSvg }} />
              </article>
              {figmaPreviewSchema.frames.slice(0, 4).map((frame, index) => (
                <article className={`previewFrame frame-${index}`} key={frame.id}>
                  <div className="previewFrameHeader">
                    <span>{frame.size}</span>
                    <strong>{frame.name}</strong>
                  </div>
                  <div className="previewSkeleton" aria-hidden="true">
                    {frame.sections.slice(0, 5).map((section) => (
                      <i key={section} />
                    ))}
                  </div>
                  <p>{frame.purpose}</p>
                </article>
              ))}
            </div>
            <div className="previewTokenStrip">
              {figmaPreviewSchema.designSystem.colorTokens.slice(0, 6).map((token) => (
                <span key={token.name} style={{ "--swatch": token.value }}>
                  {token.name}
                </span>
              ))}
            </div>
          </section>

          <section className="panel comparePanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Compare Niches</p>
                <h2>Launch priority view</h2>
              </div>
              <span>{Object.keys(nichePresets).length} presets</span>
            </div>
            <div className="comparisonGrid">
              {Object.values(nichePresets).map((preset) => (
                <button
                  key={preset.id}
                  className={activePresetId === preset.id ? "comparisonCard active" : "comparisonCard"}
                  type="button"
                  onClick={() => selectPreset(preset.id)}
                >
                  <strong>{preset.name}</strong>
                  <div>
                    <span>Expected price</span>
                    <b>{preset.comparison.expectedPrice}</b>
                  </div>
                  <div>
                    <span>Best market</span>
                    <b>{preset.comparison.bestMarketplace}</b>
                  </div>
                  <div>
                    <span>Fastest channel</span>
                    <b>{preset.comparison.fastestChannel}</b>
                  </div>
                  <div>
                    <span>Setup</span>
                    <b>{preset.comparison.connectorReadiness}</b>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="panel pricingWorkbench">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">INR validation</p>
                <h2>Pricing ladder for {pack.shortName || pack.name}</h2>
              </div>
              <span>{pack.comparison.expectedPrice}</span>
            </div>
            <div className="pricingWorkbenchGrid">
              {activePricingLadder.map((tier) => (
                <article key={tier.name}>
                  <span>{tier.angle}</span>
                  <strong>{tier.price}</strong>
                  <h3>{tier.name}</h3>
                  <p>{tier.includes}</p>
                  <button type="button" onClick={() => markPricingTier(tier)}>
                    Validate this tier
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="panel priorityPanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Founder priority command</p>
                <h2>Next scope planner</h2>
              </div>
              <button type="button" onClick={exportFounderPlan}>
                <Target size={17} />
                Export plan
              </button>
            </div>
            <div className="priorityHero">
              <div>
                <span>Build score</span>
                <strong>{founderPlan.score}/100</strong>
              </div>
              <p>{founderPlan.headline}</p>
              <small>{founderPlan.launchReadiness}</small>
            </div>
            <div className="productWorkQueue">
              <div className="workQueueHeader">
                <div>
                  <p className="eyebrow">Product action queue</p>
                  <h3>{productWorkProgress.doneCount}/{productWorkProgress.total} traction steps ready</h3>
                </div>
                <div className="workQueueMeter" aria-label={`Product work progress ${productWorkProgress.percent}%`}>
                  <i style={{ width: `${productWorkProgress.percent}%` }} />
                </div>
              </div>
              <div className="workQueueList">
                {productWorkQueue.map((item) => {
                  const done = productWorkStatus[item.id] ?? item.defaultDone;
                  return (
                    <article className={done ? "workQueueItem done" : "workQueueItem"} key={item.id}>
                      <button
                        type="button"
                        className="workQueueToggle"
                        onClick={() => toggleProductWorkItem(item)}
                        aria-pressed={done}
                      >
                        {done ? <CheckCircle2 size={17} /> : <Clock3 size={17} />}
                      </button>
                      <div>
                        <span>{item.priority} / {item.stage}</span>
                        <strong>{item.label}</strong>
                        <p>{item.action}</p>
                        <small>{item.successMetric}</small>
                      </div>
                      <div className="workQueueActions">
                        <button
                          type="button"
                          className="workQueueRunButton"
                          onClick={() => runProductWorkItem(item)}
                        >
                          <Play size={15} />
                          Run
                        </button>
                        <button
                          type="button"
                          className="workQueueCopyButton"
                          onClick={() =>
                            copyText(
                              `${item.label}\n\nAction: ${item.action}\nSuccess metric: ${item.successMetric}`,
                              "Next action copied.",
                            )
                          }
                        >
                          <Clipboard size={15} />
                          Copy
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="priorityGrid">
              {founderPlan.focus.map((item) => (
                <article key={item.label}>
                  <span>{item.priority}</span>
                  <h3>{item.label}</h3>
                  <p>{item.action}</p>
                  <em>{item.reason}</em>
                </article>
              ))}
            </div>
            <div className="experimentGrid">
              {founderPlan.experiments.map((experiment) => (
                <article key={experiment.name}>
                  <TrendingUp size={18} />
                  <div>
                    <strong>{experiment.name}</strong>
                    <span>{experiment.price}</span>
                    <p>{experiment.offer}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <nav className="sectionTabs" aria-label="Generated platform outputs">
            {pack.sections.map((section) => {
              const Icon = sectionIcons[section.id];
              const friendly = creatorOutputLabels[section.id]?.friendly || section.label;
              return (
                <button
                  key={section.id}
                  className={activeSection === section.id ? "active" : ""}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={18} />
                  {friendly}
                </button>
              );
            })}
          </nav>

          <AnimatePresence mode="wait">
            <motion.section
              className="panel builderSurface"
              key={`${editScopeId}-${selectedSection.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24 }}
            >
              <div className="sectionLead">
                <div className="sectionIcon">
                  <SelectedIcon size={26} />
                </div>
                <div>
                  <p className="eyebrow">Editable template content</p>
                  <h3>{selectedSectionLabel.friendly}</h3>
                  <p>{selectedSectionLabel.buyerView}</p>
                </div>
              </div>

              <div className="assetGrid">
                {selectedItems.map((item, index) => (
                  <article className="assetCard" key={`${selectedSection.id}-${index}`}>
                    <div>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <Edit3 size={14} />
                    </div>
                    <textarea
                      value={item}
                      onChange={(event) =>
                        updateGeneratedItem(selectedSection.id, index, event.target.value)
                      }
                    />
                  </article>
                ))}
              </div>
            </motion.section>
          </AnimatePresence>

          <section className="panel launchBoard">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Founder growth layer</p>
                <h2>Launch Board</h2>
              </div>
              <button type="button" onClick={exportLaunchCalendar}>
                <CalendarDays size={17} />
                Calendar
              </button>
            </div>

            <div className="channelGrid">
              {pack.launchChannels.map((channel) => (
                <button
                  key={channel.id}
                  className={activeChannel === channel.id ? "channelCard active" : "channelCard"}
                  type="button"
                  onClick={() => setActiveChannel(channel.id)}
                >
                  <span>{channel.priority}</span>
                  <strong>{channel.name}</strong>
                  <small>{channel.readiness}</small>
                </button>
              ))}
            </div>

            <article className="channelDetail">
              <div>
                <p className="eyebrow">{selectedChannel.priority} channel</p>
                <h3>{selectedChannel.listingTitle}</h3>
                <p>{selectedChannel.description}</p>
              </div>
              <div className="channelMeta">
                <span>{selectedChannel.audience}</span>
                <span>{selectedChannel.price}</span>
              </div>
              <div className="detailColumns">
                <div>
                  <h4>Preview checklist</h4>
                  <ul>
                    {selectedChannel.previewChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Launch post</h4>
                  <p>{selectedChannel.launchPost}</p>
                  <button
                    type="button"
                    onClick={() => copyText(selectedChannel.launchPost, `${selectedChannel.name} post copied.`)}
                  >
                    <Clipboard size={16} />
                    Copy post
                  </button>
                </div>
              </div>
              <p className="riskNote">{selectedChannel.riskNotes}</p>
            </article>
          </section>

          <section className="panel marketingPanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Marketing command center</p>
                <h2>Video and launch prompts</h2>
              </div>
              <div className="actions">
                <button type="button" onClick={exportMarketingMarkdown}>
                  <Play size={17} />
                  Video script
                </button>
                <button type="button" onClick={exportMarketingJson}>
                  <FileJson size={17} />
                  Social copy
                </button>
              </div>
            </div>
            <div className="marketingGrid">
              <article>
                <h3>60-second script</h3>
                {marketingKit.videoScript.map((block) => (
                  <p key={block.time}>
                    <strong>{block.time}</strong> {block.voiceover}
                  </p>
                ))}
              </article>
              <article>
                <h3>Runway prompts</h3>
                <ul>
                  {marketingKit.runwayPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>HeyGen/Synthesia script</h3>
                <p>{marketingKit.avatarScript}</p>
              </article>
              <article>
                <h3>Canva deck outline</h3>
                <ul>
                  {marketingKit.canvaOutline.map((slide) => (
                    <li key={slide}>{slide}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <LaunchAssetStudio
            pack={pack}
            kit={marketingKit}
            onCopy={copyText}
            onExport={exportLaunchAssetStudio}
            onFigmaExport={exportFigmaJson}
          />

          <section className="panel assistantSkillPanel">
            <div className="boardHeader">
              <div>
                <p className="eyebrow">Assistant skill pack</p>
                <h2>Let creators use Packsmith inside the tools they already open.</h2>
              </div>
              <div className="actions">
                <button
                  type="button"
                  onClick={() => copyText(assistantSkillKit.prompts.chatgptPrompt, "ChatGPT instructions copied.")}
                >
                  <Clipboard size={17} />
                  ChatGPT
                </button>
                <button
                  type="button"
                  onClick={() => copyText(assistantSkillKit.prompts.claudeProjectPrompt, "Claude project prompt copied.")}
                >
                  <Clipboard size={17} />
                  Claude
                </button>
                <button type="button" onClick={exportAssistantSkillKit}>
                  <Download size={17} />
                  Full kit
                </button>
              </div>
            </div>
            <div className="assistantSkillGrid">
              {assistantSkillKit.surfaces.map((surface) => (
                <article key={surface.id}>
                  <span>{surface.status}</span>
                  <strong>{surface.name}</strong>
                  <p>{surface.promise}</p>
                </article>
              ))}
            </div>
            <div className="assistantPromptPreview">
              <article>
                <h3>Designer handoff</h3>
                <p>{assistantSkillKit.prompts.figmaCanvaPrompt}</p>
                <button
                  type="button"
                  onClick={() => copyText(assistantSkillKit.prompts.figmaCanvaPrompt, "Figma and Canva handoff copied.")}
                >
                  <PenTool size={16} />
                  Copy Figma/Canva prompt
                </button>
              </article>
              <article>
                <h3>Repo path</h3>
                <p>
                  The repo now includes an assistant-kit folder with paste-ready instructions for
                  ChatGPT, Claude, Figma, and Canva workflows.
                </p>
                <a href="/plugins">View plugin path</a>
              </article>
            </div>
          </section>
        </section>

        <aside className="rightRail">
          <section className="panel opsPanel">
            <div className="panelHeader">
              <ShieldCheck size={18} />
              <div>
                <p className="eyebrow">Beta ops</p>
                <h2>Setup checklist</h2>
              </div>
            </div>
            <div className="opsGrid">
              {setupChecklist.map((item) => (
                <article className={item.ready ? "opsCard ready" : "opsCard"} key={item.label}>
                  <div>
                    <span>{item.status}</span>
                    <strong>{item.label}</strong>
                  </div>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel aiPanel">
            <div className="panelHeader">
              <Brain size={18} />
              <div>
                <p className="eyebrow">AI upgrade path</p>
                <h2>What can improve next</h2>
              </div>
            </div>

            {providerOptions.map((provider) => (
              <article className="providerCard" key={provider.id}>
                <div>
                  <Cpu size={17} />
                  <strong>{provider.name}</strong>
                  <small>{provider.status}</small>
                </div>
                <p>{provider.useCase}</p>
                <div className="providerBar" aria-label={`${provider.name} readiness ${provider.readiness}`}>
                  <i style={{ width: `${provider.readiness}%` }} />
                </div>
                <span>
                  {provider.cost} / {provider.nextStep}
                </span>
              </article>
            ))}
          </section>

          <section className="panel milestonePanel">
            <div className="panelHeader">
              <CheckCircle2 size={18} />
              <div>
                <p className="eyebrow">Founder milestones</p>
                <h2>Next product moves</h2>
              </div>
            </div>

            {founderMilestones.map((milestone) => (
              <article className="milestoneCard" key={milestone.id}>
                <span>{milestone.horizon}</span>
                <strong>{milestone.label}</strong>
                <p>{milestone.outcome}</p>
              </article>
            ))}
          </section>

          <section className="panel notionPanel">
            <div className="panelHeader">
              <Layers3 size={18} />
              <div>
                <p className="eyebrow">Workspace preview</p>
                <h2>See the pages before publishing</h2>
              </div>
            </div>

            <label>
              Notion destination page
              <input
                placeholder="paste destination page id"
                value={connection.parentPageId}
                onChange={(event) =>
                  setConnection((current) => ({ ...current, parentPageId: event.target.value }))
                }
              />
            </label>

            <label>
              Publishing setup
              <input
                readOnly
                value={
                  cloudReady
                    ? "Ready for secure server-side Notion setup"
                    : "Add Supabase settings before live publishing"
                }
              />
            </label>

            <div className="simulationStatus">
              <ShieldCheck size={18} />
              <div>
                <strong>{notionSimulation.status.replaceAll("_", " ")}</strong>
                <p>{notionSimulation.message}</p>
              </div>
            </div>

            <div className="payloadStats">
              <div>
                <strong>{notionExport.pages.length}</strong>
                <span>Workspace pages</span>
              </div>
              <div>
                <strong>{notionExport.databases.length}</strong>
                <span>Trackers</span>
              </div>
            </div>

            <div className="databasePreview">
              {notionSimulation.createdPreview.databases.map((database) => (
                <article key={database.name}>
                  <strong>{database.name}</strong>
                  <span>
                    {database.properties} fields / {database.sampleRecords} example rows
                  </span>
                </article>
              ))}
            </div>

            <div className="notionRevealPanel">
              <div className="notionRevealHero">
                <span>{notionPublishReveal.mode}</span>
                <strong>{notionPublishReveal.status.replaceAll("_", " ")}</strong>
                <p>{notionPublishReveal.parentPage}</p>
              </div>
              <div className="notionRevealGrid">
                <article>
                  <span>Pages</span>
                  <strong>{notionPublishReveal.pages.length}</strong>
                  {notionPublishReveal.pages.slice(0, 4).map((page) => (
                    <code key={`${page.name}-${page.id}`}>{page.name}</code>
                  ))}
                </article>
                <article>
                  <span>Trackers</span>
                  <strong>{notionPublishReveal.databases.length}</strong>
                  {notionPublishReveal.databases.slice(0, 4).map((database) => (
                    <code key={`${database.name}-${database.id}`}>{database.name}</code>
                  ))}
                </article>
              </div>
              <p className="connectorHint">
                {publishResult
                  ? "Live workspace response received."
                  : "Preview mode. Add a destination page and login when you are ready to publish."}
              </p>
            </div>

            <button type="button" className="primary wide" onClick={exportNotionJson}>
              Download workspace plan
              <ArrowRight size={17} />
            </button>
            <button type="button" className="wide" onClick={publishToNotion}>
              Publish workspace
              <LockKeyhole size={17} />
            </button>
            <p className="connectorHint">
              {user
                ? "Publishing uses secure server-side setup; tokens stay out of the browser."
                : fallbackCloudMessage("publish to Notion")}
            </p>
            {publishResult && (
              <div className="publishResult">
                <strong>{publishResult.status}</strong>
                <span>
                  {(publishResult.createdPageIds || []).length} pages /{" "}
                  {(publishResult.createdDatabaseIds || []).length} trackers returned
                </span>
                {[...(publishResult.createdPageIds || []), ...(publishResult.createdDatabaseIds || [])]
                  .slice(0, 6)
                  .map((item) => (
                    <code key={typeof item === "string" ? item : item.id}>
                      {typeof item === "string" ? item : `${item.name}: ${item.id}`}
                    </code>
                  ))}
                <span>{(publishResult.errors || []).join(" ") || "Publish request completed."}</span>
              </div>
            )}
          </section>

          <section className="panel connectorPanel">
            <div className="panelHeader">
              <LockKeyhole size={18} />
              <div>
                <p className="eyebrow">Connector path</p>
                <h2>Access plan</h2>
              </div>
            </div>

            {connectorRoadmap.map((connector) => (
              <article className="connectorCard" key={connector.id}>
                <div>
                  <span className={`dot ${connector.id}`} />
                  <strong>{connector.name}</strong>
                  <small>{connector.status}</small>
                </div>
                <p>{connector.description}</p>
                <em>{connector.nextStep}</em>
              </article>
            ))}
          </section>

          <section className="panel contractPanel">
            <div className="panelHeader">
              <ExternalLink size={18} />
              <div>
                <p className="eyebrow">Backend contract</p>
                <h2>{backendContract.path}</h2>
              </div>
            </div>
            <p>
              {backendContract.method} route accepts parent page ID, server-side token, and workspace
              payload, then returns created Notion IDs and errors.
            </p>
          </section>
        </aside>
      </section>

      {notice && (
        <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {notice}
        </motion.div>
      )}
    </main>
  );
}

function App() {
  if (window.location.pathname === "/app") return <ForgeApp />;
  if (window.location.pathname === "/launch") return <LaunchPage />;
  if (window.location.pathname === "/ai-agency-launch-kit") return <AiAgencyLaunchKitPage />;
  if (window.location.pathname === "/dashboard") return <DashboardPage />;
  if (window.location.pathname === "/mobile") return <MobileAccessPage />;
  if (window.location.pathname === "/plugins") return <PlatformExpansionPage />;
  if (window.location.pathname === "/platforms") return <PlatformExpansionPage />;
  if (window.location.pathname === "/api-console") return <ApiConsolePage />;
  if (window.location.pathname === "/privacy") return <PrivacyPage />;
  return <LandingPage />;
}

export default App;
