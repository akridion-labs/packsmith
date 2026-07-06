import { describe, expect, it } from "vitest";
import { buildPackCoverModel, buildPackCoverSvg } from "./packCoverGenerator";

describe("pack cover generator", () => {
  it("builds a cover model from pack metadata", () => {
    const model = buildPackCoverModel({
      name: "AI Agency Launch Kit",
      presetId: "aiAgency",
      marketplaceTarget: "Gumroad",
      suggestedPrice: "$79",
      quality: { overall: 91 },
    });

    expect(model.title).toBe("AI Agency Launch Kit");
    expect(model.badge).toBe("Gumroad");
    expect(model.price).toBe("$79");
    expect(model.score).toBe(91);
  });

  it("generates an escaped SVG cover", () => {
    const svg = buildPackCoverSvg({
      name: "Bad <script>alert(1)</script>",
      presetId: "custom",
      promise: "Sell & launch safely",
      marketplaceTarget: "Gumroad",
      suggestedPrice: "$29",
      quality: { overall: 80 },
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain("1600");
    expect(svg).toContain("Bad &lt;script&gt;alert(1)&lt;/script&gt;");
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("80/100");
  });
});
