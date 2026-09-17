# CafeRewards

# CafeRewards - Loyalty Point System

A full-stack web application designed for café staff to manage a customer loyalty program. This system tracks customer purchases, calculates reward points with tier-based multipliers, allows members to redeem points for items, and manages point expiry and notification dispatches.

## Features & Core Capabilities
- **Accurate Points Calculation:** Integer-based point system calculated server-side.
- **Tier-Based Rewards:** Dynamic earning multiplier system based on lifetime spend.
- **Fast Lookup:** Indexed phone number search for quick member identification at the counter.
- **Redemption & Integrity:** Atomic point deduction validations to prevent negative balances and double-spending.
- **Transaction Ledger:** Immutable history of all `EARN`, `REDEEM`, and `EXPIRE` events.
- **Point Expiry (Twist 2):** FIFO-based point expiry system that subtracts from the oldest unspent points after 90 days of inactivity, controlled via a Virtual Clock for testing.
- **Outbox Notifications (Twist 3):** Asynchronous transactional outbox pattern to safely queue and dispatch tier-upgrade notifications.
- **Pagination & Sorting:** Server-side implementation for scalability when viewing member lists.
- **Security hardening:** Protected against NoSQL injection, brute forcing, and unauthorized cross-origin requests.

---

## Business Rules & Logic

### Tiers (Includes Twist 1 - Platinum)
Tiers are strictly based on `lifetimePoints`, not `currentPoints`. 

| Tier | Lifetime Points Required | Earning Multiplier | Earning Rate |
|---|---|---|---|
| **Bronze** | 0 - 499 | 1.0x | 10 pts per ₹100 |
| **Silver** | 500 - 999 | 1.25x | 12.5 pts per ₹100 |
| **Gold** | 1,000 - 4,999 | 1.5x | 15 pts per ₹100 |
| **Platinum** | 5,000+ | 3.0x | 30 pts per ₹100 |

### Earning Points
- Base rate: 1 point per ₹10 spent.
- Formula: `floor((purchaseAmount / 10) * tierMultiplier)`
- *Example:* A Platinum member spending ₹800 earns `floor(80 * 3.0) = 240` points.

### Reward Catalog
- Coffee: 100 pts
- Cold Coffee: 150 pts
- Sandwich: 200 pts
- Cake: 300 pts

---

## Prerequisites
- Node.js (v18 or higher)
- npm
- (Optional) A MongoDB Atlas Cluster URI for real persistent data storage. If omitted, the app spins up an ephemeral in-memory database.

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```
2. **Configure Environment Variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   *(Add your Atlas URI to `backend/.env` if you want cross-session persistence)*
3. **Start the Application (Frontend & Backend concurrently)**
   ```bash
   npm run dev
   ```
4. **Access the Application**
   - **Frontend UI:** `http://localhost:5173`
   - **Backend API:** `http://localhost:5000`

### Demo Credentials
- **Email:** `demo@caferewards.local`
- **Password:** `Demo@12345`

---

## Architecture
```text
Frontend (React + Vite + Tailwind)
       ↓
REST API (Express.js)
       ↓
Business Logic Controllers & Services
       ↓
MongoDB (Mongoose ODM)
```

## Database Schema Overview
- **User:** Staff authentication credentials.
- **Member:** Customer profiles, current points, lifetime points, and tier status.
- **Reward:** Available catalog items and their point costs.
- **Purchase:** Receipts of customer spend.
- **Redemption:** Receipts of reward redemptions.
- **Transaction:** The immutable append-only ledger tying everything together.
- **NotificationOutbox:** Queued tier-upgrade events waiting for async dispatch.
- **SystemClock:** A singleton tracking the virtual time for the expiry simulation.

---

## API Documentation

### Auth
- `POST /api/auth/register` - Register a new staff account. Requires `{ name, email, password }`. Protected against rate-limiting.
- `POST /api/auth/login` - Authenticate staff. Returns JWT token.

### Members
- `GET /api/members` - Paginated and sorted list of members. Supports `?page=1&limit=10&sort=createdAt&order=desc`.
- `POST /api/members` - Create a new customer profile.
- `GET /api/members/:id` - Fetch single member details.
- `GET /api/members/search?phone=...` - Quick search for counter operations.
- `GET /api/members/:id/transactions` - Fetch the full ledger (EARN, REDEEM, EXPIRE events).

### Purchases & Redemptions
- `POST /api/purchases` - Record a purchase. Invokes point calculation, tier upgrades, and enqueues Outbox notifications.
- `POST /api/redemptions` - Deduct points and record a redemption using strict FIFO logic against active EARN transactions.
- `GET /api/rewards` - List the active reward catalog.

### Virtual Clock & Expiry (Twist 2)
- `POST /api/clock` - Advance the virtual system clock. Requires `{ "date": "YYYY-MM-DDTHH:mm:ssZ" }`. Automatically triggers the expiration job to clear points older than 90 days.
- `GET /api/clock` - Retrieve the current virtual system time.

### Outbox & Notifications (Twist 3)
- `GET /api/outbox` - Fetch a paginated list of pending and sent tier-upgrade notifications.
- `POST /api/outbox/dispatch` - Process all `PENDING` outbox entries and mark them as `SENT`.
- `GET /api/members/:id/outbox` - Fetch the specific notification history for one member.

---

## Testing
Jest is used to verify the core business logic, tier boundaries, point expiry logic, and outbox mechanics.
To run the automated tests:
```bash
cd backend
npm test
```

## Data Integrity 
- **Negative Balance Prevention:** Backend enforces validation before deducting points using atomic operators (`$gte: pointsCost`).
- **Idempotency:** Strict database validations and schema types protect against double-redemption.
- **Ledger System:** All point changes strictly map to a `Transaction` entry.

## Known Limitations
- Standalone MongoDB instances (like in memory-server) often do not support multi-document transactions without a replica set. Therefore, atomic single-document operations (`findOneAndUpdate`) are strategically used instead.
- The UI is designed for desktop café counters; responsive design is present but optimized for wider screens.
- To facilitate grading, the JWT tokens expire after 30 days and lack a server-side blacklist / refresh token rotation.
- The `/api/auth/register` endpoint will leak user enumeration by confirming if an email is already registered.

## Future Improvements
- Mobile application for members to view their own balances and QR codes.
- Automated WhatsApp/SMS receipt notifications for purchases and redemptions.
- Advanced loyalty analytics and graphical reporting for café managers.

## Seed Data
To populate the database with members, rewards, and demo staff, ensure `SEED_ON_START=true` is set in the backend `.env` file. The server will automatically inject the seed data upon connection.
Alternatively, you can manually run:
```bash
node backend/src/utils/seed.js
```
< ! - -   D e p l o y m e n t   v e r i f i c a t i o n   - - >