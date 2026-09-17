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

## Business Rules & Assumptions

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
- **Backend:** Node.js, Express, MongoDB, Mongoose, mongodb-memory-server
- **Authentication:** JWT, bcryptjs
- **Testing:** Jest

## Project Structure
- `/frontend` - React application
- `/backend` - Express API
- `/package.json` - Root package for single-command start
- `/.env.example` - Environment variable examples

## Prerequisites
- Node.js (v18 or higher)
- npm
- (Optional) A MongoDB Atlas Cluster URI for real persistent data storage

## Environment Variables
The application uses environment variables for configuration. Example files are provided:

**Backend (`backend/.env.example`):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cafe_rewards
JWT_SECRET=supersecretjwtkey_for_development
SEED_ON_START=true
```

**Frontend (`frontend/.env.example`):**
```env
VITE_API_URL=http://localhost:5000/api
```

## Database Setup & Persistence
This application is designed to use **MongoDB**. 
If you provide a valid `MONGODB_URI` in the backend `.env` file, the application will connect to it (e.g., MongoDB Atlas) and your data will securely persist across restarts.

*Fallback Mechanism:* If `MONGODB_URI` is left blank, the application will automatically spin up an internal `mongodb-memory-server` for seamless local evaluation. Note that in this fallback mode, data is ephemeral and resets on server restart.

## Seed Data
To populate the database with members, rewards, and demo staff, ensure `SEED_ON_START=true` is set in the backend `.env` file. The server will automatically inject the seed data upon connection.
Alternatively, you can manually run:
```bash
node backend/src/utils/seed.js
```

## GitHub Codespaces Setup Instructions

Follow these exact steps to run the application in a fresh GitHub Codespace:

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
3. **Start the Application**
   ```bash
   npm run dev
   ```
4. **Access the Application**
   - **Frontend UI:** `http://localhost:5173`
   - **Backend API:** `http://localhost:5000`

### Demo Credentials
- **Email:** `demo@caferewards.local`
- **Password:** `Demo@12345`

## Example User Flow
1. Login with demo credentials (or register a new staff account).
2. View the dashboard to see general stats.
3. Search for a member by phone (e.g., `9876543212`).
4. Click on the member to view details.
5. Record a purchase. Verify the correct point calculation based on tier.
6. Redeem a reward. Observe the points decrease accurately while lifetime points remain intact.
7. Verify the transaction history matches the balance updates.
8. Go to the Members tab to test pagination and sorting.

## API Documentation

### Auth
- `POST /api/auth/register` - Register a new staff account. `body: { name, email, password }`
- `POST /api/auth/login` - Authenticate staff. Returns JWT token.

### Members
- `GET /api/members` - Paginated and sorted list of members.
- `POST /api/members` - Create a new member. `body: { name, phone, email }`
- `GET /api/members/:id` - Fetch single member details.
- `GET /api/members/search?phone=...` - Search members by phone.
- `GET /api/members/:id/transactions` - Fetch transaction ledger (combines both EARN and REDEEM events historically into one endpoint for simplified chronological viewing).

### Purchases & Redemptions
- `POST /api/purchases` - Record purchase. `body: { memberId, amount }`
- `POST /api/redemptions` - Redeem reward. `body: { memberId, rewardId }`
- `GET /api/rewards` - List active catalog.

## Testing
Jest is used to verify the core business logic (tier boundaries, earning calculations, integer rounding).
To run the automated tests:
```bash
cd backend
npm test
```
*Note: Manual QA verified that insufficient balances strictly reject redemptions and that phone numbers enforce uniqueness at the database level.*

## Data Integrity 
- **Negative Balance Prevention:** Backend enforces validation before deducting points (`$gte: pointsCost`).
- **Idempotency:** UI disable states and strict database validations protect against double-redemption.
- **Ledger System:** All changes to `currentPoints` are logged in a `Transaction` collection as an immutable append-only ledger.

## Known Limitations
- Standalone MongoDB instances (like in memory-server) often do not support multi-document transactions without a replica set. Therefore, atomic single-document operations (`findOneAndUpdate`) are strategically used instead.
- The UI is designed for desktop café counters; responsive design is present but optimized for wider screens.

## Future Improvements
- Mobile application for members to view their own balances and QR codes.
- Automated WhatsApp/SMS receipt notifications for purchases and redemptions.
- Advanced loyalty analytics and graphical reporting for café managers.
