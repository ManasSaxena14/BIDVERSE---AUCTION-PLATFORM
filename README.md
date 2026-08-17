<div align="center">
  <h1>BidVerse — Premium Auction Platform</h1>
  <p><em>An institutional-grade digital auction ecosystem engineered for high-fidelity marketplace operations.</em></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

The platform orchestrates the complete auction lifecycle — from asset listing and real-time competitive bidding through to automated commission settlement — within a modular, security-hardened MERN stack architecture. It integrates AI-powered assistance via Groq SDK (Llama 3.3 70B), an XP-driven gamification engine, and a multi-dimensional superadmin governance dashboard.

### Deployment Links

*   **Live Marketplace (Frontend):** [bidverse-auction-platform.vercel.app](https://bidverse-auction-platform.vercel.app/)
*   **Infrastructure API (Backend):** [bidverse-auction-platform.onrender.com](https://bidverse-auction-platform.onrender.com)
*   **Project Repository:** [GitHub - ManasSaxena14/BidVerse](https://github.com/ManasSaxena14/BIDVERSE---AUCTION-PLATFORM.git)

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technical Stack](#technical-stack)
3. [Core Features](#core-features)
4. [Data Modeling](#data-modeling)
5. [API Reference](#api-reference)
6. [Security Architecture](#security-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Deployment Topology](#deployment-topology)
9. [Quick Start Guide](#quick-start-guide)
10. [Environment Variables](#environment-variables)
11. [Project Metrics](#project-metrics)
12. [Troubleshooting](#troubleshooting)
13. [Contributing](#contributing)
14. [Future Roadmap](#future-roadmap)
15. [License](#license)

---

## System Architecture

### High-Level Overview

```text
+------------------------------+         +-------------------------------+
|        FRONTEND (SPA)        |  HTTPS  |        BACKEND (REST API)     |
|  React.js + Vite + Tailwind  | ------> |  Node.js + Express.js (MVC)   |
|       Deployed: Vercel       |         |       Deployed: Render        |
+------------------------------+         +-------------------------------+
                                                      |
                                          +-----------+-----------+
                                          v                       v
                                +-----------------+     +-----------------+
                                | MongoDB Atlas   |     | Groq Cloud API  |
                                | (Mongoose ODM)  |     | (Llama 3.3 70B) |
                                +-----------------+     +-----------------+
```

### Backend — Modular MVC Architecture

The backend enforces strict separation of concerns through a layered MVC pattern:

| Layer | Directory | Responsibility |
|:---|:---|:---|
| **Configuration** | `config/` | Database connection management (MongoDB Atlas) |
| **Models** | `models/` | Mongoose schema definitions, validation rules, static methods, pre-save hooks, compound indexes |
| **Controllers** | `controllers/` | Isolated business logic for each domain (8 controllers) |
| **Routes** | `routes/` | RESTful endpoint definitions with middleware chaining (8 route modules) |
| **Middleware** | `middleware/` | Authentication, role-based authorization, centralized error handling |
| **Utilities** | `utils/` | Custom error response class |

### Frontend — Component-Driven SPA

| Layer | Directory | Contents |
|:---|:---|:---|
| **Pages** | `src/pages/` | 18 page-level route components |
| **Components**| `src/components/` | 16 reusable UI components |
| **Context** | `src/context/` | 6 context providers for global state |
| **Services** | `src/services/` | Centralized Axios API client with interceptors |

<details>
<summary><b>Click to expand full Project Structure</b></summary>

```text
BIDVERSE---AUCTION-PLATFORM/
|
+-- backend/
|   +-- config/
|   |   +-- db.js                     # MongoDB Atlas connection
|   +-- controllers/
|   |   +-- authController.js         # Authentication logic
|   |   +-- bidController.js          # Bid management with validation
|   |   +-- chatController.js         # AI concierge (Groq SDK)
|   |   +-- commissionController.js   # Financial settlement engine
|   |   +-- itemController.js         # Auction item CRUD
|   |   +-- reviewController.js       # Post-auction review management
|   |   +-- superadminController.js   # Governance dashboard + aggregations
|   |   +-- userController.js         # User profile management
|   +-- middleware/
|   |   +-- auth.js                   # JWT verification + status check
|   |   +-- authorization.js          # RBAC middleware
|   |   +-- errorMiddleware.js        # Global error handler
|   +-- models/
|   |   +-- AuctionItem.js            # Auction schema (5 indexes, statics, virtuals)
|   |   +-- Bid.js                    # Bid schema
|   |   +-- Commission.js            # Commission schema (auto-calc hooks)
|   |   +-- Review.js                 # Review schema
|   |   +-- User.js                   # User schema (bcrypt pre-save)
|   +-- routes/
|   |   +-- authRoutes.js
|   |   +-- bidRoutes.js
|   |   +-- chatRoutes.js
|   |   +-- commissionRoutes.js
|   |   +-- itemRoutes.js
|   |   +-- reviewRoutes.js
|   |   +-- superadminRoutes.js
|   |   +-- userRoutes.js
|   +-- utils/
|   |   +-- errorResponse.js          # Custom ErrorResponse class
|   +-- server.js                     # Entry point, security config, routing
|   +-- package.json
|
+-- frontend/
|   +-- src/
|   |   +-- components/               # 16 reusable components
|   |   +-- context/                  # 6 context providers
|   |   +-- pages/                    # 18 page components
|   |   +-- services/                 # API client layer
|   |   +-- assets/
|   |   +-- App.jsx                   # Root component + routing
|   |   +-- main.jsx                  # Application entry point
|   |   +-- index.css                 # Design system + Tailwind config
|   +-- index.html
|   +-- vite.config.js
|   +-- tailwind.config.js
|   +-- package.json
|
+-- README.md
```
</details>

---

## Technical Stack

| Category | Technologies |
|:---|:---|
| **Frontend Framework** | React.js 18 (Vite 5 build tool) |
| **Styling** | Tailwind CSS 3 with custom design tokens |
| **Animation** | Framer Motion, GSAP |
| **Data Visualization** | Recharts (AreaChart, PieChart, BarChart) |
| **Icon System** | Lucide React, React Icons |
| **Utility Libraries** | date-fns, clsx, tailwind-merge |
| **Backend Runtime** | Node.js (v18+) |
| **Backend Framework** | Express.js 4 (Modular MVC) |
| **Database** | MongoDB Atlas (Mongoose 8 ODM) |
| **AI Integration** | Groq SDK — Llama 3.3 70B Versatile |
| **Authentication** | JSON Web Tokens (jsonwebtoken) |
| **Encryption** | bcryptjs (salt rounds: 10) |
| **Security** | Helmet.js, express-rate-limit, CORS |
| **Validation** | express-validator |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM v6 |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## Core Features

### Real-Time Bidding Engine
The bidding subsystem enforces strict server-side validation at every stage:
- **Chronological integrity** — Bids are rejected once the auction end date has passed or the item status is "closed."
- **Financial integrity** — Every bid must strictly exceed the current highest bid and meet or exceed the starting price.
- **Idempotent bid upsert** — If a user already has a bid on an item, subsequent bids update the existing record rather than creating duplicates.
- **Automatic valuation recalculation** — Upon bid creation, update, or deletion, the `currentBid` is recalculated from the highest remaining bid, or reverted to the starting price if no bids remain.
- **Countdown timer** — Client-side `AuctionTimer` component renders a real-time countdown to the auction end date.
- **Automated status expiration** — A static method on the AuctionItem model batch-transitions all expired auctions to "closed" before any query is served.

### AI Virtual Concierge
An AI-powered chatbot accessible as a persistent floating widget on every page:
- **Model:** Groq SDK calling `llama-3.3-70b-versatile` with sub-100ms inference.
- **Persona:** Luxury auction house concierge with platform-specific knowledge (navigation, bidding mechanics, account roles, categories).
- **Guardrails:** Strict system prompt preventing model identity disclosure and off-topic responses.
- **Conversation Memory:** Full conversation history transmitted with each request for multi-turn contextual dialogue.
- **Parameters:** Temperature 0.5, max tokens 1024, top_p 1.

### Superadmin Governance Dashboard
Multi-dimensional control center with three tabbed views:
- **Overview Tab:** Aggregate statistics: users (by role), auctions (active/closed), bids, total volume. Financial intelligence via MongoDB aggregation pipelines. 6-month revenue trend chart & category density breakdown. Top 5 bidders and auctioneers.
- **Users Tab:** Paginated user registry with search, role filtering, role reassignment, and identity suspension toggle. Cascade user deletion support.
- **Activity Tab:** Real-time feed of latest bids, registrations, and item listings.

### Automated Commission Engine
- Settlement creation restricted to closed auctions only.
- Locates winning bid and records settlement with configurable commission rate (default 10%).
- Pre-save hook auto-calculates `commissionAmount` and `sellerPayout`.
- Settlement lifecycle: pending, paid (with timestamp), cancelled.
- Duplicate settlement protection per auction item.
- Non-superadmin users restricted to their own commission records.

### Gamification and Progression System

**XP-Based Leveling (6 tiers):**
| Level | Tier | Threshold |
|:---:|:---|:---|
| 1 | Novice | 0 bids |
| 2 | Bronze | 3+ bids |
| 3 | Silver | 10+ bids |
| 4 | Gold | 25+ bids |
| 5 | Platinum | 50+ bids |
| 6 | Diamond | 100+ bids |

**Achievement Badges (8 badges, 4 rarity tiers):**
| Badge | Condition | Rarity |
|:---|:---|:---|
| **First Bid** | 1+ bid placed | Bronze |
| **High Roller** | Bid of $1,000+ | Gold |
| **On Fire** | 3+ auction wins | Silver |
| **Creator** | Created first listing | Bronze |
| **Top Bidder** | Rank 1 on leaderboard | Diamond |
| **Collector** | 10+ items won | Gold |
| **Veteran** | 30+ days on platform | Silver |
| **Elite** | Top 5 by volume | Diamond |

### Prestige Leaderboard
- **Grand Podium** — Top 3 bidders displayed on animated 3D-style podium:
  - Rank 1: "Grandmaster" (gold accent, pulsing glow, crown icon)
  - Rank 2: "Elite" (silver accent, monolith pillar)
  - Rank 3: "Veteran" (bronze accent, medal icon)
- **Roster Table** — Full ranked table with avatar, badges, level progress bar, item count, and portfolio volume.
- Framer Motion animations: staggered entry, hover shimmer, floating icons.

### Additional Features
- **Review System** — Post-auction reviews for participating bidders.
- **User Profiles** — Account details, statistics, and activity history with editing support.
- **Category Discovery** — Visual category cards with filtered item listings.
- **Responsive Design** — Dark-mode-first with glassmorphism, ambient particles, and gradient overlays.

---

## Data Modeling

Five Mongoose schemas with validation, hooks, and indexing:

- **User Schema:** Fields: `name`, `email` (unique), `password` (min 6), `role` (bidder/auctioneer/superadmin), `status` (active/inactive), `createdAt`. Pre-save: bcrypt password hashing (10 salt rounds). Method: `comparePassword` for credential verification.
- **AuctionItem Schema:** Fields: `title`, `description`, `startingPrice`, `currentBid`, `category`, `image`, `createdBy` (ref: User), `endDate`, `status` (active/closed), `createdAt`. **5 compound indexes:** `{status, endDate}`, `{category, status}`, `{currentBid}`, `{title+description: text}`, `{createdBy}`. Virtual: `isExpired`. Statics: `updateExpiredItems`, `findWithUpdatedStatus`, `updateCurrentBid`.
- **Bid Schema:** Fields: `user` (ref: User), `item` (ref: AuctionItem), `amount`, `createdAt`.
- **Commission Schema:** Fields: `auctionItem`, `seller`, `winner`, `finalBidAmount`, `commissionRate` (0-100, default 10), `commissionAmount`, `sellerPayout`, `status` (pending/paid/cancelled), `paidAt`, `createdAt`. Pre-save: auto-calculates commission and payout on creation.
- **Review Schema:** Fields: `reviewer`, `auction reference`, `rating`, `comment`, `createdAt`.

---

## API Reference

> **Base URL:** `/api/v1`

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/signup` | Register new user | Public |
| `POST` | `/login` | Authenticate and receive JWT | Public |
| `GET` | `/me` | Retrieve authenticated user | Private |

### Auction Items (`/api/items`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/` | List items (filter, paginate, search, sort) | Public |
| `GET` | `/:id` | Single item details | Public |
| `POST` | `/` | Create auction listing | Auctioneer / Superadmin |
| `PUT` | `/:id` | Update listing | Owner / Superadmin |
| `DELETE` | `/:id` | Delete listing | Owner / Superadmin |

### Bids (`/api/bids`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/` | List bids (filter, sort, paginate) | Private |
| `GET` | `/:id` | Single bid | Private |
| `POST` | `/` | Place or update bid | Bidder / Superadmin |
| `PUT` | `/:id` | Modify bid amount | Owner / Superadmin |
| `DELETE` | `/:id` | Rescind bid | Owner / Superadmin |

### Commissions (`/api/commissions`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/` | List settlements | Seller / Superadmin |
| `GET` | `/:id` | Single settlement record | Seller / Superadmin |
| `POST` | `/` | Create settlement for closed auction | Superadmin |
| `PUT` | `/:id/status` | Update settlement status | Superadmin |
| `DELETE` | `/:id` | Rescind settlement | Superadmin |

### Reviews (`/api/reviews`) & Users (`/api/users`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/reviews` | Submit review | Participating Bidder |
| `DELETE` | `/reviews/:id` | Remove review | Reviewer / Superadmin |
| `GET` | `/users/profile` | Get user profile | Private |
| `PUT` | `/users/profile` | Update profile | Private |

### Superadmin Governance (`/api/superadmin`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `GET` | `/stats` | Platform statistics (6 aggregation pipelines) | Superadmin |
| `GET` | `/activities` | Recent activity feed | Superadmin |
| `GET` | `/users` | Paginated user registry | Superadmin |
| `PUT` | `/users/:id/role` | Reassign user role | Superadmin |
| `PUT` | `/users/:id/status` | Toggle user status | Superadmin |
| `DELETE` | `/users/:id` | Cascade delete user | Superadmin |
| `DELETE` | `/items/:id` | Force delete item | Superadmin |
| `DELETE` | `/bids/:id` | Force delete bid (with recalculation) | Superadmin |

### AI Chat (`/api/chat`)
| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/` | Send message to AI concierge | Public |

---

## Security Architecture

### Authentication & Access Control (RBAC)
- **Stateless JWT tokens** with 30-day expiration. Identity verified against database on every protected request. Suspended users are immediately locked out.
- **3-tier RBAC:**
  - **Bidder:** View items, place/update/delete own bids, submit reviews.
  - **Auctioneer:** All bidder permissions + create/update/delete own items.
  - **Superadmin:** Full system control. Cannot suspend their own account or be created via public signup.

### Data Protection & Limits
- **Encryption:** bcryptjs with 10 salt rounds; passwords excluded from all API responses.
- **Protection:** Helmet.js for security headers, express-validator for input sanitization.
- **Rate Limiting:** Standard API routes limited to 100 req/15min. Auth and bidding routes strictly limited to 30 req/15min.
- **CORS:** Configurable allowed origins via `ALLOWED_ORIGINS` env variable. Credentials enabled.

---

## Frontend Architecture

### Pages (18)
| Category | Routes |
|:---|:---|
| **Public** | `/` (Home), `/about`, `/how-it-works`, `/categories`, `/category/:name`, `/items/:id`, `/auction/:id` |
| **Auth** | `/signup`, `/login` |
| **Account** | `/profile`, `/edit-profile`, `/leaderboard` |
| **Actions** | `/place-bid/:id`, `/update-bid/:id`, `/create-item`, `/update-item/:id`, `/my-auctions` |
| **Admin** | `/admin-dashboard` |

### Components & State (16 Components, 6 Contexts)
**Components:** Navbar, Footer, ItemCard, AuctionTimer, BidList, BidModal, Chatbot, GamificationBadge, StatsCard, ReviewForm, NotificationDropdown, ParticleBackground, Testimonials, Toast, ProtectedRoute, ErrorBoundary.
**State Contexts:** AuthContext, ItemContext, BidContext, ReviewContext, ToastContext, ThemeContext.

---

## Deployment Topology

```text
                     Users
                       |
                       v
              +------------------+
              |   Vercel (CDN)   |
              |   Frontend SPA   |
              +------------------+
                       |
                       | HTTPS
                       v
              +------------------+
              |   Render Cloud   |
              |   Backend API    |
              +------------------+
                       |
           +-----------+-----------+
           v                       v
  +------------------+    +------------------+
  |  MongoDB Atlas   |    |   Groq Cloud     |
  +------------------+    +------------------+
```

---

## Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm
- MongoDB Atlas account
- Groq API Key ([console.groq.com](https://console.groq.com))

### 1. Clone & Setup
```bash
git clone https://github.com/ManasSaxena14/BIDVERSE---AUCTION-PLATFORM.git
cd BIDVERSE---AUCTION-PLATFORM
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
*(Backend runs on `http://localhost:6001`)*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

### 4. Testing API Endpoints
<details>
<summary><b>View sample cURL commands</b></summary>

**Register a user:**
```bash
curl -X POST http://localhost:6001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "bidder"
  }'
```

**Authenticate:**
```bash
curl -X POST http://localhost:6001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create an auction item (requires Auctioneer JWT):**
```bash
curl -X POST http://localhost:6001/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Vintage Watch",
    "description": "Beautiful vintage watch from 1950s",
    "startingPrice": 100,
    "category": "Jewelry",
    "endDate": "2026-12-31T23:59:59.000Z"
  }'
```
</details>

> **Note:** Superadmin accounts cannot be created via the signup API. They must be manually created directly in MongoDB Atlas.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Required | Default |
|:---|:---|:---:|:---:|
| `MONGO_URI` | MongoDB Atlas connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `PORT` | Server port | No | `6001` |
| `NODE_ENV` | Environment mode | No | `development` |
| `GROQ_API_KEY` | Groq SDK API key for AI concierge | Yes | - |
| `ALLOWED_ORIGINS`| Comma-separated CORS whitelist | No | `http://localhost:3000` |

### Frontend (`frontend/.env.development`)
| Variable | Description | Required |
|:---|:---|:---:|
| `VITE_API_URL` | Backend API base URL | Yes |

---

## Project Metrics

| Category | Metric | Count |
|:---|:---|:---:|
| **Backend** | Controllers / Route Modules | 8 / 8 |
| | Database Models / Indexes | 5 / 5 |
| | API Endpoints | 30+ |
| **Frontend** | Pages / Components | 18 / 16 |
| | Context Providers | 6 |
| **Platform** | User Roles | 3 |
| | Gamification Badges / Tiers | 8 / 6 |
| | Security Layers | 5 |

---

## Troubleshooting

- **MongoDB Connection Error:** Verify `MONGO_URI` in `.env`, ensure IP address is whitelisted in Atlas Network Access, and confirm credentials.
- **JWT Token Expired:** Re-authenticate via `/api/auth/login`. Tokens expire after 30 days.
- **Permission Denied (403):** Verify user role matches access requirements and you own the resource being modified.
- **AI Concierge Not Responding:** Verify `GROQ_API_KEY` is set in backend `.env` and API quota is not exhausted.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "Add YourFeature"`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

---

## Future Roadmap

- **WebSocket Integration:** Full-duplex communication for instantaneous bid propagation and live notifications.
- **Payment Gateway:** Secure payment processing (Stripe/Razorpay) for automated escrow and transaction clearance.
- **Image Upload:** Cloud-based storage (Cloudinary/AWS S3) replacing placeholder URLs.
- **Push Notifications:** Server-side alerts for outbid events, auction endings, and settlement updates.
- **Advanced Search:** Elasticsearch integration for faceted search and filtering.

---

## License

Distributed under the **MIT License**.
