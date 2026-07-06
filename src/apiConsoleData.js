import {
  buildPacksmithOpenApiSpec,
  exportPackAsset,
  generatePackResponse,
  packsmithApiRoutes,
  sanitizeApiPayload,
} from "./packsmithApiContract";

export const defaultApiBaseUrl = "https://packsmith.app";

export function buildChatGptActionInstructions(baseUrl = defaultApiBaseUrl) {
  return {
    title: "Packsmith ChatGPT Action Setup",
    summary:
      "Create a Custom GPT that uses the Packsmith OpenAPI schema to generate template packs and export marketplace-ready assets.",
    steps: [
      "Create a new Custom GPT for Packsmith Template Pack Builder.",
      "Open Actions and import the exported OpenAPI schema.",
      `Set the server URL to ${baseUrl}.`,
      "Start with unauthenticated generation and exports.",
      "Add OAuth/login only after cloud save and paid export limits are deployed.",
      "Test generate_pack, export_gumroad, export_figma, and export_notion with safe sample briefs.",
    ],
    authNotes: [
      "Public generation can stay unauthenticated for demos.",
      "Cloud save, user history, and publishing should require Packsmith login.",
      "Notion, Google, Supabase service-role, and payment secrets must never be exposed in the GPT Action schema.",
    ],
    starterPrompt:
      "You are Packsmith, a template-pack forge. Ask for niche, buyer, pain point, promise, assets, platforms, visual style, and marketplace target. Then call generate_pack and offer Markdown, Notion, Figma, Gumroad, and marketplace exports.",
  };
}

function summarizeGeneratedPack(response) {
  return {
    apiVersion: response.apiVersion,
    pack: {
      name: response.pack.name,
      presetId: response.pack.presetId,
      buyer: response.pack.buyer,
      quality: response.pack.quality,
      sectionCount: response.pack.sections.length,
      launchChannelCount: response.pack.launchChannels.length,
    },
    availableExports: Object.keys(response.exports),
    security: response.security,
  };
}

export function buildApiConsoleSamples() {
  const generatePresetRequest = {
    presetId: "aiAgency",
    mode: "preset",
  };
  const generateCustomRequest = {
    mode: "custom",
    brief: {
      niche: "Creator sponsorship ops",
      buyer: "Solo newsletter creators selling sponsorship slots",
      painPoint: "They manage leads, pricing, creative approvals, and renewals across too many sheets.",
      promise: "Turn sponsorship sales into a polished Notion CRM, Figma media kit, and launch asset pack.",
      assets: "sponsor CRM, pricing calculator, media kit, outreach scripts, renewal dashboard",
      platforms: ["Notion", "Figma", "Canva"],
      marketplaceTarget: "Gumroad",
    },
  };
  const gumroadExportRequest = {
    presetId: "aiAgency",
    exportType: "gumroad",
  };
  const figmaExportRequest = {
    presetId: "saasLaunch",
    exportType: "figma",
  };

  return [
    {
      id: "generate-preset",
      label: "Generate preset pack",
      routeId: "generate_pack",
      request: sanitizeApiPayload(generatePresetRequest),
      response: summarizeGeneratedPack(generatePackResponse(generatePresetRequest)),
    },
    {
      id: "generate-custom",
      label: "Generate custom pack",
      routeId: "generate_pack",
      request: sanitizeApiPayload(generateCustomRequest),
      response: summarizeGeneratedPack(generatePackResponse(generateCustomRequest)),
    },
    {
      id: "export-gumroad",
      label: "Export Gumroad listing",
      routeId: "export_gumroad",
      request: sanitizeApiPayload(gumroadExportRequest),
      response: exportPackAsset(gumroadExportRequest, "gumroad"),
    },
    {
      id: "export-figma",
      label: "Export Figma schema",
      routeId: "export_figma",
      request: sanitizeApiPayload(figmaExportRequest),
      response: exportPackAsset(figmaExportRequest, "figma"),
    },
  ];
}

export function buildApiConsoleModel(baseUrl = defaultApiBaseUrl) {
  const openApiSpec = buildPacksmithOpenApiSpec(baseUrl);
  const instructions = buildChatGptActionInstructions(baseUrl);
  const samples = buildApiConsoleSamples();

  return {
    baseUrl,
    openApiSpec,
    routes: packsmithApiRoutes,
    instructions,
    samples,
    securityChecklist: [
      "No API keys, OAuth secrets, Notion tokens, payment details, or Supabase service-role keys in examples.",
      "Generation and export routes can be public for demo use; save and publish routes must require auth.",
      "Assistant surfaces should ask before writing, publishing, saving, or opening checkout.",
      "Use server-side secrets for connector publishing and payment-provider webhooks.",
    ],
  };
}
