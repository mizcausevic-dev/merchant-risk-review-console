export type ScopeKind = "MERCHANT" | "ACCOUNT" | "REGION" | "CHANNEL" | "REVIEW_QUEUE";
export type RiskHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type SnapshotStatus = "CURRENT" | "STALE";
export type GapStatus = "ADDED" | "REMOVED" | "CHANGED" | "DEGRADED";
export type ControlFamily =
  | "Chargeback"
  | "Reserve"
  | "Kyb"
  | "Payout"
  | "Fraud"
  | "Volume"
  | "Monitoring";

export interface MerchantRiskSnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  riskStatus: RiskHealth;
  snapshotStatus: SnapshotStatus;
  controlPath: string;
  owner: string;
  paymentVolumeUsd: number;
  chargebackRateBps: number;
  collectedAt: string;
}

export interface MerchantRiskGap {
  id: string;
  snapshotId: string;
  resourcePath: string;
  scope: ScopeKind;
  controlFamily: ControlFamily;
  status: GapStatus;
  expectedState: string;
  observedState: string;
  gapWindowHours: number;
  blocksApproval?: boolean;
  note?: string;
}

export interface MerchantRiskExport {
  snapshots?: MerchantRiskSnapshot[];
  gaps?: MerchantRiskGap[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-merchant-snapshot"
  | "stale-merchant-snapshot"
  | "chargeback-pressure"
  | "reserve-gap"
  | "kyb-refresh-overdue"
  | "payout-throttle-missing"
  | "fraud-rule-drift"
  | "volume-spike-without-review"
  | "stale-gap-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  controlFamily?: ControlFamily;
}

export interface PostureReport {
  generatedAt: string;
  merchants: number;
  currentSnapshots: number;
  gaps: number;
  blockingGaps: number;
  reserveGaps: number;
  reviewQueueGaps: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface PostureOptions {
  now?: string;
  staleGapAfterHours?: number;
}
