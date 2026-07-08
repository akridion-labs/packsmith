import { buildFigmaExportSchema } from "./figmaExport.js";
import { buildCustomPack } from "./localPackGenerator.js";
import { buildMarketingKit, marketingKitToMarkdown } from "./marketingData.js";
import {
  buildLaunchCalendar,
  buildLaunchKit,
  buildNotionExport,
  defaultPresetId,
  getPreset,
  platformOptions,
} from "./packsmithData.js";
import { buildGumroadCheckoutPlan, buildGumroadListingMarkdown } from "./revenueOpsData.js";

const sensitiveKeyPattern = /(token|secret|password|api[-_]?key|access[-_]?token|refresh[-_]?token|authorization|credential)/i;

export const packsmithApiVersion = "2026-07-packsmith-api-v1";

export const packsmithApiRoutes = [
  {
    id: "generate_pack",
    method: "POST",
    path: "/api/packsmith/generate",
    summary: "Generate a Packsmith template pack from a preset or custom brief.",
    auth: "optional",
  },
  {
    id: "get_saved_pack",
    method: "GET",
    path: "/api/packsmith/packs/{packId}",
    summary: "Return one saved template pack for the authenticated user.",
    auth: "required",
  },
  {
    id: "export_markdown",
    method: "POST",
    path: "/api/packsmith/exports/markdown",
    summary: "Export a template pack as Markdown.",
    auth: "optional",
  },
  {
    id: "export_notion",
    method: "POST",
    path: "/api/packsmith/exports/notion",
    summary: "Export a Notion workspace payload.",
    auth: "optional",
  },
  {
    id: "export_figma",
    method: "POST",
    path: "/api/packsmith/exports/figma",
    summary: "Export a Figma product-kit schema.",
    auth: "optional",
  },
  {
    id: "export_gumroad",
    method: "POST",
    path: "/api/packsmith/exports/gumroad",
    summary: "Export Gumroad listing copy, license, refund policy, and setup assets.",
    auth: "optional",
  },
  {
    id: "export_marketplace",
    method: "POST",
    path: "/api/packsmith/exports/marketplace",
    summary: "Export marketplace listing JSON and launch channel data.",
    auth: "optional",
  },
];

export const defaultAiAgencyPricing = [
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

export function sanitizeApiPayload(value) {
  if (Array.isArray(value)) return value.map(sanitizeApiPayload);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !sensitiveKeyPattern.test(key))
      .map(([key, childValue]) => [key, sanitizeApiPayload(childValue)]),
  );
}

export function slugifyPacksmith(value = "packsmith-export") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function packToMarkdown(pack, editedItems = {}) {
  const list = (items = []) => items.map((item) => `- ${item}`).join("\n");
  return `# ${pack.name}

${pack.promise}

Buyer: ${pack.buyer}
Pain point: ${pack.painPoint}
Price: ${pack.suggestedPrice}
Quality score: ${pack.quality?.overall || "--"}/100

## Platform Sections
${(pack.sections || [])
  .map((section) => {
    const items = editedItems[section.id] || section.items || [];
    return `### ${section.label}\n${section.summary}\n${list(items)}`;
  })
  .join("\n\n")}

## Listing
${pack.listing?.title || pack.name}

${pack.listing?.description || pack.promise}

Tags: ${(pack.listing?.tags || []).join(", ")}

## Launch Plan
${list(pack.launchPlan || [])}
`;
}

export function launchCalendarToMarkdown(calendar, pack) {
  return `# ${pack.name} Launch Calendar

${calendar.map((item) => `## ${item.day}: ${item.focus}\nOwner: ${item.owner}\n\n${item.action}`).join("\n\n")}
`;
}

export function marketplaceToJson(pack) {
  return {
    pack: pack.name,
    primaryChannel: pack.marketplaceTarget,
    listing: pack.listing,
    launchChannels: pack.launchChannels,
  };
}

export function createPackFromRequest(input = {}) {
  const safeInput = sanitizeApiPayload(input);
  const presetId = safeInput.presetId || defaultPresetId;
  const preset = getPreset(presetId);
  const brief = {
    ...(preset?.brief || getPreset(defaultPresetId).brief),
    ...(safeInput.brief || {}),
  };

  if (safeInput.mode === "custom") {
    return buildCustomPack({
      niche: brief.niche || "Custom template business",
      buyer: brief.buyer || "Solo founder",
      painPoint: brief.painPoint || brief.pain || "They need a packaged template product quickly.",
      promise: brief.promise || "Generate a launch-ready template pack.",
      assets: brief.assets || "dashboard, content pack, launch board",
      platforms: brief.platforms || platformOptions,
      style: brief.style || brief.visualDirection || "Retro-futuristic forge",
      marketplaceTarget: brief.marketplaceTarget || "Gumroad",
    });
  }

  return buildLaunchKit(brief, presetId);
}

function buildExportBundle(pack, options = {}) {
  const marketingKit = buildMarketingKit(pack);
  const notionPayload = buildNotionExport(pack);
  const figmaSchema = buildFigmaExportSchema(pack, marketingKit);
  const gumroadPlan = buildGumroadCheckoutPlan({
    pack,
    pricing: options.pricing || defaultAiAgencyPricing,
    kit: marketingKit,
    checkoutUrl: options.checkoutUrl || "",
  });
  const launchCalendar = buildLaunchCalendar(pack);

  return {
    marketingKit,
    notionPayload,
    figmaSchema,
    gumroadPlan,
    launchCalendar,
  };
}

export function generatePackResponse(input = {}) {
  const pack = createPackFromRequest(input);
  const bundle = buildExportBundle(pack, input);

  return {
    apiVersion: packsmithApiVersion,
    type: "template_pack",
    pack,
    exports: {
      markdown: packToMarkdown(pack, input.editedItems || {}),
      notion: bundle.notionPayload,
      figma: bundle.figmaSchema,
      marketplace: marketplaceToJson(pack),
      gumroad: {
        plan: bundle.gumroadPlan,
        markdown: buildGumroadListingMarkdown(bundle.gumroadPlan),
      },
      launchCalendar: launchCalendarToMarkdown(bundle.launchCalendar, pack),
      marketingMarkdown: marketingKitToMarkdown(pack, bundle.marketingKit),
    },
    security: {
      sanitizedInput: true,
      containsSecrets: false,
      note: "Packsmith API responses are generated from user-approved brief data. Connector secrets must stay server-side.",
    },
  };
}

export function exportPackAsset(input = {}, exportType = "markdown") {
  const response = generatePackResponse(input);
  const pack = response.pack;
  const exportMap = {
    markdown: {
      filename: `packsmith-${slugifyPacksmith(pack.name)}.md`,
      contentType: "text/markdown",
      content: response.exports.markdown,
    },
    notion: {
      filename: `packsmith-${slugifyPacksmith(pack.name)}-notion-payload.json`,
      contentType: "application/json",
      content: response.exports.notion,
    },
    figma: {
      filename: `packsmith-${slugifyPacksmith(pack.name)}-figma-export.json`,
      contentType: "application/json",
      content: response.exports.figma,
    },
    marketplace: {
      filename: `packsmith-${slugifyPacksmith(pack.name)}-marketplace.json`,
      contentType: "application/json",
      content: response.exports.marketplace,
    },
    gumroad: {
      filename: `packsmith-${slugifyPacksmith(pack.name)}-gumroad-listing.md`,
      contentType: "text/markdown",
      content: response.exports.gumroad.markdown,
    },
    launchCalendar: {
      filename: `packsmith-${slugifyPacksmith(pack.name)}-launch-calendar.md`,
      contentType: "text/markdown",
      content: response.exports.launchCalendar,
    },
  };

  return {
    apiVersion: packsmithApiVersion,
    exportType,
    pack: {
      name: pack.name,
      presetId: pack.presetId || input.presetId || defaultPresetId,
    },
    asset: exportMap[exportType] || exportMap.markdown,
  };
}

export function buildPacksmithOpenApiSpec(baseUrl = "https://packsmith.app") {
  return {
    openapi: "3.1.0",
    info: {
      title: "Packsmith API",
      version: packsmithApiVersion,
      description: "Shared contract for Packsmith web app, ChatGPT Actions, Claude MCP, and creative plugin surfaces.",
    },
    servers: [{ url: baseUrl }],
    paths: Object.fromEntries(
      packsmithApiRoutes.map((route) => [
        route.path,
        {
          [route.method.toLowerCase()]: {
            operationId: route.id,
            summary: route.summary,
            "x-packsmith-auth": route.auth,
            requestBody:
              route.method === "POST"
                ? {
                    required: true,
                    content: {
                      "application/json": {
                        schema: { $ref: "#/components/schemas/PackRequest" },
                      },
                    },
                  }
                : undefined,
            responses: {
              200: {
                description: "Packsmith response",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/PacksmithResponse" },
                  },
                },
              },
            },
          },
        },
      ]),
    ),
    components: {
      schemas: {
        PackRequest: {
          type: "object",
          additionalProperties: false,
          properties: {
            presetId: { type: "string", enum: ["aiAgency", "saasLaunch", "healthcareGrowth"] },
            mode: { type: "string", enum: ["preset", "custom"] },
            brief: { type: "object", additionalProperties: true },
            exportType: { type: "string", enum: ["markdown", "notion", "figma", "gumroad", "marketplace", "launchCalendar"] },
          },
        },
        PacksmithResponse: {
          type: "object",
          additionalProperties: true,
          properties: {
            apiVersion: { type: "string" },
            type: { type: "string" },
            pack: { type: "object" },
            exports: { type: "object" },
            security: { type: "object" },
          },
        },
      },
    },
  };
}
