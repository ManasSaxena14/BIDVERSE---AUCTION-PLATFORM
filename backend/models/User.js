const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Identity Registry Protocol (User Schema)
 * Defines the parameters for unique entity identification and administrative standing.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Identity name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Registry email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Secure credential is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['bidder', 'auctioneer', 'superadmin'],
    default: 'bidder'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Credential Hashing Strategy: Execute cryptographic protection on identity credentials
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Verification Logic: Standardized interface for credential synchronization
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

