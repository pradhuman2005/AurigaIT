# CafeRewards

*Every purchase. Every point. Always accurate.*

## Product Overview

**Problem Statement:** Manual loyalty tracking in cafés often leads to incorrect point calculations, negative balances, and slow workflows. 

**Solution:** CafeRewards is a simple, robust loyalty platform that helps cafés manage members, record purchases, and handle reward redemptions accurately. It calculates points automatically based on a member's lifetime tier, maintaining strict data integrity.

## Features
- **Accurate Points:** Integer-based point system calculated server-side.
- **Tier-Based Rewards:** Dynamic multiplier system.
- **Fast Lookup:** Indexed phone number search.
- **Redemption:** Point validation with atomic updates to prevent double-spending.
- **Transaction Ledger:** Immutable history of all EARN and REDEEM events.
- **Pagination & Sorting:** Server-side implementation for scalability.

## Business Rules

### Tiers
| Tier | Lifetime Points | Multiplier |
|---|---|---|
| **Bronze** | 0 - 499 | 1.0x |
| **Silver** | 500 - 999 | 1.25x |
| **Gold** | 1000+ | 1.5x |

*Note: Tiers are strictly based on `lifetimePoints`, not `currentPoints`.*

### Earning Points
- Base rate: 1 point per ₹10 spent.
- Formula: `floor((purchaseAmount / 10) * tierMultiplier)`
- *Example:* A Silver member spending ₹800 earns `floor(80 * 1.25) = 100` points.

### Reward Catalog
- Coffee: 100 pts
- Cold Coffee: 150 pts
- Sandwich: 200 pts
- Cake: 300 pts

## Architecture
```text
Frontend (React + Vite + Tailwind)
       ↓
REST API (Express.js)
       ↓
Business Logic (Services)
       ↓
MongoDB (Mongoose)
```

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, MongoDB (mongodb-memory-server fallback or standard MongoDB Atlas), Mongoose
- **Authentication:** JWT, bcryptjs

## Project Structure
- `/frontend` - React application
- `/backend` - Express API
- `/package.json` - Root package for single-command start
- `/.env.example` - Environment variable examples

## GitHub Codespaces Setup Instructions

Follow these exact steps to run the application in a fresh GitHub Codespace:

### 1. Install Dependencies
Run the following command from the root directory to install all dependencies for both the frontend and backend simultaneously:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory based on `.env.example`:
```bash
cp backend/.env.example backend/.env
```
*(Optional)* Create a `.env` file in the `frontend` directory based on `.env.example`:
```bash
cp frontend/.env.example frontend/.env
```

**Database Note:** 
By default, the backend `.env.example` is configured to use a remote MongoDB connection. 
If you do not have an active MongoDB URI, the system will fall back to using an internal `mongodb-memory-server` if you remove the `MONGODB_URI` environment variable, ensuring it always runs cleanly in Codespaces.
The `SEED_ON_START=true` environment variable guarantees the database is populated automatically upon startup.

### 3. Start the Application
Run the following single command from the root directory to start both the backend API and the frontend UI concurrently:
```bash
npm run dev
```

### 4. Access the Application
- **Frontend UI:** Usually `http://localhost:5173` (Codespaces will forward this and provide a direct link).
- **Backend API:** `http://localhost:5000`

### Demo Credentials
- **Email:** `demo@caferewards.local`
- **Password:** `Demo@12345`

## Example User Flow
1. Login with demo credentials.
2. View the dashboard to see general stats.
3. Search for a member by phone (e.g., `9876543212`).
4. Click on the member to view details.
5. Record a purchase. Verify the correct point calculation based on tier.
6. Redeem a reward. Observe the points decrease accurately while lifetime points remain intact.
7. Verify the transaction history matches the balance updates.
8. Go to the Members tab to test pagination and sorting.

## API Documentation

### Auth
- `POST /api/auth/login` - Authenticate staff. Returns JWT token.

### Members
- `GET /api/members` - Paginated and sorted list of members.
- `GET /api/members/:id` - Fetch single member.
- `GET /api/members/search?phone=...` - Search members by phone.
- `GET /api/members/:id/transactions` - Fetch transaction ledger for a member.

### Purchases & Redemptions
- `POST /api/purchases` - Record purchase. `body: { memberId, amount }`
- `POST /api/redemptions` - Redeem reward. `body: { memberId, rewardId }`
- `GET /api/rewards` - List active catalog.

## Data Integrity 
- **Negative Balance Prevention:** Backend enforces validation before deducting points (`$gte: pointsCost`).
- **Idempotency:** UI disable states and strict database validations protect against double-redemption.
- **Ledger System:** All changes to `currentPoints` are logged in a `Transaction` collection as an immutable append-only ledger.

## Known Limitations
- Standalone MongoDB instances (like in memory-server) often do not support multi-document transactions without a replica set. Therefore, atomic single-document operations (`findOneAndUpdate`) are strategically used instead.
- The UI is designed for desktop café counters; responsive design is present but optimized for wider screens.
