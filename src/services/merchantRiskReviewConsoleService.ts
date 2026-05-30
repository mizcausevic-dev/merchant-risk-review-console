// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { merchantLanePackets, reviewPosturePackets, sampleMerchantRiskPayload } from "../data/sampleMerchantRisk.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleMerchantRiskPayload, {
  now: NOW,
  staleGapAfterHours: 24
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    merchants: report.merchants,
    currentSnapshots: report.currentSnapshots,
    gaps: report.gaps,
    blockingGaps: report.blockingGaps,
    reserveGaps: report.reserveGaps,
    reviewQueueGaps: report.reviewQueueGaps,
    highFindings: report.findingsList.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Reduce chargeback drift, refresh KYB evidence, raise reserve coverage, and tighten payout review before calling merchant posture approval-safe."
  };
}

export function merchantLane() {
  return merchantLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "chargeback-lane") return finding.code === "chargeback-pressure";
      if (lane.id === "kyb-lane") return finding.code === "kyb-refresh-overdue";
      if (lane.id === "reserve-lane") return finding.code === "reserve-gap";
      if (lane.id === "review-lane") return finding.code === "payout-throttle-missing" || finding.code === "volume-spike-without-review";
      return false;
    }).length
  }));
}

export function riskFindings() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.code === "chargeback-pressure"
          ? "Merchant Risk Ops"
          : finding.code === "kyb-refresh-overdue"
            ? "FinTech Underwriting"
            : finding.code === "reserve-gap"
              ? "Treasury Risk"
              : finding.code === "payout-throttle-missing" || finding.code === "volume-spike-without-review"
                ? "Fraud Operations"
                : finding.code === "fraud-rule-drift"
                  ? "Fraud Strategy"
                  : "Merchant Risk Ops"
    }));
}

export function reviewPosture() {
  return reviewPosturePackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline analyzer and CLI, not static copy alone.",
    "Snapshots and merchant-review gap packets are synthetic sample data only; no live account credentials, processor secrets, or production payouts are published.",
    "The control plane keeps chargebacks, reserve posture, KYB recency, payout throttles, and manual review coverage visible for FinTech stakeholders.",
    "This surface demonstrates merchant review and underwriting operations depth, not a generic payments keyword page.",
    "It complements reconciliation and KYC routing proof with a concrete merchant-risk lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    merchantLane: merchantLane(),
    riskFindings: riskFindings(),
    reviewPosture: reviewPosture(),
    verification: verification(),
    sample: sampleMerchantRiskPayload
  };
}
