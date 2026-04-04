<h1 align="center"><b>BIDVERSE — Complete MERN Auction Platform</b></h1>

<p align="center">
  A high-performance, full-stack auction platform designed for seamless bidding experiences. Built with the <b>MERN</b> stack, BIDVERSE offers robust security, real-time updates, and a modular architecture.
</p>

---

## Live Demo & API
- **Frontend Demo:** [bidverse-auction-platform.vercel.app](https://bidverse-auction-platform.vercel.app/)
---

## Key Features
- **Advanced Authentication**: Secure JWT-based authentication with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Bidder, Seller, and Admin.
- **Real-Time Bidding**: Dynamic auction updates for competitive bidding.
- **Item Management**: Sellers can create, update, and manage auction items with ease.
- **Review System**: Built-in trust mechanism with user reviews and ratings.
- **Responsive Design**: Fluid UI built with Tailwind CSS for mobile and desktop.

---

## Tech Stack

### Frontend
- **React.js (Vite)** — Fast, component-based UI
- **Tailwind CSS** — Modern utility-first styling
- **Context API** — Lightweight state management
- **React Icons** — Consistent iconography
- **Axios** — Robust HTTP communication

### Backend
- **Node.js & Express** — Scalable server-side logic
- **MongoDB Atlas** — Scalable cloud database
- **Mongoose** — Elegant object modeling for Node.js
- **JWT** — Secure stateless authentication
- **Express Validator** — Strict request data validation

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/ManasSaxena14/BIDVERSE---AUCTION-PLATFORM.git
cd BIDVERSE---AUCTION-PLATFORM
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Update variables: MONGO_URI, JWT_SECRET, PORT
npm run dev
```
*Server runs on:* `http://localhost:6001`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*App runs on:* `http://localhost:3000`

---

## User Roles
- **Bidder**: Browse items, place bids, and leave reviews.
- **Seller**: Post new items, manage their auctions, and view bids.
- **Admin**: Full system control — manage users, items, and platform settings.

> [!IMPORTANT]
> **Admin Setup**: Since admins cannot be created via the signup API for security, you must manually insert the first admin into your database. See [Creating an Admin](#creating-an-admin-user) section below.

---

## Creating an Admin User
To get started with admin privileges, insert a document into your `users` collection:

```json
{
  "name": "Admin Name",
  "email": "admin@bidverse.com",
  "password": "[HASHED_PASSWORD]", 
  "role": "admin"
}
```

---

---

## Architecture & Design (Backend)

The backend is built using a **Modular MVC (Model-View-Controller)** pattern for maximum separation of concerns:

1.  **Models (`/models`)**: Definitive schemas for Users, Items, Bids, and Commissions using Mongoose.
2.  **Controllers (`/controllers`)**: Isolated business logic. This ensures that route handlers remain lean and testable.
3.  **Routes (`/routes`)**: Clean mapping of URL endpoints to controller functions, wrapped in robust middleware.
4.  **Middleware (`/middleware`)**: Centralized logic for Authentication, RBAC (Role-Based Access Control), and Error Handling.

---

## Logical Constraints & Business Rules

BIDVERSE implements rigorous server-side logic to maintain platform integrity:

-   **Bidding Guardrails**:
    -   Users cannot bid on their own auctions.
    -   Bids must be strictly higher than the current highest bid.
    -   Active auctions only: No bidding once the `endDate` has passed.
-   **User Status**:
    -   Admins can toggle a user status between `active` and `inactive`.
    -   `inactive` users are instantly barred from logging in or performing any platform actions.
-   **Financial Integrity**:
    -   Successful auctions automatically generate a `Commission` record.
    -   Platform revenue is calculated as a fixed percentage of the closing price.

---

## Data Modeling

-   **User**: Handles auth, roles (`bidder`, `auctioneer`, `superadmin`), and suspension status.
-   **AuctionItem**: Reference-linked to `User` (creator). It tracks `currentBid` and `status` (`active`, `closed`).
-   **Bid**: Many-to-one relationship with both `User` and `AuctionItem`.
-   **Commission**: Generated upon auction closure to track platform earnings and seller payouts.

---

## Reliability & Validation

-   **Strict Input Validation**: Every endpoint validates required fields and data types before processing.
-   **HTTP Status Codes**:
    -   `200/201`: Success / Resource Created
    -   `400`: Client Error (Invalid input / Business logic violation)
    -   `401/403`: Unauthorized / Forbidden (Role mismatch)
    -   `404`: Resource not found
-   **Error Responses**: Consistent JSON error objects with descriptive `message` fields for frontend consumption.

---

## Assumptions & Tradeoffs

-   **Stateless Auth**: We chose JWT over Sessions for scalability, allowing the backend to remain stateless.
-   **Real-time Simulation**: For this version, we use polling/re-fetching rather than WebSockets to reduce server overhead while maintaining high data consistency.
-   **Admin Creation**: For security, Superadmins cannot be created via the public signup endpoint; they must be promoted by an existing Admin or via DB access.

---

## API Documentation (Expanded)

### Auth Endpoints
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login & get JWT | Public |
| GET | `/api/auth/me` | Get current profile | Private |

### Auction Endpoints
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| GET | `/api/items` | List & search items | Public |
| POST | `/api/items` | Create new auction | Seller/Admin |
| PUT | `/api/items/:id` | Update item | Owner/Admin |

### Bid Endpoints
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/bids` | Place/Update a bid | Bidder/Admin |
| GET | `/api/items/:id/bids` | View item bids | Public |

### Admin Endpoints (Superadmin Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/superadmin/stats` | Platform analytics & trends |
| GET | `/api/superadmin/users` | Manage all users |
| PUT | `/api/superadmin/users/:id/status` | Suspend/Activate user |

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
