import type { MerchantRiskExport } from "../types.js";

export const sampleMerchantRiskPayload: MerchantRiskExport = {
  snapshots: [
    {
      id: "merchant-marketplace",
      name: "Cross-border marketplace",
      scope: "MERCHANT",
      riskStatus: "WATCH",
      snapshotStatus: "CURRENT",
      controlPath: "/merchants/cross-border-marketplace/review-posture",
      owner: "Merchant Risk Ops",
      paymentVolumeUsd: 4200000,
      chargebackRateBps: 98,
      collectedAt: "2026-05-30T14:00:00Z"
    },
    {
      id: "merchant-gaming",
      name: "Subscription gaming processor",
      scope: "MERCHANT",
      riskStatus: "CRITICAL",
      snapshotStatus: "STALE",
      controlPath: "/merchants/subscription-gaming/review-posture",
      owner: "FinTech Underwriting",
      paymentVolumeUsd: 1900000,
      chargebackRateBps: 146,
      collectedAt: "2026-05-27T09:20:00Z"
    }
  ],
  gaps: [
    {
      id: "gap-chargeback-spike",
      snapshotId: "merchant-gaming",
      resourcePath: "subscription-gaming / card-not-present lane",
      scope: "CHANNEL",
      controlFamily: "Chargeback",
      status: "DEGRADED",
      expectedState: "Chargeback rate stays below the underwriting threshold.",
      observedState: "Chargeback rate rose above threshold to 1.6% this week.",
      gapWindowHours: 18,
      blocksApproval: true,
      note: "Card-not-present fraud and disputes are rising together."
    },
    {
      id: "gap-kyb-refresh",
      snapshotId: "merchant-gaming",
      resourcePath: "subscription-gaming / beneficial-owner packet",
      scope: "ACCOUNT",
      controlFamily: "Kyb",
      status: "CHANGED",
      expectedState: "Beneficial-owner and KYB evidence refreshed inside the review window.",
      observedState: "KYB refresh is stale and one beneficial-owner attestation is expired.",
      gapWindowHours: 39,
      blocksApproval: true
    },
    {
      id: "gap-reserve-shortfall",
      snapshotId: "merchant-marketplace",
      resourcePath: "cross-border-marketplace / reserve floor",
      scope: "ACCOUNT",
      controlFamily: "Reserve",
      status: "DEGRADED",
      expectedState: "Reserve coverage stays above the payout exposure floor.",
      observedState: "Reserve posting is below the expected floor after the latest volume jump.",
      gapWindowHours: 12,
      blocksApproval: true
    },
    {
      id: "gap-fraud-rules",
      snapshotId: "merchant-marketplace",
      resourcePath: "cross-border-marketplace / high-risk geo screening",
      scope: "CHANNEL",
      controlFamily: "Fraud",
      status: "DEGRADED",
      expectedState: "Fraud rules remain enabled on the high-risk geo and BIN cluster.",
      observedState: "Coverage gap opened after a fraud-rule drift in the geo screening path.",
      gapWindowHours: 9,
      blocksApproval: false
    },
    {
      id: "gap-payout-speed",
      snapshotId: "merchant-marketplace",
      resourcePath: "cross-border-marketplace / same-day payout cohort",
      scope: "REVIEW_QUEUE",
      controlFamily: "Payout",
      status: "CHANGED",
      expectedState: "Payout throttles tighten automatically when review pressure increases.",
      observedState: "Same-day payouts continued without review-based throttling.",
      gapWindowHours: 21,
      blocksApproval: false
    },
    {
      id: "gap-volume-surge",
      snapshotId: "merchant-marketplace",
      resourcePath: "cross-border-marketplace / weekend surge review queue",
      scope: "REVIEW_QUEUE",
      controlFamily: "Volume",
      status: "DEGRADED",
      expectedState: "Manual-review staffing scales with weekend volume growth.",
      observedState: "Weekend volume surged 2.4x without additional review coverage.",
      gapWindowHours: 28,
      blocksApproval: true
    }
  ]
};

export const merchantLanePackets = [
  {
    id: "chargeback-lane",
    lane: "Chargeback control lane",
    owner: "Merchant Risk Ops",
    focus: "Dispute drift, fraud spillover, and account-level exception pressure",
    status: "red",
    note: "Chargeback pressure is outrunning the current account-review envelope.",
    nextAction: "Escalate the gaming processor for immediate dispute and fraud review."
  },
  {
    id: "kyb-lane",
    lane: "KYB refresh lane",
    owner: "FinTech Underwriting",
    focus: "Beneficial-owner evidence, KYB recency, and approval-safe entity proof",
    status: "red",
    note: "Beneficial-owner evidence is stale enough to weaken approval confidence.",
    nextAction: "Refresh ownership attestations before the next settlement window."
  },
  {
    id: "reserve-lane",
    lane: "Reserve coverage lane",
    owner: "Treasury Risk",
    focus: "Reserve floors, payout exposure, and volatility-safe funding posture",
    status: "yellow",
    note: "Reserve coverage dipped below the intended floor during a volume jump.",
    nextAction: "Increase reserve coverage and cap same-day payout exposure."
  },
  {
    id: "review-lane",
    lane: "Review queue lane",
    owner: "Fraud Operations",
    focus: "Manual review staffing, payout throttles, and surge coverage",
    status: "yellow",
    note: "Manual review and payout throttles are lagging behind weekend volume.",
    nextAction: "Add review capacity and throttle same-day payouts during the surge window."
  }
] as const;

export const reviewPosturePackets = [
  {
    packetId: "MRR-11",
    lane: "Chargeback remediation",
    owner: "Merchant Risk Ops",
    status: "red",
    completenessScore: 58,
    decisionNote: "Chargeback pressure is too high to call merchant posture stable.",
    blocker: "Gaming processor disputes are above threshold with no completed mitigation packet.",
    launchWindowHours: 6
  },
  {
    packetId: "MRR-18",
    lane: "KYB evidence refresh",
    owner: "FinTech Underwriting",
    status: "red",
    completenessScore: 63,
    decisionNote: "Entity proof is stale enough to weaken underwriting confidence.",
    blocker: "Beneficial-owner evidence is expired inside the active review window.",
    launchWindowHours: 10
  },
  {
    packetId: "MRR-24",
    lane: "Reserve restoration",
    owner: "Treasury Risk",
    status: "yellow",
    completenessScore: 74,
    decisionNote: "Reserve coverage is mostly visible, but still below the expected payout floor.",
    blocker: "Reserve floor has not caught up to the latest merchant volume profile.",
    launchWindowHours: 14
  },
  {
    packetId: "MRR-31",
    lane: "Review queue stabilization",
    owner: "Fraud Operations",
    status: "yellow",
    completenessScore: 79,
    decisionNote: "Surge review coverage exists, but payout throttles and manual review remain too loose.",
    blocker: "Weekend queue spikes are still outrunning human review capacity.",
    launchWindowHours: 24
  }
] as const;
