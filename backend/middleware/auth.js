const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Identity Verification Protocol (Auth Protection)
 * Authenticates entity credentials and synchronizes session state.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      /**
       * Credential Synchronization: Extract bearer token for verification
       */
      token = req.headers.authorization.split(' ')[1];

      /**
       * Decryption: Verify identity against platform-level security secret
       */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      /**
       * Registry Verification: Confirm entity identity still persists in registry
       */
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return next(new ErrorResponse('Identity Failure: Registry record no longer exists.', 401));
      }

      /**
       * Compliance Check: Verify identity standing within the platform
       */
      if (req.user.status === 'inactive') {
        return next(new ErrorResponse('Access Revoked: Identity credentials have been suspended by Global Governance.', 401));
      }

      next();
    } catch (error) {
      return next(new ErrorResponse('Credential Integrity Failure: Invalid authorization token provided.', 401));
    }
  }

  if (!token) {
    return next(new ErrorResponse('Access Denied: Identity credentials were not provided for verification.', 401));
  }
};

/**
 * Credential Generation: Issue security tokens for authorized identities
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = { protect, generateToken };

