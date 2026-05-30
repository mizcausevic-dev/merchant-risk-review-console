import type { Finding, MerchantRiskExport, MerchantRiskSnapshot, PostureOptions, PostureReport } from "./types.js";

function isCurrent(snapshot: MerchantRiskSnapshot): boolean {
  return snapshot.snapshotStatus === "CURRENT";
}

function includesAny(text: string, needles: string[]): boolean {
  const haystack = text.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

export function analyze(payload: MerchantRiskExport, options: PostureOptions = {}): PostureReport {
  const now = options.now ?? new Date().toISOString();
  const staleGapAfterHours = options.staleGapAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const gaps = payload.gaps ?? [];
  const findingsList: Finding[] = [];

  const currentSnapshots = snapshots.filter(isCurrent).length;
  if (currentSnapshots === 0) {
    findingsList.push({
      code: "no-current-merchant-snapshot",
      severity: "high",
      message: "No current merchant-risk snapshot is available for review.",
      subject: "merchant-snapshot-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.snapshotStatus === "STALE") {
      findingsList.push({
        code: "stale-merchant-snapshot",
        severity: snapshot.riskStatus === "CRITICAL" ? "high" : "medium",
        message: `Merchant snapshot for "${snapshot.name}" is stale and should be refreshed before approval posture is trusted.`,
        subject: snapshot.id,
        subjectName: snapshot.controlPath,
        scope: snapshot.scope
      });
    }
  }

  for (const gap of gaps) {
    const observed = gap.observedState.toLowerCase();

    if (gap.controlFamily === "Chargeback" && includesAny(observed, ["1.4%", "1.6%", "above threshold", "spike", "chargeback"])) {
      findingsList.push({
        code: "chargeback-pressure",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Chargeback pressure is too high on "${gap.resourcePath}" for a clean merchant-risk posture.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Reserve" && includesAny(observed, ["below", "not posted", "shortfall", "reserve"])) {
      findingsList.push({
        code: "reserve-gap",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Reserve coverage is incomplete on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Kyb" && includesAny(observed, ["expired", "stale", "missing", "refresh"])) {
      findingsList.push({
        code: "kyb-refresh-overdue",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `KYB and beneficial-owner evidence is stale on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Payout" && includesAny(observed, ["same-day", "manual", "not throttled", "instant payout"])) {
      findingsList.push({
        code: "payout-throttle-missing",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Payout controls are too loose on "${gap.resourcePath}" for the current review state.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Fraud" && includesAny(observed, ["disabled", "coverage gap", "drift", "missing rule"])) {
      findingsList.push({
        code: "fraud-rule-drift",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Fraud-review rules are drifting on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Volume" && includesAny(observed, ["spike", "2.4x", "without review", "surge"])) {
      findingsList.push({
        code: "volume-spike-without-review",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Volume growth outran manual review coverage on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.gapWindowHours > staleGapAfterHours) {
      findingsList.push({
        code: "stale-gap-window",
        severity: gap.gapWindowHours > staleGapAfterHours * 2 ? "medium" : "low",
        message: `Gap on "${gap.resourcePath}" has remained unresolved for ${gap.gapWindowHours} hours.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }
  }

  const blockingGaps = gaps.filter((gap) => gap.blocksApproval).length;
  const reserveGaps = gaps.filter((gap) => gap.controlFamily === "Reserve").length;
  const reviewQueueGaps = gaps.filter((gap) => gap.scope === "REVIEW_QUEUE").length;
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    merchants: snapshots.length,
    currentSnapshots,
    gaps: gaps.length,
    blockingGaps,
    reserveGaps,
    reviewQueueGaps,
    findingsList,
    ok
  };
}
