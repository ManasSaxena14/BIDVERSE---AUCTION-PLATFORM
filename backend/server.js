const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://bidverse-auction-platform.vercel.app' 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/superadmin', require('./routes/superadminRoutes'));
app.use('/api/commissions', require('./routes/commissionRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Auction Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        getMe: 'GET /api/auth/me'
      },
      items: {
        getAll: 'GET /api/items',
        getById: 'GET /api/items/:id',
        create: 'POST /api/items',
        update: 'PUT /api/items/:id',
        delete: 'DELETE /api/items/:id'
      },
      bids: {
        getAll: 'GET /api/bids',
        getById: 'GET /api/bids/:id',
        create: 'POST /api/bids',
        update: 'PUT /api/bids/:id',
        delete: 'DELETE /api/bids/:id'
      }
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});