const mongoose = require('mongoose');

/**
 * Enterprise Database Connectivity Configuration
 * Establishes a secure, persistent connection to MongoDB Atlas.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true, // Build indexes automatically (useful for development)
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DATABASE] Connectivity Established: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`[DATABASE] Critical Failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

