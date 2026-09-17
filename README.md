# CafeRewards

# CafeRewards

## 1. Project Overview
CafeRewards is a full-stack web application designed for café staff to manage a customer loyalty program. It tracks customer purchases, mathematically calculates reward points based on lifetime tiers, safely handles reward redemptions, and reliably dispatches notifications. 

## 2. Problem Statement
Manual loyalty tracking in cafés often leads to incorrect point calculations, double-spending, negative balances, and incredibly slow workflows at the counter. Paper cards get lost, and messy spreadsheets create friction between staff and loyal customers.

## 3. Key Features
- User registration and login (JWT protected)
- Member management (create new members, view member details)
- Phone-number member search for fast counter operations
- Purchase recording
- Automatic points calculation based on lifetime points
- Tier management (Bronze, Silver, Gold, Platinum)
- Reward redemption with strict validation
- Accurate live points balance tracking
- Transaction/history tracking via an immutable ledger
- Pagination and Sorting for member lists
- Dashboard statistics
- Landing page with demo rewards grid
- Platinum Tier implementation (Twist 1)
- Point expiry automation after 90 days of inactivity using a `/clock` (Twist 2)
- Tier-upgrade notifications via a Transactional Outbox pattern on `/outbox` (Twist 3)

## 4. Business Rules
- **Points earning formula:** `Math.floor((purchaseAmount / 10) * tierMultiplier)`
- **Bronze Tier:** 0 - 499 lifetime points (1.0x multiplier)
- **Silver Tier:** 500 - 999 lifetime points (1.25x multiplier)
- **Gold Tier:** 1,000 - 4,999 lifetime points (1.5x multiplier)
- **Platinum Tier:** 5,000+ lifetime points (3.0x multiplier)
- **Tier Basis:** Tiers are strictly calculated against `lifetimePoints`, ensuring spending points doesn't demote a member.
- **Redemption Rules:** Redemptions strictly deduct from active `EARN` transactions in a FIFO (First-In, First-Out) manner. Transactions validate `$gte` against the balance to strictly prevent negative balances.
- **Point Expiry Rules:** Any unused points older than 90 days are expired via the `/api/clock` job.
- **Tier-transition Notification Rules:** When a purchase causes a member to cross a tier threshold, a single `TIER_UPGRADE` intent is queued into the `NotificationOutbox` to be dispatched asynchronously.

## 5. Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ODM (supports `mongodb-memory-server` for local dev)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Security:** helmet, express-mongo-sanitize, express-rate-limit, cors
- **Testing:** Jest

## 6. Architecture
**Frontend → REST API → Backend → Database**
- **Frontend:** Provides a responsive UI for the staff at the café counter, making API calls via Axios.
- **REST API:** Express router that handles HTTP requests, authentication, and validation.
- **Backend:** Controllers and Services execute the core business logic (calculating tiers, managing the outbox, evaluating expirations).
- **Database:** MongoDB stores documents (Members, Transactions, Rewards). Single-document atomic updates guarantee safety.

## 7. Project Structure
```
CafeRewards/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route handlers & core logic
│   │   ├── jobs/            # Scheduled tasks (expirePointsJob)
│   │   ├── middleware/      # JWT verification, Error handling
│   │   ├── models/          # Mongoose Schemas (Member, Transaction, Outbox, etc.)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic (pointsService)
│   │   ├── utils/           # Database seeders
│   │   └── server.js        # App entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI elements (Layout)
    │   ├── pages/           # Views (Landing, Dashboard, Members, MemberDetail)
    │   ├── services/        # Axios API configurations
    │   ├── App.jsx          # React Router setup
    │   └── main.jsx         # Vite entry point
    └── package.json
```

## 8. GitHub Codespaces Setup
To run the project in a fresh GitHub Codespace:
1. **Open the repository** in GitHub Codespaces.
2. **Install dependencies:**
   ```bash
   npm run install:all
   ```
3. **Configure environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
4. **Configure the database:** By default, leaving `MONGODB_URI` blank in `backend/.env` will spin up an internal `mongodb-memory-server` automatically!
5. **Start the application:**
   ```bash
   npm run dev
   ```
6. **Access the forwarded frontend port:** Open the forwarded port `5173` in your browser.

## 9. Environment Variables
**Backend (`backend/.env`):**
- `PORT`: (e.g., `5000`)
- `MONGODB_URI`: Leave empty for in-memory DB, or provide an Atlas URI.
- `JWT_SECRET`: Secret string for signing JWT tokens.
- `FRONTEND_URL`: Used for CORS configuration (e.g., `http://localhost:5173`).
- `SEED_ON_START`: Set to `true` to auto-populate demo data on startup.

**Frontend (`frontend/.env`):**
- `VITE_API_URL`: Points to the backend (e.g., `http://localhost:5000/api`).

## 10. Database Setup
This app uses **MongoDB**. 
If `MONGODB_URI` is provided in `.env`, it connects to your persistent cluster. If left blank, it automatically initializes `mongodb-memory-server` for a frictionless zero-config local environment.
If `SEED_ON_START=true` is set, the server runs `backend/src/utils/seedFunction.js` to initialize default rewards, a demo staff account, and test members.

## 11. Running the Application
From the root directory:
```bash
npm run dev
```
*(This concurrently starts the backend on port 5000 and the Vite frontend on port 5173).*

To run tests:
```bash
cd backend && npm test
```

## 12. Demo Account
If you seeded the database (`SEED_ON_START=true`), use:
- **Email:** `demo@caferewards.local`
- **Password:** `Demo@12345`

## 13. Application Flow
Login → Dashboard (view stats) → Search member by phone → View Member Details (balance/tier) → Record Purchase (backend calculates points/tier upgrades) → Redeem Reward (backend deducts FIFO points safely) → View Immutable Transaction History ledger.

## 14. REST API Documentation

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register staff | No |
| POST | `/api/auth/login` | Authenticate staff, get JWT | No |
| GET | `/api/members` | Get paginated members (`?page=1&limit=10&sort=createdAt`) | Yes |
| POST | `/api/members` | Create member (`body: {name, phone, email}`) | Yes |
| GET | `/api/members/:id` | Get member details | Yes |
| GET | `/api/members/search` | Search member by phone (`?phone=987`) | Yes |
| GET | `/api/members/:id/transactions` | Get member's ledger history | Yes |
| POST | `/api/purchases` | Record purchase (`body: {memberId, amount}`) | Yes |
| POST | `/api/redemptions` | Redeem reward (`body: {memberId, rewardId}`) | Yes |
| GET | `/api/rewards` | List available rewards catalog | Yes |
| POST | `/api/clock` | Advance virtual clock (`body: {date}`) | Yes |
| GET | `/api/clock` | Get current virtual time | Yes |
| GET | `/api/outbox` | View pending/sent notifications | Yes |
| POST | `/api/outbox/dispatch` | Dispatch/Send pending notifications | Yes |
| GET | `/api/members/:id/outbox` | View outbox history for a member | Yes |

## 15. Search, Pagination and Sorting
- **Search:** Call `GET /api/members/search?phone=987` to execute a regex-based case-insensitive lookup.
- **Pagination & Sorting:** Call `GET /api/members?page=2&limit=10&sort=lifetimePoints&order=desc`. The backend uses Mongoose's `.skip()` and `.limit()` and sorts dynamically.

## 16. Testing
Run tests via `npm test` inside the `/backend` folder.
Tests cover:
- Business logic rounding and multiplier calculations.
- Tier boundaries (Bronze to Platinum).
- Points expiry 90-day FIFO logic.
- Outbox tier-upgrade state capture.

## 17. Data Integrity & Security
- **Backend Validation:** Validates object presence and IDs.
- **Database Constraints:** Mongoose schemas enforce required fields and unique indexes.
- **Atomic Operations:** Uses `findOneAndUpdate` with `$gte` checks to prevent negative point balances.
- **Password Hashing:** Uses `bcryptjs` for secure password storage.
- **Security Middleware:** Uses `helmet` (headers), `express-mongo-sanitize` (NoSQL injection), `cors` (origin restrictions), and `express-rate-limit` (brute force protection).

## 18. Known Limitations
- The 30-day JWT lacks a server-side blacklist / refresh rotation (acceptable demo tradeoff).
- The MongoDB memory server does not support multi-document replica-set transactions.
- The registration endpoint allows user enumeration.

## 19. Future Improvements
1. **Customer Mobile App:** Allow members to view their own balances and generate QR codes for faster scanning.
2. **Automated Notifications:** WhatsApp/SMS receipt notifications instantly delivered via a 3rd-party provider.
3. **Manager Analytics:** Advanced graphical reporting and CSV exports to track daily loyalty liability.

## 20. License
This project is unlicensed and built strictly for the Auriga IT builder round assessment.

---

## How to Use
1. **Open the application:** Navigate to `http://localhost:5173` in your browser.
2. **Register/Login:** Click "Staff Login". Register a new account or log in with `demo@caferewards.local` / `Demo@12345`.
3. **Dashboard:** You will be greeted by the Dashboard showing top members and quick stats.
4. **Search:** Go to the Members tab, or use the top search bar, and search for a member by their phone number (e.g., `9876543212`).
5. **Member Details:** Click on the member to view their profile, current points, lifetime points, and active tier (Bronze/Silver/Gold/Platinum).
6. **Record Purchase:** Enter a purchase amount in the left panel and click "Record Purchase". 
7. **Calculate & Upgrade:** The backend will mathematically calculate the points based on the tier multiplier. Notice the tier upgrade to Silver/Gold/Platinum instantly if they cross a threshold!
8. **Redeem Reward:** In the Rewards Grid on the right, click on a reward (e.g., Cake - 300pts). A confirmation dialog will appear. Click Yes.
9. **Verify Balance:** Observe the current points drop exactly by the reward cost, while the lifetime points remain untouched.
10. **Transaction History:** Scroll down to view the chronological, immutable ledger showing the EARN and REDEEM events.
11. **Pagination/Sorting:** Click the "Members" tab in the nav to see server-side pagination and sorting by clicking the table headers.
12. **Virtual Clock (Twist 2):** Use an API client to `POST /api/clock` with a date >90 days in the future to trigger automated expiration of stale points.
13. **Outbox Notifications (Twist 3):** After crossing a tier in step 7, use an API client to `GET /api/outbox` to see the queued `TIER_UPGRADE` notification!
< ! - -   D e p l o y m e n t   v e r i f i c a t i o n   - - >