export const mobileAccessModes = [
  {
    id: "pwa",
    label: "Phone home-screen app",
    device: "iPhone / Android",
    status: "Ready next",
    promise: "Open Packsmith from the browser and add it to the home screen like a lightweight app.",
    actions: [
      "Use the public homepage, launch page, dashboard, and forge from a mobile browser",
      "Install from browser menu when the PWA prompt is available",
      "Keep local saved packs available on the same device",
    ],
  },
  {
    id: "tablet",
    label: "Tablet workspace",
    device: "iPad / Android tablet",
    status: "Recommended",
    promise: "Use the full forge with bigger editing panels, exports, dashboard history, and launch tracking.",
    actions: [
      "Use dashboard to reopen a saved pack",
      "Edit brief fields and generated output blocks",
      "Export Markdown, Notion JSON, marketplace JSON, and launch calendar",
    ],
  },
  {
    id: "notion",
    label: "Notion mobile handoff",
    device: "Notion app",
    status: "Connector path",
    promise: "Generate Notion-ready schemas in Packsmith and publish through the backend path when configured.",
    actions: [
      "Simulate publish in Packsmith before real publishing",
      "Use Supabase Edge Function for real Notion publishing",
      "Open created Notion pages inside the Notion mobile or tablet app",
    ],
  },
  {
    id: "assistants",
    label: "Claude / ChatGPT handoff",
    device: "AI assistant apps",
    status: "Export-first",
    promise: "Use Packsmith exports as clean context for Claude, ChatGPT, or any assistant workflow.",
    actions: [
      "Export Markdown pack for assistant refinement",
      "Export marketplace JSON for listing generation",
      "Export marketing kit for video, LinkedIn, and X content",
    ],
  },
];

export const nativeAppDecision = {
  recommendation: "Start with PWA before native app",
  reason:
    "A PWA validates mobile usage faster, avoids app-store delays, and keeps the same React codebase. Build native only after mobile users repeatedly save, reopen, and publish packs.",
  nativeTriggers: [
    "Users ask for push reminders around launch tasks",
    "Mobile saved-pack usage becomes a top workflow",
    "Offline editing becomes important",
    "You need paid subscriptions through app-store channels",
  ],
};

export function buildMobileAccessChecklist({ hasSupabase = false, hasNotionParent = false } = {}) {
  return [
    {
      id: "responsive-ui",
      label: "Responsive web UI",
      ready: true,
      status: "Available",
    },
    {
      id: "pwa-shell",
      label: "Installable PWA shell",
      ready: true,
      status: "Prepared",
    },
    {
      id: "cloud-sync",
      label: "Cross-device cloud sync",
      ready: hasSupabase,
      status: hasSupabase ? "Ready with login" : "Needs Supabase env vars",
    },
    {
      id: "notion-mobile",
      label: "Notion app access",
      ready: hasSupabase && hasNotionParent,
      status: hasSupabase && hasNotionParent ? "Publish path ready" : "Use simulate/export first",
    },
    {
      id: "assistant-handoff",
      label: "Claude / ChatGPT handoff",
      ready: true,
      status: "Markdown and JSON exports",
    },
  ];
}

export function buildAssistantHandoffPrompt(packName = "Packsmith template pack") {
  return `You are helping refine ${packName}. Use the exported Markdown or JSON as source context. Improve the buyer clarity, asset completeness, Notion workspace structure, marketplace listing, and launch copy without inventing medical, legal, or financial advice. Keep the final output practical, editable, and ready to paste back into Packsmith.`;
}
