import { describe, expect, it } from "vitest";
import {
  buildPacksmithOpenApiSpec,
  exportPackAsset,
  generatePackResponse,
  packsmithApiRoutes,
  sanitizeApiPayload,
} from "./packsmithApiContract";

describe("packsmith API contract", () => {
  it("defines the shared API routes needed by assistant and plugin surfaces", () => {
    expect(packsmithApiRoutes.map((route) => route.id)).toEqual([
      "generate_pack",
      "get_saved_pack",
      "export_markdown",
      "export_notion",
      "export_figma",
      "export_gumroad",
      "export_marketplace",
    ]);
  });

  it("sanitizes secret-like fields recursively", () => {
    const sanitized = sanitizeApiPayload({
      presetId: "aiAgency",
      notionToken: "hidden",
      nested: {
        apiKey: "hidden",
        buyer: "AI freelancer",
      },
    });

    expect(sanitized.notionToken).toBeUndefined();
    expect(sanitized.nested.apiKey).toBeUndefined();
    expect(sanitized.nested.buyer).toBe("AI freelancer");
  });

  it("generates a preset pack with portable exports", () => {
    const response = generatePackResponse({ presetId: "saasLaunch" });

    expect(response.apiVersion).toContain("packsmith-api");
    expect(response.pack.name).toContain("SaaS");
    expect(response.exports.markdown).toContain("#");
    expect(response.exports.notion.databases.length).toBeGreaterThan(0);
    expect(response.exports.figma.frames.length).toBeGreaterThan(0);
    expect(response.exports.gumroad.markdown).toContain("## Refund Policy");
    expect(response.security.containsSecrets).toBe(false);
  });

  it("exports individual assets with stable filenames and content types", () => {
    const figma = exportPackAsset({ presetId: "aiAgency" }, "figma");
    const gumroad = exportPackAsset({ presetId: "aiAgency" }, "gumroad");

    expect(figma.asset.filename).toContain("figma-export.json");
    expect(figma.asset.contentType).toBe("application/json");
    expect(gumroad.asset.filename).toContain("gumroad-listing.md");
    expect(gumroad.asset.contentType).toBe("text/markdown");
    expect(gumroad.asset.content).toContain("## License");
  });

  it("builds an OpenAPI spec for ChatGPT Actions and future plugins", () => {
    const spec = buildPacksmithOpenApiSpec("https://example.com");

    expect(spec.openapi).toBe("3.1.0");
    expect(spec.servers[0].url).toBe("https://example.com");
    expect(spec.paths["/api/packsmith/generate"].post.operationId).toBe("generate_pack");
    expect(spec.components.schemas.PackRequest.properties.exportType.enum).toContain("gumroad");
  });
});
