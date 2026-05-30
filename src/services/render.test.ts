import { describe, expect, it } from "vitest";

import {
  renderDocs,
  renderMerchantLane,
  renderOverview,
  renderReviewPosture,
  renderRiskFindings,
  renderVerification
} from "./render.js";

describe("render", () => {
  it("renders the overview", () => {
    expect(renderOverview()).toContain("Merchant risk review");
    expect(renderOverview()).toContain("FinTech vertical anchor");
  });

  it("renders the docs surface", () => {
    expect(renderDocs()).toContain("/api/merchant-lane");
    expect(renderDocs()).toContain("merchant-risk-review-console");
  });

  it("renders all route views", () => {
    expect(renderMerchantLane()).toContain("Merchant Lane");
    expect(renderRiskFindings()).toContain("Risk Findings");
    expect(renderReviewPosture()).toContain("Review Posture");
    expect(renderVerification()).toContain("Verification");
  });
});
