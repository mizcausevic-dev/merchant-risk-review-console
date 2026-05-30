# Merchant Risk Review Console

[![CI](https://github.com/mizcausevic-dev/merchant-risk-review-console/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/merchant-risk-review-console/actions/workflows/ci.yml)
[![Deploy](https://github.com/mizcausevic-dev/merchant-risk-review-console/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/merchant-risk-review-console/actions/workflows/pages.yml)

Operator control plane for FinTech merchant review, chargeback pressure, reserve coverage, KYB drift, payout throttle risk, and manual-review posture.

## What it does

- merchant-lane visibility for chargeback, KYB, reserve, and review-queue operators
- offline-safe analysis of synthetic merchant-risk snapshot packets
- buyer-readable review posture for underwriting, payouts, fraud, and treasury stakeholders
- public synthetic control surface plus JSON APIs and CLI

## Routes

- `/`
- `/merchant-lane`
- `/risk-findings`
- `/review-posture`
- `/verification`
- `/docs`

## API

- `/api/dashboard/summary`
- `/api/merchant-lane`
- `/api/risk-findings`
- `/api/review-posture`
- `/api/verification`
- `/api/sample`

## Screenshots

![Overview proof](./screenshots/01-overview-proof-v2.png)
![Merchant lane](./screenshots/02-merchant-lane-proof-v2.png)
![Risk findings](./screenshots/03-risk-findings-proof-v2.png)
![Review posture](./screenshots/04-review-posture-proof-v2.png)

## CLI

```powershell
npx merchant-risk-review-console .\fixtures\merchant-risk.json --format markdown
```

## Local run

```powershell
cd merchant-risk-review-console
npm install
npm run verify
npm run prerender
npm run render:assets
npm run start
```

Then open:

- [http://127.0.0.1:5522/](http://127.0.0.1:5522/)
- [http://127.0.0.1:5522/merchant-lane](http://127.0.0.1:5522/merchant-lane)
- [http://127.0.0.1:5522/risk-findings](http://127.0.0.1:5522/risk-findings)
- [http://127.0.0.1:5522/review-posture](http://127.0.0.1:5522/review-posture)

## Live

- [https://merchant.kineticgain.com/](https://merchant.kineticgain.com/)

This repo publishes synthetic sample merchant-review data only. It does not ship live processor credentials, account secrets, or authenticated write paths.
