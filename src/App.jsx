import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clipboard,
  Database,
  Download,
  Figma,
  FileJson,
  Layers3,
  PenTool,
  Rocket,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildLaunchKit,
  buildNotionExport,
  connectorRoadmap,
  starterBrief,
} from "./packsmithData";
import { createNotionPayload } from "./integrations/notionConnector";

const sectionIcons = {
  notion: Database,
  canva: PenTool,
  figma: Figma,
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

function packToMarkdown(pack) {
  const list = (items) => items.map((item) => `- ${item}`).join("\n");
  return `# ${pack.name}

${pack.promise}

Buyer: ${pack.buyer}
Price: ${pack.suggestedPrice}

## Sections
${pack.sections.map((section) => `### ${section.label}\n${section.summary}\n${list(section.items)}`).join("\n\n")}

## Listing
${pack.listing.title}

${pack.listing.description}

Tags: ${pack.listing.tags.join(", ")}

## Launch Plan
${list(pack.launchPlan)}
`;
}

function App() {
  const [brief, setBrief] = useState(starterBrief);
  const [activeSection, setActiveSection] = useState("notion");
  const [savedPacks, setSavedPacks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("packsmith.saved.react") || "[]");
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState("");

  const pack = useMemo(() => buildLaunchKit(brief), [brief]);
  const notionExport = useMemo(() => buildNotionExport(pack), [pack]);
  const selectedSection = pack.sections.find((section) => section.id === activeSection);
  const SelectedIcon = sectionIcons[selectedSection.id];
  const notionPayload = useMemo(() => createNotionPayload(notionExport), [notionExport]);

  function updateBrief(field, value) {
    setBrief((current) => ({ ...current, [field]: value }));
  }

  function flash(message) {
    setNotice(message);
    window.clearTimeout(flash.timer);
    flash.timer = window.setTimeout(() => setNotice(""), 2600);
  }

  async function copyListing() {
    const listing = `${pack.listing.title}\n\n${pack.listing.description}\n\nTags: ${pack.listing.tags.join(", ")}`;
    try {
      await navigator.clipboard.writeText(listing);
      flash("Listing copied.");
    } catch {
      flash("Copy was blocked by the browser.");
    }
  }

  function savePack() {
    const nextPack = { ...pack, savedAt: new Date().toISOString() };
    const nextSaved = [nextPack, ...savedPacks].slice(0, 8);
    setSavedPacks(nextSaved);
    localStorage.setItem("packsmith.saved.react", JSON.stringify(nextSaved));
    flash("Pack saved locally.");
  }

  function exportMarkdown() {
    downloadFile("packsmith-ai-agency-launch-kit.md", packToMarkdown(pack), "text/markdown");
    flash("Markdown exported.");
  }

  function exportNotionJson() {
    downloadFile(
      "packsmith-notion-workspace-payload.json",
      JSON.stringify(notionPayload, null, 2),
      "application/json",
    );
    flash("Notion payload exported.");
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">
            <Boxes size={24} />
          </div>
          <div>
            <p className="eyebrow">Packsmith</p>
            <h1>Forge template packs that can actually ship.</h1>
          </div>
        </div>

        <section className="briefPanel">
          <div className="panelHeader">
            <Sparkles size={18} />
            <h2>Launch Brief</h2>
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
            Product Promise
            <textarea
              value={brief.promise}
              onChange={(event) => updateBrief("promise", event.target.value)}
            />
          </label>

          <label>
            Source Notes
            <textarea value={brief.inputs} onChange={(event) => updateBrief("inputs", event.target.value)} />
          </label>

          <label>
            Visual Direction
            <textarea
              value={brief.imageDirection}
              onChange={(event) => updateBrief("imageDirection", event.target.value)}
            />
          </label>
        </section>

        <section className="savedPanel">
          <div className="panelHeader">
            <Save size={18} />
            <h2>Saved Runs</h2>
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

      <section className="stage">
        <header className="stageHeader">
          <div>
            <p className="eyebrow">MVP Workspace</p>
            <h2>{pack.name}</h2>
            <p>{pack.promise}</p>
          </div>
          <div className="actions">
            <button type="button" onClick={savePack}>
              <Save size={17} />
              Save
            </button>
            <button type="button" onClick={copyListing}>
              <Clipboard size={17} />
              Listing
            </button>
            <button type="button" onClick={exportMarkdown}>
              <Download size={17} />
              Markdown
            </button>
            <button type="button" className="primary" onClick={exportNotionJson}>
              <FileJson size={17} />
              Notion JSON
            </button>
          </div>
        </header>

        <div className="signalStrip">
          <div>
            <span>Revenue angle</span>
            <strong>{pack.suggestedPrice}</strong>
          </div>
          <div>
            <span>Pack strength</span>
            <strong>{pack.valueScore}/100</strong>
          </div>
          <div>
            <span>Build stage</span>
            <strong>{pack.buildStage}</strong>
          </div>
        </div>

        <nav className="sectionTabs" aria-label="Template pack outputs">
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

        <section className="builderSurface">
          <div className="sectionLead">
            <div className="sectionIcon">
              <SelectedIcon size={26} />
            </div>
            <div>
              <p className="eyebrow">Generated Output</p>
              <h3>{selectedSection.label}</h3>
              <p>{selectedSection.summary}</p>
            </div>
          </div>

          <div className="assetGrid">
            {selectedSection.items.map((item, index) => (
              <article className="assetCard" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="marketSection">
          <article className="listingPanel">
            <div className="panelHeader">
              <Rocket size={18} />
              <h2>Store Listing</h2>
            </div>
            <h3>{pack.listing.title}</h3>
            <p>{pack.listing.description}</p>
            <div className="tags">
              {pack.listing.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>

          <article className="launchPanel">
            <div className="panelHeader">
              <CheckCircle2 size={18} />
              <h2>Launch Steps</h2>
            </div>
            <ol>
              {pack.launchPlan.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>
        </section>
      </section>

      <aside className="connectorRail">
        <div className="connectorHeader">
          <p className="eyebrow">Connectors</p>
          <h2>Platform path</h2>
        </div>

        <div className="connectorList">
          {connectorRoadmap.map((connector) => (
            <article className="connectorCard" key={connector.id}>
              <div>
                <span className={`dot ${connector.id}`} />
                <strong>{connector.name}</strong>
              </div>
              <p>{connector.description}</p>
              <div className="connectorMeta">
                <span>{connector.status}</span>
                <span>{connector.depth}</span>
              </div>
              <small>{connector.nextStep}</small>
            </article>
          ))}
        </div>

        <section className="notionPayload">
          <div className="panelHeader">
            <Layers3 size={18} />
            <h2>Notion Payload</h2>
          </div>
          <p className="muted">
            First full connector target: pages, databases, and properties are ready to send through a
            backend route.
          </p>
          <div className="payloadStats">
            <div>
              <strong>{notionExport.pages.length}</strong>
              <span>Pages</span>
            </div>
            <div>
              <strong>{Object.keys(notionExport.databases).length}</strong>
              <span>Databases</span>
            </div>
          </div>
          <button type="button" className="primary wide" onClick={exportNotionJson}>
            Export connector payload
            <ArrowRight size={17} />
          </button>
        </section>
      </aside>

      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}

export default App;
