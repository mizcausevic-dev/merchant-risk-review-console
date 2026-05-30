import {
  merchantLane,
  reviewPosture,
  riskFindings,
  summary
} from "../src/services/merchantRiskReviewConsoleService.js";

console.log("merchant-risk-review-console demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`${merchantLane().length} merchant lanes`);
console.log(`${riskFindings().length} risk findings`);
console.log(`${reviewPosture().length} review posture packets`);
