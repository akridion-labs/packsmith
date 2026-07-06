import { describe, expect, it } from "vitest";
import {
  buildApiConsoleModel,
  buildApiConsoleSamples,
  buildChatGptActionInstructions,
} from "./apiConsoleData";

describe("api console data", () => {
  function collectKeys(value) {
    if (Array.isArray(value)) return value.flatMap(collectKeys);
    if (!value || typeof value !== "object") return [];
    return Object.entries(value).flatMap(([key, childValue]) => [key, ...collectKeys(childValue)]);
  }

  it("builds ChatGPT Action setup instructions", () => {
    const instructions = buildChatGptActionInstructions("https://example.com");

    expect(instructions.steps.join(" ")).toContain("OpenAPI");
    expect(instructions.steps.join(" ")).toContain("https://example.com");
    expect(instructions.authNotes.join(" ")).toContain("must never be exposed");
    expect(instructions.starterPrompt).toContain("generate_pack");
  });

  it("builds safe API console samples", () => {
    const samples = buildApiConsoleSamples();
    const requestKeys = samples.flatMap((sample) => collectKeys(sample.request));
    const serializedRequests = JSON.stringify(samples.map((sample) => sample.request));

    expect(samples.map((sample) => sample.id)).toEqual([
      "generate-preset",
      "generate-custom",
      "export-gumroad",
      "export-figma",
    ]);
    expect(requestKeys.join(" ")).not.toMatch(/token|secret|apiKey|password/i);
    expect(serializedRequests).not.toContain("must-not-survive");
    expect(samples[0].response.availableExports).toContain("notion");
  });

  it("builds the API console model with OpenAPI routes and security notes", () => {
    const model = buildApiConsoleModel("https://api.packsmith.test");

    expect(model.openApiSpec.servers[0].url).toBe("https://api.packsmith.test");
    expect(model.routes.map((route) => route.id)).toContain("generate_pack");
    expect(model.routes.map((route) => route.id)).toContain("export_gumroad");
    expect(model.securityChecklist.length).toBeGreaterThanOrEqual(4);
  });
});
