# BIDVERSE - AUCTION PLATFORM

A complete auction platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring JWT authentication, role-based access control (RBAC), real-time bidding, and a review system.

## Deployment Notes

### Backend Deployment (Render)
- Build Command: `yarn install --production`
- Start Command: `yarn start`
- Environment Variables Required:
  - `MONGO_URI` - MongoDB Atlas connection string
  - `JWT_SECRET` - Secret key for JWT token generation
  - `PORT` - Port for the server (Render will set this automatically)
  - `NODE_ENV` - Set to "production"

**IMPORTANT**: After deploying the backend to Render, update the target URL in `frontend/vite.config.js`:
- Replace `https://your-render-backend-url.onrender.com` with your actual Render backend URL

### Frontend Deployment (Vercel)
- The frontend is configured to work with both local development and production environments
- For production, it expects the backend to be deployed and the URL updated in `vite.config.js`
- The CORS configuration in the backend is set to allow requests from `https://bidverse-auction-platform.vercel.app`

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup

See [backend/README.md](backend/README.md) for detailed backend setup instructions.

#### Quick Backend Setup:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB credentials
npm run dev
```

Backend will run on: **http://localhost:6001**

### Frontend Setup

See [frontend/README.md](frontend/README.md) for detailed frontend setup instructions.

#### Quick Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 👤 Creating a Superadmin User

Since superadmin cannot be created via the signup API, you must manually insert it into MongoDB Atlas:

### Option 1: Using MongoDB Compass (Recommended for Beginners)

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB Atlas connection string
3. Navigate to your database → `users` collection
4. Click "Add Data" → "Insert Document"
5. Paste this JSON (make sure to hash the password first or use a simple one for testing):

```json
{
  "name": "Super Admin",
  "email": "admin@auction.com",
  "password": "$2a$10$rG4.YLL/Rnay9F3UtDa0OuJR3fWRbDhF9L3XX.QCZDCdzRFX.GkZu", // "admin123" hashed
  "role": "superadmin"
}
```

### Option 2: Using MongoDB Atlas Dashboard

1. Go to your MongoDB Atlas dashboard
2. Select your cluster
3. Click "Collections"
4. Find your database and `users` collection
5. Click "Insert Document"
6. Paste the same JSON as above

### Option 3: Using a Script

Create a script to insert the superadmin user:

```javascript
// create-superadmin.js
const mongoose = require('mongoose');

// Connect to your MongoDB Atlas
mongoose.connect('your-mongodb-uri');

const User = require('./backend/models/User');

const createSuperAdmin = async () => {
  try {
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@auction.com',
      password: 'admin123', // Will be hashed automatically
      role: 'superadmin'
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
```

Run with: `node create-superadmin.js`

---

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

---

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGO_URI` in backend `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username/password credentials

2. **JWT Token Expired**
   - Log in again to get a new token
   - Check token expiration settings

3. **Permission Denied**
   - Verify your user role
   - Check if you're the owner of the resource

4. **Frontend Not Connecting to Backend**
   - Ensure backend is running on `http://localhost:6001`
   - Check Vite proxy configuration in `frontend/vite.config.js`
   - Verify CORS settings in backend

---

## 📚 Documentation

For detailed documentation, please refer to:
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email [your-email@example.com] or open an issue in the repository.