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
  Sparkles,
  Target,
  TrendingUp,
  Trash2,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  buildDashboardMetrics,
  buildLaunchTracker,
  buildPackExportChecklist,
  createForgeResumePayload,
  normalizePackHistory,
} from "./dashboardData";
import { createNotionPayload, simulateNotionPublish } from "./integrations/notionConnector";
import {
  getCurrentSession,
  isSupabaseConfigured,
  listTemplatePacks,
  onAuthStateChange,
  publishNotionWorkspace,
  saveTemplatePack,
  saveWaitlistLead,
  signInWithGoogle,
  signOut,
  upsertProfile,
} from "./integrations/supabaseClient";
import { buildCustomNotionExport, buildCustomPack } from "./localPackGenerator";
import { buildMarketingKit, marketingKitToMarkdown } from "./marketingData";
import { buildFounderPriorityPlan, founderMilestones, founderPlanToMarkdown, providerOptions } from "./productRoadmap";
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
  ["3", "sellable niche presets"],
  ["5", "export paths"],
  ["60s", "demo script included"],
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
    text: "Generate the workspace schema, design/content specs, marketplace listing, and launch calendar in one flow.",
  },
  {
    icon: Target,
    label: "To first sale",
    title: "Launch board built in",
    text: "Get Gumroad copy, LinkedIn/X posts, preview checklist, pricing ladder, and risk notes for each niche.",
  },
];

const outputShowcase = [
  {
    icon: Database,
    name: "Notion OS",
    detail: "Pages, databases, properties, sample records, and simulated publish payload.",
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

const launchAssets = {
  linkedin:
    "I’m building Packsmith: a template-pack forge for solo founders. It turns one rough niche idea into a Notion OS, Canva launch pack, Figma starter, marketplace listing, launch calendar, and video script. Today’s wedge: AI Agency, SaaS Launch, and Healthcare Practice Growth kits.",
  xThread: [
    "I’m building Packsmith: rough idea -> sellable template pack.",
    "Pick a niche: AI Agency, SaaS Launch, or Healthcare Practice Growth.",
    "Generate Notion, Canva, Figma, Gumroad copy, launch calendar, and video prompts in one forge flow.",
    "Try first, then login with Google to save packs and prepare Notion publishing.",
  ],
  gumroad:
    "Packsmith helps solo founders turn a niche idea into a ready-to-sell template pack: Notion workspace schema, Canva launch assets, Figma UI starter, marketplace copy, and a launch board.",
  video:
    "Show Packsmith homepage, pick AI Agency Launch Kit, generate a custom pack, reveal quality score, open Notion simulation, copy Gumroad listing, and end on the launch page CTA.",
  prompt:
    "Retro-futuristic SaaS product demo, dark founder command center, amber and green terminal accents, UI cards assembling into Notion Canva Figma launch pack, premium cinematic lighting, no readable text.",
};

const privacyVersion = "2026-07-02";
const forgeResumeKey = "packsmith.resumePack";

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
    ? `Login with Google to ${action}.`
    : `Supabase is not configured yet. Add env vars to ${action}; local mode still works.`;
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

function LandingPage() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

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
            <span>Notion</span>
            <span>Canva</span>
            <span>Figma</span>
            <span>Launch board</span>
            <a href="/launch">Launch kit</a>
            <a href="/dashboard">Dashboard</a>
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
              Turn one rough idea into a sellable template pack with niche-specific Notion systems,
              Canva launch assets, Figma starters, marketplace copy, and a founder launch board.
            </p>
            <div className="heroActions">
              <a href="/app">
                Try the forge
                <ArrowRight size={17} />
              </a>
              <a className="ghostLink" href="#presets">View niches</a>
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
            <p>Brief, quality score, platform outputs, Notion payload, launch board, marketing kit.</p>
          </article>
          <article>
            <span>After</span>
            <h3>Sellable template pack</h3>
            <p>Markdown export, marketplace JSON, launch calendar, video script, social posts, pitch outline.</p>
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

  async function copyLaunchCopy(label, value) {
    try {
      await navigator.clipboard.writeText(Array.isArray(value) ? value.join("\n") : value);
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
      JSON.stringify({ featuredPack: featuredPack.name, launchAssets }, null, 2),
      "application/json",
    );
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
            <a href="/dashboard">Dashboard</a>
            <a href="/privacy">Privacy</a>
            <a href="/app">Try the forge</a>
          </div>
        </nav>

        <div className="landingGrid">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow gold">Today’s traction page</p>
            <h1>Launch a template pack before the backend is perfect.</h1>
            <p>
              Packsmith’s public launch kit gives founders the message, demo path, channel copy,
              and early-builder capture needed to start conversations today.
            </p>
            <div className="heroActions">
              <a href="/app">
                Try the forge
                <ArrowRight size={17} />
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
        <button className="primary exportLaunchButton" type="button" onClick={exportLaunchKit}>
          <FileJson size={17} />
          Export launch kit JSON
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

function PrivacyPage() {
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
            <a href="/launch">Launch kit</a>
            <a href="/dashboard">Dashboard</a>
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
                <li>Notion parent page ID and workspace payload when you publish.</li>
              </ul>
            </article>
            <article>
              <h2>What we do not store in the browser</h2>
              <ul>
                <li>Notion API tokens.</li>
                <li>Supabase service-role keys.</li>
                <li>Google OAuth secrets.</li>
                <li>Payment information.</li>
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
  const selectedRow = history.find((row) => row.id === selectedId) || history[0] || null;
  const selectedPack = selectedRow?.raw || null;
  const exportChecklist = useMemo(
    () => buildPackExportChecklist(selectedPack || {}),
    [selectedPack],
  );
  const launchTracker = useMemo(
    () => buildLaunchTracker(selectedPack || {}),
    [selectedPack],
  );

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
        } else {
          setCloudPacks([]);
        }
      } catch {
        setCloudPacks([]);
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
    flash("Local history refreshed.");
  }

  async function refreshCloudHistory() {
    if (!cloudReady) {
      flash("Add Supabase env vars to enable cloud history.");
      return;
    }
    if (!user) {
      flash("Login with Google to load cloud history.");
      return;
    }
    try {
      setCloudPacks(await listTemplatePacks(user.id));
      flash("Cloud history refreshed.");
    } catch {
      flash("Cloud history failed. Check Supabase tables and policies.");
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle();
    } catch {
      flash("Google login needs Supabase env vars and OAuth setup.");
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

  function exportDashboardSnapshot() {
    downloadFile(
      "packsmith-dashboard-snapshot.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          user: user ? { id: user.id, email: user.email } : null,
          metrics,
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
    flash("Dashboard snapshot exported.");
  }

  function openSelectedPackInForge() {
    if (!selectedRow) {
      flash("Select a saved pack first.");
      return;
    }
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
            <a href="/app">Forge</a>
            <a href="/privacy">Privacy</a>
            {user ? (
              <button className="navAuthButton" type="button" onClick={handleSignOut}>
                <LogOut size={14} />
                Sign out
              </button>
            ) : (
              <button className="navAuthButton" type="button" onClick={handleGoogleLogin}>
                <LogIn size={14} />
                Continue with Google
              </button>
            )}
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
                <p>{cloudReady ? "Google login can be enabled from Supabase." : "Add Supabase env vars for login."}</p>
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
  const [notice, setNotice] = useState("");
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
  const launchCalendar = useMemo(() => buildLaunchCalendar(pack), [pack]);
  const marketingKit = useMemo(() => buildMarketingKit(pack), [pack]);
  const founderPlan = useMemo(() => buildFounderPriorityPlan(pack), [pack]);
  const setupChecklist = useMemo(
    () => [
      {
        label: "Supabase env",
        status: cloudReady ? "Ready" : "Local fallback",
        ready: cloudReady,
        detail: cloudReady ? "Cloud features can initialize." : "Add VITE_SUPABASE_URL and anon key.",
      },
      {
        label: "Google login",
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
  const selectedItems = editedItems[editScopeId]?.[selectedSection.id] || selectedSection.items;
  const selectedChannel =
    pack.launchChannels.find((channel) => channel.id === activeChannel) || pack.launchChannels[0];
  const SelectedIcon = sectionIcons[selectedSection.id] || Boxes;

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

  function updateBrief(field, value) {
    setBrief((current) => ({ ...current, [field]: value }));
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
      flash("Add Supabase env vars to enable Google login and cloud save.");
      return;
    }
    if (!user) {
      flash("Login with Google to cloud save this pack.");
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
      flash(`Cloud saved: ${saved.name}`);
    } catch {
      flash("Cloud save failed. Check Supabase schema and login settings.");
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle();
    } catch {
      flash("Google login needs Supabase env vars and OAuth setup.");
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
      flash("Login with Google to publish to Notion.");
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
    flash("Markdown exported.");
  }

  function exportNotionJson() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-notion-payload.json`,
      JSON.stringify(notionPayload, null, 2),
      "application/json",
    );
    flash("Notion payload exported.");
  }

  function exportMarketplaceJson() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-marketplace.json`,
      JSON.stringify(marketplaceToJson(pack), null, 2),
      "application/json",
    );
    flash("Marketplace JSON exported.");
  }

  function exportLaunchCalendar() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-launch-calendar.md`,
      launchCalendarToMarkdown(launchCalendar, pack),
      "text/markdown",
    );
    flash("Launch calendar exported.");
  }

  function exportMarketingMarkdown() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-marketing-kit.md`,
      marketingKitToMarkdown(pack, marketingKit),
      "text/markdown",
    );
    flash("Marketing kit exported.");
  }

  function exportMarketingJson() {
    downloadFile(
      `packsmith-${slugify(pack.name)}-social-copy.json`,
      JSON.stringify({ pack: pack.name, marketingKit }, null, 2),
      "application/json",
    );
    flash("Social launch copy exported.");
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
            <a href="/privacy">Privacy</a>
            {user ? (
              <button className="navAuthButton" type="button" onClick={handleSignOut}>
                <LogOut size={14} />
                Sign out
              </button>
            ) : (
              <button className="navAuthButton" type="button" onClick={handleGoogleLogin}>
                <LogIn size={14} />
                Continue with Google
              </button>
            )}
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
              <a href="#forge-workspace">Open forge workspace</a>
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
              <span>Platforms</span>
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
                <p className="eyebrow">Local generator</p>
                <h2>Generate Custom Pack</h2>
              </div>
            </div>
            <p className="muted">
              API-free mock generation. Provider-ready for NVIDIA/OpenAI later, but safe to demo now.
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
              Try first without login. Google login is used only for cloud saves and publishing. Notion tokens stay server-side.
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
                Markdown
              </button>
              <button type="button" onClick={exportMarketplaceJson}>
                <FileJson size={17} />
                Market JSON
              </button>
              <button type="button" className="primary" onClick={exportNotionJson}>
                <Database size={17} />
                Notion JSON
              </button>
            </div>
          </header>

          <div className="scoreGrid">
            <article className="scoreHero">
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
                    <span>Connector</span>
                    <b>{preset.comparison.connectorReadiness}</b>
                  </div>
                </button>
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
              return (
                <button
                  key={section.id}
                  className={activeSection === section.id ? "active" : ""}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={18} />
                  {section.label}
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
                  <p className="eyebrow">Editable output</p>
                  <h3>{selectedSection.label}</h3>
                  <p>{selectedSection.summary}</p>
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
                  Social JSON
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
                <p className="eyebrow">Real AI path</p>
                <h2>Provider readiness</h2>
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
                <p className="eyebrow">Notion connector</p>
                <h2>Simulate publish</h2>
              </div>
            </div>

            <label>
              Parent page ID
              <input
                placeholder="paste parent page id"
                value={connection.parentPageId}
                onChange={(event) =>
                  setConnection((current) => ({ ...current, parentPageId: event.target.value }))
                }
              />
            </label>

            <label>
              Server secret status
              <input
                readOnly
                value={
                  cloudReady
                    ? "Set NOTION_TOKEN in Supabase Edge Function secrets"
                    : "Configure Supabase before adding server secrets"
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
                <span>Pages</span>
              </div>
              <div>
                <strong>{notionExport.databases.length}</strong>
                <span>Databases</span>
              </div>
            </div>

            <div className="databasePreview">
              {notionSimulation.createdPreview.databases.map((database) => (
                <article key={database.name}>
                  <strong>{database.name}</strong>
                  <span>
                    {database.properties} properties / {database.sampleRecords} sample records
                  </span>
                </article>
              ))}
            </div>

            <button type="button" className="primary wide" onClick={exportNotionJson}>
              Export publish payload
              <ArrowRight size={17} />
            </button>
            <button type="button" className="wide" onClick={publishToNotion}>
              Publish with Notion
              <LockKeyhole size={17} />
            </button>
            <p className="connectorHint">
              {user
                ? "Publishing calls the Supabase Edge Function; Notion token stays server-side."
                : fallbackCloudMessage("publish to Notion")}
            </p>
            {publishResult && (
              <div className="publishResult">
                <strong>{publishResult.status}</strong>
                <span>
                  {(publishResult.createdPageIds || []).length} pages /{" "}
                  {(publishResult.createdDatabaseIds || []).length} databases returned
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
  if (window.location.pathname === "/dashboard") return <DashboardPage />;
  if (window.location.pathname === "/privacy") return <PrivacyPage />;
  return <LandingPage />;
}

export default App;
