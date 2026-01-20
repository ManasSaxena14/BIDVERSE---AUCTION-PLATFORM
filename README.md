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

## API Documentation (Quick View)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Obtain JWT token | Public |
| GET | `/api/items` | List all auction items | Public |
| POST | `/api/items` | Create new auction item | Private (Seller) |
| POST | `/api/bids/:itemId` | Place a bid | Private (Bidder) |

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
