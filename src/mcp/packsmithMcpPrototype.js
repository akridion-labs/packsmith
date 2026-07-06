import {
  buildPacksmithOpenApiSpec,
  exportPackAsset,
  generatePackResponse,
  packsmithApiVersion,
  sanitizeApiPayload,
} from "../packsmithApiContract.js";

export const packsmithMcpServerInfo = {
  name: "packsmith",
  version: packsmithApiVersion,
  description: "Prototype MCP surface for generating and exporting Packsmith template packs.",
};

const baseInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presetId: {
      type: "string",
      enum: ["aiAgency", "saasLaunch", "healthcareGrowth"],
      description: "Packsmith niche preset to use.",
    },
    mode: {
      type: "string",
      enum: ["preset", "custom"],
      description: "Use a Packsmith preset or a custom brief.",
    },
    brief: {
      type: "object",
      additionalProperties: true,
      description: "Optional custom brief fields such as niche, buyer, painPoint, promise, assets, platforms, and marketplaceTarget.",
    },
  },
};

export const packsmithMcpTools = [
  {
    name: "generate_template_pack",
    title: "Generate Template Pack",
    description: "Generate a Packsmith template pack with all portable export surfaces.",
    inputSchema: baseInputSchema,
  },
  {
    name: "export_pack_markdown",
    title: "Export Pack Markdown",
    description: "Generate a Markdown export for a Packsmith template pack.",
    inputSchema: baseInputSchema,
  },
  {
    name: "export_notion_payload",
    title: "Export Notion Payload",
    description: "Generate the Notion workspace JSON payload for a Packsmith template pack.",
    inputSchema: baseInputSchema,
  },
  {
    name: "export_figma_schema",
    title: "Export Figma Schema",
    description: "Generate the Figma product-kit JSON schema for a Packsmith template pack.",
    inputSchema: baseInputSchema,
  },
  {
    name: "export_gumroad_listing",
    title: "Export Gumroad Listing",
    description: "Generate Gumroad listing Markdown, license, refund policy, and setup copy.",
    inputSchema: baseInputSchema,
  },
  {
    name: "get_packsmith_api_contract",
    title: "Get Packsmith API Contract",
    description: "Return the OpenAPI contract used by ChatGPT Actions, MCP, and future plugins.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseUrl: {
          type: "string",
          description: "Optional deployed Packsmith API base URL.",
        },
      },
    },
  },
];

function jsonContent(payload) {
  return [
    {
      type: "text",
      text: JSON.stringify(payload, null, 2),
    },
  ];
}

function textContent(text) {
  return [
    {
      type: "text",
      text,
    },
  ];
}

export function callPacksmithMcpTool(name, rawArguments = {}) {
  const args = sanitizeApiPayload(rawArguments);

  switch (name) {
    case "generate_template_pack":
      return {
        content: jsonContent(generatePackResponse(args)),
      };
    case "export_pack_markdown":
      return {
        content: textContent(exportPackAsset(args, "markdown").asset.content),
      };
    case "export_notion_payload":
      return {
        content: jsonContent(exportPackAsset(args, "notion").asset.content),
      };
    case "export_figma_schema":
      return {
        content: jsonContent(exportPackAsset(args, "figma").asset.content),
      };
    case "export_gumroad_listing":
      return {
        content: textContent(exportPackAsset(args, "gumroad").asset.content),
      };
    case "get_packsmith_api_contract":
      return {
        content: jsonContent(buildPacksmithOpenApiSpec(args.baseUrl || "https://packsmith.app")),
      };
    default:
      return {
        isError: true,
        content: textContent(`Unknown Packsmith MCP tool: ${name}`),
      };
  }
}

export function handlePacksmithMcpRequest(request = {}) {
  const method = request.method;

  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: "2025-06-18",
        serverInfo: packsmithMcpServerInfo,
        capabilities: {
          tools: {},
          resources: {},
        },
      },
    };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        tools: packsmithMcpTools,
      },
    };
  }

  if (method === "tools/call") {
    const result = callPacksmithMcpTool(request.params?.name, request.params?.arguments || {});
    return {
      jsonrpc: "2.0",
      id: request.id,
      result,
    };
  }

  return {
    jsonrpc: "2.0",
    id: request.id,
    error: {
      code: -32601,
      message: `Unsupported Packsmith MCP method: ${method}`,
    },
  };
}

export function buildClaudeDesktopMcpConfig(command = "node", args = ["./scripts/packsmith-mcp-server.mjs"]) {
  return {
    mcpServers: {
      packsmith: {
        command,
        args,
        env: {
          PACKSMITH_MODE: "local-prototype",
        },
      },
    },
  };
}
