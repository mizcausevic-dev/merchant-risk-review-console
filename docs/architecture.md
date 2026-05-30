`merchant-risk-review-console` has two layers:

1. Offline analysis
   - reads synthetic merchant-review snapshot packets
   - identifies chargeback pressure, reserve gaps, KYB drift, payout-control gaps, fraud-rule drift, and review-queue overload
   - renders JSON, markdown, and summary views for local review

2. Public operator surface
   - turns the same findings into merchant-lane, risk-findings, and review-posture views
   - keeps the proof crawlable for recruiters, buyers, and case-study readers
   - avoids live secrets, processor credentials, or write paths
