import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { MerchantRiskExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): MerchantRiskExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as MerchantRiskExport;

const NOW = "2026-05-30T08:00:00Z";

describe("analyze", () => {
  it("counts snapshots and gap families", () => {
    const report = analyze(fixture("merchant-risk.json"), { now: NOW });
    expect(report.merchants).toBe(2);
    expect(report.currentSnapshots).toBe(1);
    expect(report.gaps).toBe(6);
    expect(report.blockingGaps).toBe(4);
    expect(report.reserveGaps).toBe(1);
    expect(report.reviewQueueGaps).toBe(2);
  });

  it("flags chargeback pressure as high", () => {
    const report = analyze(fixture("merchant-risk.json"), { now: NOW });
    const finding = report.findingsList.find((item) => item.code === "chargeback-pressure");
    expect(finding?.severity).toBe("high");
  });

  it("flags KYB refresh and reserve gaps", () => {
    const report = analyze(fixture("merchant-risk.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "kyb-refresh-overdue")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "reserve-gap")).toBeDefined();
  });

  it("flags payout and volume review drift", () => {
    const report = analyze(fixture("merchant-risk.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "payout-throttle-missing")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "volume-spike-without-review")).toBeDefined();
  });

  it("returns ok=true on a clean fixture", () => {
    const report = analyze(fixture("merchant-risk-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((item) => item.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("renders findings in markdown", () => {
    const markdown = toMarkdown(analyze(fixture("merchant-risk.json"), { now: NOW }));
    expect(markdown).toContain("Merchant risk posture needs work");
    expect(markdown).toContain("chargeback-pressure");
  });

  it("renders clean markdown and summary", () => {
    const report = analyze(fixture("merchant-risk-clean.json"), { now: NOW });
    expect(toMarkdown(report)).toContain("Merchant risk posture OK");
    expect(toMarkdown(report)).toContain("No findings.");
    expect(toSummary(report)).toMatch(/^2 merchants/);
  });
});
