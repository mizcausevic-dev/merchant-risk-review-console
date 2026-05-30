import { describe, expect, it } from "vitest";

import {
  merchantLane,
  payload,
  reviewPosture,
  riskFindings,
  summary,
  verification
} from "./merchantRiskReviewConsoleService.js";

describe("merchantRiskReviewConsoleService", () => {
  it("returns summary metrics", () => {
    expect(summary().merchants).toBe(2);
    expect(summary().highFindings).toBeGreaterThan(0);
  });

  it("returns one merchant-lane item per packet", () => {
    expect(merchantLane()).toHaveLength(4);
  });

  it("sorts high findings first", () => {
    const findings = riskFindings();
    expect(findings[0]?.severity).toBe("high");
  });

  it("returns review posture packets", () => {
    expect(reviewPosture()).toHaveLength(4);
  });

  it("returns verification claims and payload", () => {
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
