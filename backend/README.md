# 🎯 Auction Platform Backend

A complete backend for an auction platform built with Node.js, Express, MongoDB Atlas, JWT authentication, and role-based access control (RBAC).

## ✨ Features

### Authentication & Security
- 🔐 JWT Authentication
- 🔒 Role-Based Access Control (Bidder, Auctioneer, Superadmin)
- 🔑 Password Hashing with bcrypt
- 🛡️ Protected Routes Middleware

### Core Functionality
- 📦 Complete CRUD Operations for Auction Items and Bids
- 📊 Advanced Filtering, Pagination, Search, and Sorting
- ⭐ Review System for Completed Auctions
- 📈 Real-time Bid Tracking
- 🕒 Automatic Auction Status Updates

### Database & Infrastructure
- 🌐 MongoDB Atlas Integration
- 📁 Modular Project Structure
- 🔄 RESTful API Design

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/              # Business logic
│   ├── authController.js     # Authentication logic
│   ├── bidController.js      # Bid management
│   ├── itemController.js     # Auction item management
│   ├── reviewController.js    # Review management
│   ├── userController.js     # User management
│   └── commissionController.js # Commission calculations
├── middleware/               # Custom middleware
│   ├── auth.js               # Authentication middleware
│   └── authorization.js      # RBAC middleware
├── models/                   # Database models
│   ├── AuctionItem.js        # Auction item schema
│   ├── Bid.js                # Bid schema
│   ├── Review.js             # Review schema
│   ├── User.js               # User schema
│   └── Commission.js         # Commission schema
├── routes/                   # API routes
│   ├── authRoutes.js         # Authentication routes
│   ├── bidRoutes.js          # Bid routes
│   ├── itemRoutes.js         # Auction item routes
│   ├── reviewRoutes.js       # Review routes
│   ├── userRoutes.js         # User routes
│   └── commissionRoutes.js   # Commission routes
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
└── server.js                 # Entry point
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Step 1: Navigate to backend directory
```bash
cd backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string

### Step 4: Create .env file
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auction-platform?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=6001
NODE_ENV=development
```

Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### Step 5: Start the backend server
```bash
npm start
# or for development with auto-restart
npm run dev
```

Backend will run on: **http://localhost:6001**

## 📡 API Endpoints

### Authentication
| Method | Endpoint         | Description           | Access      |
|--------|------------------|-----------------------|-------------|
| POST   | `/api/auth/signup` | Register new user     | Public      |
| POST   | `/api/auth/login`  | Login user            | Public      |
| GET    | `/api/auth/me`     | Get current user      | Private     |

### Auction Items
| Method | Endpoint         | Description           | Access      |
|--------|------------------|-----------------------|-------------|
| GET    | `/api/items`       | Get all items         | Public      |
| GET    | `/api/items/:id`   | Get single item       | Public      |
| POST   | `/api/items`       | Create new item       | Auctioneer/Superadmin |
| PUT    | `/api/items/:id`   | Update item           | Owner/Superadmin |
| DELETE | `/api/items/:id`   | Delete item           | Owner/Superadmin |

### Bids
| Method | Endpoint         | Description           | Access      |
|--------|------------------|-----------------------|-------------|
| GET    | `/api/bids`        | Get all bids          | Public      |
| GET    | `/api/bids/:id`    | Get single bid        | Public      |
| POST   | `/api/bids`        | Create new bid        | Bidder/Superadmin |
| PUT    | `/api/bids/:id`    | Update bid            | Owner/Superadmin |
| DELETE | `/api/bids/:id`    | Delete bid            | Owner/Superadmin |

### Reviews
| Method | Endpoint         | Description           | Access      |
|--------|------------------|-----------------------|-------------|
| POST   | `/api/reviews`     | Create review         | Bidder who participated |
| DELETE | `/api/reviews/:id` | Delete review         | Reviewer/Superadmin |

## 👤 User Roles & Permissions

### Bidder
- View all auction items
- Place bids on items
- Update their own bids
- Delete their own bids
- Leave reviews on completed auctions they participated in

### Auctioneer
- Create auction items
- Update their own auction items
- Delete their own auction items
- View bids on their items

### Superadmin
- Perform ANY CRUD operation
- Delete ANY auction item
- Delete ANY bid
- Full system control

> **Note:** Superadmin CANNOT be created via signup API. Must be manually created in MongoDB Atlas.

## 🛠️ Environment Variables

| Variable     | Description              | Required | Default    |
|--------------|--------------------------|----------|------------|
| MONGO_URI    | MongoDB Atlas connection  | Yes      | None       |
| JWT_SECRET   | Secret key for JWT       | Yes      | None       |
| PORT         | Server port              | No       | 6001       |
| NODE_ENV     | Environment              | No       | development|

## 🧪 Testing API Endpoints

### User Signup
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

### User Login
```bash
curl -X POST http://localhost:6001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Auction Item
```bash
curl -X POST http://localhost:6001/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Vintage Watch",
    "description": "Beautiful vintage watch from 1950s",
    "startingPrice": 100,
    "category": "Jewelry",
    "endDate": "2024-12-31T23:59:59.000Z"
  }'
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGO_URI` in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username/password credentials

2. **JWT Token Expired**
   - Log in again to get a new token
   - Check token expiration settings

3. **Permission Denied**
   - Verify your user role
   - Check if you're the owner of the resource

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 📞 Support

For support, email [your-email@example.com] or open an issue in the repository.