import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  merchantLane,
  payload,
  reviewPosture,
  riskFindings,
  summary,
  verification
} from "../src/services/merchantRiskReviewConsoleService.js";
import {
  renderDocs,
  renderMerchantLane,
  renderOverview,
  renderReviewPosture,
  renderRiskFindings,
  renderVerification
} from "../src/services/render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = path.join(root, "site");

const files: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("merchant-lane", "index.html")]: renderMerchantLane(),
  [path.join("risk-findings", "index.html")]: renderRiskFindings(),
  [path.join("review-posture", "index.html")]: renderReviewPosture(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs(),
  "robots.txt": "User-agent: *\nAllow: /\nSitemap: https://merchant.kineticgain.com/sitemap.xml\n",
  "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://merchant.kineticgain.com/</loc></url>
  <url><loc>https://merchant.kineticgain.com/merchant-lane/</loc></url>
  <url><loc>https://merchant.kineticgain.com/risk-findings/</loc></url>
  <url><loc>https://merchant.kineticgain.com/review-posture/</loc></url>
  <url><loc>https://merchant.kineticgain.com/verification/</loc></url>
  <url><loc>https://merchant.kineticgain.com/docs/</loc></url>
</urlset>`,
  [path.join("api", "dashboard", "summary.json")]: JSON.stringify(summary(), null, 2),
  [path.join("api", "merchant-lane.json")]: JSON.stringify(merchantLane(), null, 2),
  [path.join("api", "risk-findings.json")]: JSON.stringify(riskFindings(), null, 2),
  [path.join("api", "review-posture.json")]: JSON.stringify(reviewPosture(), null, 2),
  [path.join("api", "verification.json")]: JSON.stringify(verification(), null, 2),
  [path.join("api", "sample.json")]: JSON.stringify(payload(), null, 2)
};

for (const [relativePath, contents] of Object.entries(files)) {
  const fullPath = path.join(site, relativePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
}
