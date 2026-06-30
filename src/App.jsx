import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  Database,
  Download,
  Edit3,
  ExternalLink,
  Figma,
  FileJson,
  Flame,
  Gauge,
  Layers3,
  LockKeyhole,
  PenTool,
  Rocket,
  Save,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { createNotionPayload, simulateNotionPublish } from "./integrations/notionConnector";

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

function App() {
  const [activePresetId, setActivePresetId] = useState(defaultPresetId);
  const activePreset = getPreset(activePresetId);
  const [brief, setBrief] = useState(activePreset.brief);
  const [activeSection, setActiveSection] = useState("notion");
  const [activeChannel, setActiveChannel] = useState("gumroad");
  const [connection, setConnection] = useState({ parentPageId: "", tokenHint: "" });
  const [editedItems, setEditedItems] = useState({});
  const [notice, setNotice] = useState("");
  const [savedPacks, setSavedPacks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("packsmith.saved.react") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    setBrief(getPreset(activePresetId).brief);
    setActiveSection("notion");
    setActiveChannel("gumroad");
  }, [activePresetId]);

  const pack = useMemo(() => buildLaunchKit(brief, activePresetId), [activePresetId, brief]);
  const notionExport = useMemo(() => buildNotionExport(pack), [pack]);
  const notionPayload = useMemo(
    () => createNotionPayload(notionExport, { parentPageId: connection.parentPageId }),
    [connection.parentPageId, notionExport],
  );
  const notionSimulation = useMemo(
    () => simulateNotionPublish(notionExport, { parentPageId: connection.parentPageId }),
    [connection.parentPageId, notionExport],
  );
  const launchCalendar = useMemo(() => buildLaunchCalendar(pack), [pack]);
  const selectedSection = pack.sections.find((section) => section.id === activeSection) || pack.sections[0];
  const selectedItems = editedItems[activePresetId]?.[selectedSection.id] || selectedSection.items;
  const selectedChannel =
    pack.launchChannels.find((channel) => channel.id === activeChannel) || pack.launchChannels[0];
  const SelectedIcon = sectionIcons[selectedSection.id] || Boxes;

  function updateBrief(field, value) {
    setBrief((current) => ({ ...current, [field]: value }));
  }

  function togglePlatform(platform) {
    setBrief((current) => {
      const hasPlatform = current.platforms.includes(platform);
      const nextPlatforms = hasPlatform
        ? current.platforms.filter((item) => item !== platform)
        : [...current.platforms, platform];
      return { ...current, platforms: nextPlatforms.length ? nextPlatforms : [platform] };
    });
    const firstAvailable = platformIds[platform] || "notion";
    setActiveSection(firstAvailable);
  }

  function updateGeneratedItem(sectionId, index, value) {
    setEditedItems((current) => {
      const presetEdits = current[activePresetId] || {};
      const baseItems =
        presetEdits[sectionId] || pack.sections.find((section) => section.id === sectionId)?.items || [];
      const nextItems = [...baseItems];
      nextItems[index] = value;
      return {
        ...current,
        [activePresetId]: {
          ...presetEdits,
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
      editedItems: editedItems[activePresetId] || {},
      savedAt: new Date().toISOString(),
    };
    const nextSaved = [nextPack, ...savedPacks].slice(0, 8);
    setSavedPacks(nextSaved);
    localStorage.setItem("packsmith.saved.react", JSON.stringify(nextSaved));
    flash("Pack saved locally.");
  }

  function exportMarkdown() {
    downloadFile(
      `packsmith-${slugify(pack.name)}.md`,
      packToMarkdown(pack, editedItems[activePresetId] || {}),
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

  return (
    <main className="appFrame">
      <section className="cinematicHero">
        <div className="heroBackdrop" />
        <nav className="topNav">
          <div className="brandLockup">
            <div className="brandMark">
              <Flame size={24} />
            </div>
            <div>
              <strong>Packsmith</strong>
              <span>Template pack forge</span>
            </div>
          </div>
          <div className="navPills">
            <span>Investor-demo MVP</span>
            <span>{pack.audience}</span>
            <span>Premium forge</span>
          </div>
        </nav>

        <div className="heroGrid">
          <motion.div
            className="heroCopy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p className="eyebrow gold">Founder sprint</p>
            <h1>{pack.heroLine}</h1>
            <p>
              Packsmith now behaves like a command center for creating, packaging, and selling the
              {` ${pack.name} across Notion, Canva, Figma, and marketplace channels.`}
            </p>
            <div className="heroActions">
              <a href="#forge-workspace">Open forge workspace</a>
              <button
                type="button"
                onClick={() =>
                  copyText(
                    `${pack.listing.title}\n\n${pack.listing.description}`,
                    "Gumroad listing copied.",
                  )
                }
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
                  onClick={() => setActivePresetId(preset.id)}
                >
                  <span>{preset.shortName}</span>
                  <strong>{preset.name}</strong>
                  <small>{preset.comparison.expectedPrice} / {preset.comparison.bestMarketplace}</small>
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
                  onClick={() => setActivePresetId(preset.id)}
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

          <section className="panel savePanel">
            <div className="panelHeader">
              <Save size={18} />
              <div>
                <p className="eyebrow">Local memory</p>
                <h2>Saved runs</h2>
              </div>
            </div>
            {savedPacks.length === 0 ? (
              <p className="muted">Save a generated run when the direction feels useful.</p>
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
                Save
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
                  onClick={() => setActivePresetId(preset.id)}
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
              key={selectedSection.id}
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
        </section>

        <aside className="rightRail">
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
              Token handling
              <input
                placeholder="server-side only; never stored here"
                value={connection.tokenHint}
                onChange={(event) =>
                  setConnection((current) => ({ ...current, tokenHint: event.target.value }))
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

export default App;
