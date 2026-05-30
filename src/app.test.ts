import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "./app.js";

describe("merchant-risk app", () => {
  it("serves html routes", async () => {
    const htmlRoutes = ["/", "/merchant-lane", "/risk-findings", "/review-posture", "/verification", "/docs"];
    for (const route of htmlRoutes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/html");
    }
  });

  it("serves api routes", async () => {
    const apiRoutes = [
      "/api/dashboard/summary",
      "/api/merchant-lane",
      "/api/risk-findings",
      "/api/review-posture",
      "/api/verification",
      "/api/sample"
    ];
    for (const route of apiRoutes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
    }
  });
});
