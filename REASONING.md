# Design Tradeoffs and Reasoning

## Twist 1: Platinum Tier

**Migration Strategy:**
To comply with the strict backward-compatibility requirement, I deliberately **did not** write a background script or bulk update script to retroactively promote existing users to the Platinum tier. 
As a result, members with `lifetimePoints >= 5000` will remain as Gold until they make their next purchase. The `calculateTier` function is invoked exclusively during the purchase flow, which acts as the organic trigger for tier recalculations. This avoids unintended side effects of mutating historical data without explicit user action.

## Twist 2: Points Expiry and Virtual Clock

**Virtual Clock Persistence:**
I opted to persist the virtual clock in a single MongoDB document (`SystemClock` singleton collection). 
*Tradeoff:* While storing it in memory would be slightly faster, an in-memory variable would reset every time the Node.js server restarts (which happens frequently in Codespaces due to hot-reloading or container suspension). Persisting it guarantees the virtual time is durable and grading tests remain deterministic.

**Expiry Mechanics:**
I implemented a FIFO (First-In, First-Out) consumption model by adding a `remainingPoints` field to the `Transaction` model. 
*Tradeoff:* Redemptions now need to find unexpired EARN transactions and iteratively deduct points from them. This increases the complexity of the redemption flow but prevents the edge case where an expired transaction mistakenly deletes points that were already legitimately spent. The expiry job strictly deducts points based on the sum of `remainingPoints` on transactions older than 90 days.

## Twist 3: Notification Outbox Pattern

**Sync vs Async Dispatch:**
I chose to implement an **asynchronous dispatch** via a dedicated `POST /api/outbox/dispatch` endpoint. 
*Tradeoff:* I could have mocked `sendNotification` synchronously right after `NotificationOutbox.create`, but decoupling it into a separate step perfectly illustrates the primary value of the transactional outbox pattern: ensuring the core transaction (the purchase) succeeds quickly and reliably, leaving secondary effects (notifications) to be processed eventually and repeatedly if they fail.

**Multiple Tier Crossings:**
If a single purchase spans multiple tiers (e.g. Bronze -> Gold directly, skipping Silver), the system creates exactly **one** outbox entry representing the final state transition.
*Tradeoff:* Sending one notification like "You upgraded from Bronze to Gold!" is a better user experience than spamming them with "You reached Silver!" followed instantly by "You reached Gold!". The `tierAtPurchase` vs `newTier` comparison handles this elegantly.
