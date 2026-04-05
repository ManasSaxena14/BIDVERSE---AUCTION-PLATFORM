const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

dotenv.config();

/**
 * Initialize core infrastructure
 */
connectDB();

const app = express();

/**
 * Security Protocols
 */
app.use(helmet()); 

/**
 * Standard Rate Limiting
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

/**
 * Strict Rate Limiting (Authentication & Bidding)
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, 
  message: 'Exceeded request limit for sensitive operations.'
});
app.use('/api/auth/login', strictLimiter);
app.use('/api/auth/signup', strictLimiter);
app.use('/api/bids', strictLimiter);

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000'];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS violation: Access Denied'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const errorHandler = require('./middleware/errorMiddleware');

/**
 * Global Routing Table
 */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/superadmin', require('./routes/superadminRoutes'));
app.use('/api/commissions', require('./routes/commissionRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/', (req, res) => {
  res.json({
    message: 'BidVerse Institutional API',
    version: '1.0.0',
    status: 'Operational'
  });
});

/**
 * Final Middleware Layer (Error Handling & 404)
 */
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Resource link terminated: Route not found' 
  });
});

const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
  console.log(`[TERMINAL] System active on port ${PORT}`);
  console.log(`[STATUS] Environment: ${process.env.NODE_ENV || 'development'}`);
});