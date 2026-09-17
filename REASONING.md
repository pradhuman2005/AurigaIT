# Engineering Decisions

## Problem Understanding
The goal is to build a robust rewards system for a café counter where accurate tracking of points, purchases, and redemption is critical. The system must prevent negative balances and ensure the tier logic strictly relies on lifetime points rather than the current balance.

## Architecture Decisions
- **Stack:** React + Vite (Frontend), Node.js + Express (Backend), MongoDB (Database). Chosen for speed of implementation and familiarity.
- **Database:** Used `mongodb-memory-server` to guarantee zero-setup execution in the Codespaces environment, eliminating MongoDB installation friction while providing a real MongoDB instance.

## Points Calculation & Tier Logic
- **Earning Formula:** Implemented exactly as requested: `floor((amount / 10) * multiplier)`. All point values remain integers.
- **Tiers:** Evaluated on `lifetimePoints` upon every purchase. A purchase first uses the tier *prior* to the purchase to calculate points, and then updates the tier based on the new lifetime total.
- **Centralized Logic:** Calculation functions are isolated in a `pointsService.js` to ensure the same rules are applied predictably.

## Redemption Integrity
- **Concurrency Protection:** Used atomic `findOneAndUpdate` queries with a condition `$gte: rewardCost` to deduct points. This guarantees that double-spending is impossible, even without multi-document transactions, as the database atomically ensures the balance doesn't drop below the cost.
- **Ledger System:** A `Transaction` collection acts as an append-only ledger for EARN and REDEEM events. This ensures every change to a member's points is auditable.

## Search, Pagination, and Sorting
- Implemented completely server-side in the `/api/members` endpoint to handle large datasets effectively. Phone searches use a regex query for partial matching.

## Authentication
- Implemented using JWT and bcryptjs. The `protect` middleware ensures only staff can record purchases or redemptions.

## Testing Strategy
- Manual QA performed via script ensuring boundary tiers, point calculation, and redemption logic hold true under typical workflows.

## Tradeoffs
- Multi-document transactions (via `mongoose.startSession()`) were not used because standalone MongoDB instances (including memory-server) often do not support them without a replica set setup. Atomic single-document updates were used as a reliable alternative.
