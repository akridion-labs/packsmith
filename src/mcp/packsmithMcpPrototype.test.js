import { describe, expect, it } from "vitest";
import {
  buildClaudeDesktopMcpConfig,
  callPacksmithMcpTool,
  handlePacksmithMcpRequest,
  packsmithMcpTools,
} from "./packsmithMcpPrototype";

describe("packsmith MCP prototype", () => {
  it("exposes assistant-safe Packsmith tools", () => {
    expect(packsmithMcpTools.map((tool) => tool.name)).toEqual([
      "generate_template_pack",
      "export_pack_markdown",
      "export_notion_payload",
      "export_figma_schema",
      "export_gumroad_listing",
      "get_packsmith_api_contract",
    ]);
  });

  it("handles initialize and tools/list MCP requests", () => {
    const initialize = handlePacksmithMcpRequest({ jsonrpc: "2.0", id: 1, method: "initialize" });
    const tools = handlePacksmithMcpRequest({ jsonrpc: "2.0", id: 2, method: "tools/list" });

    expect(initialize.result.serverInfo.name).toBe("packsmith");
    expect(tools.result.tools).toHaveLength(6);
  });

  it("generates a template pack through tools/call", () => {
    const response = handlePacksmithMcpRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "generate_template_pack",
        arguments: {
          presetId: "aiAgency",
          apiKey: "must-not-survive",
        },
      },
    });
    const payload = JSON.parse(response.result.content[0].text);

    expect(payload.pack.name).toContain("AI Agency");
    expect(response.result.content[0].text).not.toContain("must-not-survive");
    expect(payload.security.containsSecrets).toBe(false);
  });

  it("exports specific assets through direct tool calls", () => {
    const markdown = callPacksmithMcpTool("export_pack_markdown", { presetId: "healthcareGrowth" });
    const figma = callPacksmithMcpTool("export_figma_schema", { presetId: "saasLaunch" });
    const gumroad = callPacksmithMcpTool("export_gumroad_listing", { presetId: "aiAgency" });

    expect(markdown.content[0].text).toContain("#");
    expect(JSON.parse(figma.content[0].text).frames.length).toBeGreaterThan(0);
    expect(gumroad.content[0].text).toContain("## Refund Policy");
  });

  it("returns an error for unknown tools and builds Claude config", () => {
    const unknown = callPacksmithMcpTool("delete_everything", {});
    const config = buildClaudeDesktopMcpConfig();

    expect(unknown.isError).toBe(true);
    expect(config.mcpServers.packsmith.command).toBe("node");
    expect(config.mcpServers.packsmith.env.PACKSMITH_MODE).toBe("local-prototype");
  });
});
