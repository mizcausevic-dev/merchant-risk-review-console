// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  merchantLane,
  payload,
  reviewPosture,
  riskFindings,
  summary,
  verification
} from "./merchantRiskReviewConsoleService.js";

function layout(title: string, active: string, body: string) {
  const nav = [
    { href: "/", label: "Overview" },
    { href: "/merchant-lane", label: "Merchant Lane" },
    { href: "/risk-findings", label: "Risk Findings" },
    { href: "/review-posture", label: "Review Posture" },
    { href: "/verification", label: "Verification" },
    { href: "/docs", label: "Docs" }
  ];

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root{
        --bg:#070a0f; --panel:#0b1220; --line:rgba(120,255,170,.18); --line2:rgba(120,255,170,.10);
        --text:#e9f3ff; --muted:rgba(233,243,255,.72); --muted2:rgba(233,243,255,.55);
        --bert:#37ff8b; --bert2:#19c7ff; --warn:#ffcc66; --bad:#ff5c7a; --good:#37ff8b; --plum:#b88cff;
        --shadow:0 18px 60px rgba(0,0,0,.55);
        --mono:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --sans:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      *{box-sizing:border-box} html,body{height:100%}
      body{
        margin:0; font-family:var(--sans); color:var(--text);
        background:
          radial-gradient(1200px 600px at 20% -10%, rgba(55,255,139,.18), transparent 60%),
          radial-gradient(900px 520px at 90% 0%, rgba(25,199,255,.16), transparent 55%),
          radial-gradient(1000px 600px at 50% 110%, rgba(55,255,139,.10), transparent 60%),
          linear-gradient(180deg, #05070c 0%, #070a0f 35%, #05070c 100%);
      }
      .wrap{max-width:1280px; margin:0 auto; padding:24px 22px 80px}
      .topbar{
        display:flex; justify-content:space-between; align-items:flex-start; gap:14px;
        border-bottom:1px solid var(--line2); padding-bottom:14px; margin-bottom:22px;
        font-family:var(--mono); font-size:11px; letter-spacing:.16em; color:var(--muted); text-transform:uppercase;
      }
      .topbar .left{color:var(--bert)}
      .topbar .right{text-align:right}
      .topbar .right div{margin-bottom:4px}
      .herorow{display:grid; grid-template-columns:1.5fr .9fr; gap:18px}
      @media (max-width:1000px){.herorow{grid-template-columns:1fr}}
      .hero,.corr,.bluf{background:linear-gradient(180deg, rgba(11,18,32,.95), rgba(8,14,26,.92)); border:1px solid var(--line); box-shadow:var(--shadow)}
      .hero{border-radius:22px; padding:28px 28px 24px; border-top:2px solid var(--bert2)}
      .hero h1{font-size:58px; line-height:.96; margin:0 0 16px; font-weight:800; letter-spacing:-.5px}
      @media (max-width:700px){.hero h1{font-size:40px}}
      .hero p{color:var(--muted); font-size:15px; line-height:1.55; max-width:680px; margin:0 0 18px}
      .chiprow,.navrow,.footer-links{display:flex; flex-wrap:wrap; gap:8px}
      .meta-chip,.navchip{
        font-family:var(--mono); font-size:11px; color:var(--muted);
        padding:8px 12px; border-radius:999px; border:1px solid var(--line);
        background:rgba(6,10,18,.4); text-decoration:none;
      }
      .navchip.active{color:#071017;background:linear-gradient(135deg,var(--bert),var(--bert2));font-weight:700}
      .side{display:flex; flex-direction:column; gap:14px}
      .corr,.bluf{border-radius:14px; padding:16px 18px}
      .corr{border-left:4px solid var(--bert)}
      .bluf{border-left:4px solid var(--warn)}
      .corr .lbl,.bluf .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase}
      .corr .lbl{color:var(--bert)} .bluf .lbl{color:var(--warn)}
      .corr p,.bluf p,.card p,.card li,.ttbl td,.ttbl th{color:var(--muted); line-height:1.55}
      .section{margin-top:34px}
      .sh{display:flex; justify-content:space-between; align-items:baseline; gap:14px; padding-bottom:10px; border-bottom:1px solid var(--line2); margin-bottom:14px}
      .sh h2{margin:0; font-size:24px}
      .sh .note{font-family:var(--mono); font-size:11px; color:var(--muted2); letter-spacing:.16em; text-transform:uppercase}
      .kpis{display:grid; grid-template-columns:repeat(6,1fr); gap:12px}
      @media (max-width:1100px){.kpis{grid-template-columns:repeat(3,1fr)}} @media (max-width:640px){.kpis{grid-template-columns:repeat(2,1fr)}}
      .kpi{border:1px solid var(--line); border-radius:14px; padding:14px; background:linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65))}
      .kpi .v{font-family:var(--mono); font-size:26px; font-weight:600; color:var(--bert2)}
      .kpi .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); margin-top:6px}
      .kpi .h{font-size:12px; color:var(--muted); margin-top:8px}
      .stack,.board{display:grid; grid-template-columns:repeat(3,1fr); gap:14px}
      @media (max-width:1000px){.stack,.board{grid-template-columns:1fr}}
      .src,.pcard{border-radius:16px; padding:18px 20px; border:1px solid var(--line); background:linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65))}
      .src .src-name{font-family:var(--mono); font-size:11px; color:var(--bert); letter-spacing:.18em; text-transform:uppercase}
      .src .src-tit{margin:8px 0 6px; font-size:18px; font-weight:600}
      .ttbl{width:100%; border-collapse:separate; border-spacing:0; border:1px solid var(--line); border-radius:14px; overflow:hidden}
      .ttbl th,.ttbl td{padding:13px 14px; text-align:left; font-size:13.5px; vertical-align:top}
      .ttbl thead th{font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted2); border-bottom:1px solid var(--line); background:rgba(11,18,32,.5)}
      .st{font-family:var(--mono); font-size:10px; padding:4px 9px; border-radius:6px; letter-spacing:.1em; text-transform:uppercase; border:1px solid currentColor; display:inline-block}
      .red{color:var(--bad)} .yellow{color:var(--warn)} .green{color:var(--good)} .info{color:var(--bert2)}
      .pcard .ptop{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px}
      .pcard .pnum{font-family:var(--mono); font-size:22px; font-weight:600; color:var(--bert)}
      .pcard .ppri{font-family:var(--mono); font-size:10px; padding:5px 10px; border-radius:999px; border:1px solid var(--line); color:var(--bert)}
      .pcard h3{margin:6px 0 8px; font-size:19px}
      .pcard .pdesc{font-size:13.5px; color:var(--muted); margin:0 0 14px}
      .pcard ul.check{list-style:none; padding:0; margin:0 0 14px}
      .pcard ul.check li{padding:6px 0; font-size:13.5px; color:var(--muted)}
      .footer{margin-top:30px; padding-top:14px; border-top:1px dashed var(--line2); display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; font-family:var(--mono); font-size:11px; color:var(--muted2)}
      a{color:inherit}
      code{font-family:var(--mono); font-size:12px; color:var(--bert2); background:rgba(25,199,255,.08); padding:1px 6px; border-radius:5px; border:1px solid rgba(25,199,255,.18)}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="topbar">
        <div class="left">Kinetic Gain · Merchant Risk Review Console</div>
        <div class="right">
          <div>synthetic merchant packets · underwriting posture</div>
          <div>fintech · merchant risk · chargebacks · reserve coverage</div>
        </div>
      </div>
      <div class="herorow">
        <section class="hero">
          <div class="chiprow">
            <span class="meta-chip">FinTech vertical anchor</span>
            <span class="meta-chip">Merchant underwriting and review proof</span>
            <span class="meta-chip">Synthetic sample data only</span>
          </div>
          <h1>Merchant risk review that stays visible before chargeback drift and payout exposure outrun approval posture.</h1>
          <p>This control plane turns merchant-review snapshots into one operator surface: chargeback pressure, reserve coverage, KYB recency, payout throttles, fraud-rule drift, and manual-review surge posture.</p>
          <div class="navrow">
            ${nav.map((link) => `<a class="navchip${active === link.href ? " active" : ""}" href="${link.href}">${link.label}</a>`).join("")}
          </div>
        </section>
        <aside class="side">
          <div class="bluf">
            <div class="lbl">Commercial Front Door</div>
            <p><strong>Merchant review, underwriting, and payout-safety proof for FinTech risk teams.</strong><br />Audit-safe visibility into chargebacks, KYB refresh, reserves, review queues, and approval readiness without exposing live processor secrets.</p>
          </div>
          <div class="corr">
            <div class="lbl">Proof Layer</div>
            <p><strong>Offline analyzer plus dashboard surface.</strong><br />This repo includes a reusable analyzer that reads merchant snapshots and turns them into lane, finding, and review-posture packets.</p>
          </div>
          <div class="corr">
            <div class="lbl">Why it matters</div>
            <p>Recruiters and buyers looking for <strong>FinTech, merchant risk, underwriting, payouts, chargebacks, KYC, and fraud operations</strong> should see a real review surface, not a generic payments keyword page.</p>
          </div>
        </aside>
      </div>
      ${body}
      <div class="footer">
        <div>merchant-risk-review-console · synthetic sample data only</div>
        <div class="footer-links">
          <a class="meta-chip" href="https://github.com/mizcausevic-dev/">GitHub</a>
          <a class="meta-chip" href="https://www.linkedin.com/in/mirzacausevic/">LinkedIn</a>
          <a class="meta-chip" href="https://kineticgain.com/">Kinetic Gain</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function severityClass(value: string) {
  if (value === "high" || value === "red") return "red";
  if (value === "medium" || value === "yellow") return "yellow";
  if (value === "green" || value === "low") return "green";
  return "info";
}

export function renderOverview() {
  const metrics = summary();
  return layout(
    "Merchant Risk Review Console",
    "/",
    `<section class="section">
        <div class="sh"><h2>Operator Snapshot</h2><div class="note">chargebacks · reserve · kyb · payouts</div></div>
        <div class="kpis">
          <div class="kpi"><div class="v">${metrics.merchants}</div><div class="lbl">snapshots</div><div class="h">Synthetic merchant review snapshots across payment lanes and queues.</div></div>
          <div class="kpi"><div class="v">${metrics.currentSnapshots}</div><div class="lbl">current</div><div class="h">Snapshots fresh enough to trust for approval decisions.</div></div>
          <div class="kpi"><div class="v">${metrics.gaps}</div><div class="lbl">gaps</div><div class="h">Observed risk deviations across chargeback, reserve, KYB, payout, and fraud lanes.</div></div>
          <div class="kpi"><div class="v">${metrics.blockingGaps}</div><div class="lbl">blocking</div><div class="h">Gaps actively weakening approval or settlement posture.</div></div>
          <div class="kpi"><div class="v">${metrics.reserveGaps}</div><div class="lbl">reserve</div><div class="h">Reserve-floor gaps still open against payout exposure.</div></div>
          <div class="kpi"><div class="v">${metrics.reviewQueueGaps}</div><div class="lbl">review queue</div><div class="h">Manual-review coverage gaps across surge and payout lanes.</div></div>
        </div>
      </section>
      <section class="section">
        <div class="sh"><h2>Why operators care</h2><div class="note">merchant proof · buyer signal</div></div>
        <div class="stack">
          <div class="src"><div class="src-name">guardrails first</div><div class="src-tit">Repair the riskiest review lanes before approval posture drifts</div><p>${metrics.recommendation}</p></div>
          <div class="src"><div class="src-name">control evidence</div><div class="src-tit">Turn merchant snapshots into operator proof</div><p>Every lane stays tied to owner, control family, account path, and the next concrete remediation move.</p></div>
          <div class="src"><div class="src-name">recruiter signal</div><div class="src-tit">Show real FinTech risk depth</div><p>This is real merchant-review and underwriting proof, not generic payment-processing copy.</p></div>
        </div>
      </section>
      <section class="section">
        <div class="sh"><h2>Board questions this answers</h2><div class="note">exposure · savings · investment</div></div>
        <div class="stack">
          <div class="src"><div class="src-name">exposure</div><div class="src-tit">Which merchants are creating avoidable settlement risk?</div><p>Chargeback pressure, reserve gaps, stale KYB packets, and payout throttles stay visible before exposure turns into processor escalation or partner distrust.</p></div>
          <div class="src"><div class="src-name">savings</div><div class="src-tit">Where can review effort stop being duplicated?</div><p>The desk consolidates fraud, underwriting, payout, and manual-review evidence so risk teams do not rebuild the same merchant packet across tools.</p></div>
          <div class="src"><div class="src-name">investment</div><div class="src-tit">Which controls deserve automation first?</div><p>Blocking findings show whether KYB refresh, reserve-floor checks, chargeback monitoring, or payout review should receive the next platform investment.</p></div>
        </div>
      </section>
      <section class="section">
        <div class="sh"><h2>Evidence model</h2><div class="note">signal · proof · decision</div></div>
        <table class="ttbl">
          <thead><tr><th>Signal</th><th>Owner</th><th>Required proof</th><th>Decision supported</th></tr></thead>
          <tbody>
            <tr><td><b>Chargeback pressure</b></td><td>Risk Operations</td><td>Dispute rate, trend window, account cohort, remediation owner</td><td>Hold, graduate, or intensify merchant review</td></tr>
            <tr><td><b>Reserve coverage</b></td><td>Treasury Operations</td><td>Reserve floor, payout exposure, exception memo, finance approval</td><td>Adjust reserve, unblock payout, or keep settlement gated</td></tr>
            <tr><td><b>KYB freshness</b></td><td>Merchant Underwriting</td><td>Beneficial-owner packet, sanctions recency, final review memo</td><td>Approve, refresh, or block account posture</td></tr>
          </tbody>
        </table>
      </section>`
  );
}

export function renderMerchantLane() {
  return layout(
    "Merchant Risk Review Console — Merchant Lane",
    "/merchant-lane",
    `<section class="section">
        <div class="sh"><h2>Merchant Lane</h2><div class="note">owner · focus · next action</div></div>
        <table class="ttbl">
          <thead><tr><th>Lane</th><th>Owner</th><th>Status</th><th>Related findings</th><th>Focus</th><th>Next action</th></tr></thead>
          <tbody>
            ${merchantLane().map((lane) => `<tr><td><b>${lane.lane}</b><br />${lane.note}</td><td>${lane.owner}</td><td><span class="st ${severityClass(lane.status)}">${lane.status}</span></td><td>${lane.relatedFindings}</td><td>${lane.focus}</td><td>${lane.nextAction}</td></tr>`).join("")}
          </tbody>
        </table>
      </section>`
  );
}

export function renderRiskFindings() {
  return layout(
    "Merchant Risk Review Console — Risk Findings",
    "/risk-findings",
    `<section class="section">
        <div class="sh"><h2>Risk Findings</h2><div class="note">severity · owner · merchant path</div></div>
        <table class="ttbl">
          <thead><tr><th>Risk</th><th>Owner</th><th>Control family</th><th>Subject</th><th>Message</th></tr></thead>
          <tbody>
            ${riskFindings().map((finding) => `<tr><td><span class="st ${severityClass(finding.severity)}">${finding.severity}</span><br /><b>${finding.code}</b></td><td>${finding.owner}</td><td>${finding.controlFamily ?? "—"}</td><td>${finding.subjectName ?? finding.subject}</td><td>${finding.message}</td></tr>`).join("")}
          </tbody>
        </table>
      </section>`
  );
}

export function renderReviewPosture() {
  return layout(
    "Merchant Risk Review Console — Review Posture",
    "/review-posture",
    `<section class="section">
        <div class="sh"><h2>Review Posture</h2><div class="note">packet readiness · blocker · window</div></div>
        <div class="board">
          ${reviewPosture().map((packet) => `<article class="pcard">
            <div class="ptop"><div class="pnum">${packet.completenessScore}%</div><div class="ppri">${packet.owner}</div></div>
            <h3>${packet.lane}</h3>
            <p class="pdesc">${packet.decisionNote}</p>
            <ul class="check">
              <li>${packet.blocker}</li>
              <li>${packet.launchWindowHours} hours to the next remediation checkpoint</li>
              <li>Status: <span class="st ${severityClass(packet.status)}">${packet.status}</span></li>
            </ul>
            <div><code>${packet.packetId}</code></div>
          </article>`).join("")}
        </div>
      </section>`
  );
}

export function renderVerification() {
  return layout(
    "Merchant Risk Review Console — Verification",
    "/verification",
    `<section class="section">
        <div class="sh"><h2>Verification</h2><div class="note">operator-safe claims only</div></div>
        <div class="stack">
          ${verification().map((item, index) => `<div class="src"><div class="src-name">verification ${index + 1}</div><div class="src-tit">${item}</div><p>This surface is built to stay honest about offline exports, synthetic sample data, and real merchant-risk posture.</p></div>`).join("")}
        </div>
      </section>`
  );
}

export function renderDocs() {
  return layout(
    "Merchant Risk Review Console — Docs",
    "/docs",
    `<section class="section">
        <div class="sh"><h2>Docs</h2><div class="note">routes · cli · api</div></div>
        <div class="stack">
          <div class="src"><div class="src-name">routes</div><div class="src-tit">Public control surface</div><p><code>/</code>, <code>/merchant-lane</code>, <code>/risk-findings</code>, <code>/review-posture</code>, <code>/verification</code>, <code>/docs</code></p></div>
          <div class="src"><div class="src-name">api</div><div class="src-tit">Structured payloads</div><p><code>/api/dashboard/summary</code>, <code>/api/merchant-lane</code>, <code>/api/risk-findings</code>, <code>/api/review-posture</code>, <code>/api/verification</code>, <code>/api/sample</code></p></div>
          <div class="src"><div class="src-name">cli</div><div class="src-tit">Offline merchant-risk analysis</div><p><code>npx merchant-risk-review-console fixtures/merchant-risk-clean.json --format summary</code> renders the same posture the dashboard exposes.</p></div>
        </div>
      </section>`
  );
}

export function renderSample() {
  return JSON.stringify(payload(), null, 2);
}
