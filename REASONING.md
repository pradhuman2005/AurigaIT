# Design Tradeoffs, Architecture, and Reasoning

This document outlines the core architectural decisions, engineering tradeoffs, and implementation details for the three twists in the CafeRewards system.

## Twist 1: Platinum Tier (Strict Backward-Compatibility)

**The Requirement:** Add a Platinum tier for members with `lifetimePoints >= 5000` (3.0x multiplier) without breaking existing data or rewriting historical events.

**Implementation & Tradeoffs:**
- **Migration Strategy:** I deliberately **did not** write a background script or bulk update script to retroactively promote existing users to the Platinum tier. 
- **Organic Trigger:** Members with `lifetimePoints >= 5000` remain as Gold until they make their next purchase. The `calculateTier` function (in `backend/src/services/pointsService.js`) is invoked exclusively during the purchase flow, acting as the organic trigger for tier recalculations. 
- **Why this approach?** This avoids unintended side effects of mutating historical data without explicit user action, adhering strictly to the backward-compatibility constraint. It guarantees that existing DB entries remain valid and untouched until the member interacts with the system again.

## Twist 2: Points Expiry and Virtual Clock (90-Day FIFO)

**The Requirement:** Points expire 90 days after being earned. Ensure older points are consumed first during redemptions. Provide a `/api/clock` endpoint to manipulate time for grading.

**Implementation & Tradeoffs:**
- **Virtual Clock Persistence:** I persisted the virtual clock in a single MongoDB document (`SystemClock` singleton collection). 
  - *Tradeoff:* While an in-memory variable would be slightly faster, it resets every time the Node.js server restarts (frequent in dev/Codespaces). Persisting it guarantees the virtual time is durable and grading tests remain deterministic. The `clockController.js` handles reading and advancing this clock.
- **FIFO Expiry Mechanics:** I implemented a strict First-In, First-Out consumption model by adding a `remainingPoints` field to the `Transaction` model. 
  - *Tradeoff:* When a user redeems a reward (`redemptionController.js`), the backend must query unexpired `EARN` transactions sorted by `createdAt` ASC, and iteratively deduct points from `remainingPoints`. This increases the complexity of the redemption flow but perfectly prevents the edge case where an expired transaction mistakenly deletes points that were legitimately spent.
- **Expiry Job:** The `expirePointsJob.js` strictly deducts points based on the sum of `remainingPoints` on transactions older than 90 days, updating the member's balance and writing an `EXPIRE` ledger entry. It is invoked synchronously when the clock advances.

## Twist 3: Notification Outbox Pattern

**The Requirement:** Reliable tier-upgrade notifications using the transactional outbox pattern.

**Implementation & Tradeoffs:**
- **Sync vs Async Dispatch:** I chose to implement an **asynchronous dispatch** via a dedicated `POST /api/outbox/dispatch` endpoint (`outboxController.js`). 
  - *Tradeoff:* I could have mocked `sendNotification` synchronously right after `NotificationOutbox.create` in `purchaseController.js`. However, decoupling it into a separate manual dispatch perfectly illustrates the primary value of the transactional outbox pattern: ensuring the core transaction (the purchase) succeeds instantly and reliably, leaving secondary effects (notifications) to be processed eventually and repeatedly if they fail.
- **Multiple Tier Crossings:** If a single purchase spans multiple tiers (e.g. Bronze -> Gold directly, skipping Silver), the system compares `tierAtPurchase` vs `newTier` and creates exactly **one** outbox entry representing the final state transition.
  - *Tradeoff:* Sending one notification like "You upgraded from Bronze to Gold!" is a much better user experience than spamming them with "You reached Silver!" followed instantly by "You reached Gold!".

## Security & OWASP Mitigations

During a security review, several OWASP vulnerabilities were identified and resolved:
- **NoSQL Injection:** Mitigated via `express-mongo-sanitize` (mutating in-place to support Express 5's read-only `req.query` getter) and strict `typeof === 'string'` checks on critical fields like email and phone.
- **Brute Forcing:** Mitigated via `express-rate-limit` on the `/api/auth/register` and `/api/auth/login` routes (10 requests / 15 minutes).
- **Password Re-hashing:** Fixed a critical bug in `User.js` `pre('save')` hook where updating a user would inadvertently re-hash an already-hashed password due to a missing early return.
- **CORS & Headers:** Locked down `cors` to the frontend origin and added `helmet` for secure HTTP headers.

**Known Tradeoffs Accepted:**
- **JWT Expiry:** The authentication system issues a 30-day JWT without a refresh token rotation or server-side blacklist mechanism. In a robust production system, tokens would be shorter-lived with a refresh flow. This was accepted as a tradeoff for demo simplicity.
- **User Enumeration:** The `/api/auth/register` endpoint returns "User already exists" if an email is taken. Given this is an internal staff tool, the enumeration risk is minimal and accepted.
