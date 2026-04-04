const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Establish new entity identity (Signup)
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  /**
   * Redundancy Check: Verify if identity already exists
   */
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('Identity Redundancy: An account with this email already exists.', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'bidder'
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Identity successfully established within the protocol.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * @desc    Authenticate existing entity (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  /**
   * Retrieval: Locate entity by unique identifier
   */
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse('Authentication Failure: Invalid credentials provided.', 401));
  }

  /**
   * Integrity Check: Verify account status
   */
  if (user.status === 'inactive') {
    return next(new ErrorResponse('Access Revoked: This identity has been suspended by governance.', 401));
  }

  /**
   * Verification: Match security credentials
   */
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new ErrorResponse('Authentication Failure: Invalid credentials provided.', 401));
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Authentication successful. Session established.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * @desc    Retrieve authenticated entity profile (Me)
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({
    success: true,
    user
  });
});

/**
 * @desc    Modify authenticated entity profile (Update)
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateMe = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name && !email) {
    return next(new ErrorResponse('Protocol Violation: No modification parameters provided.', 400));
  }

  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Identity Redundancy: Email identifier is already in use.', 400));
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password');
  
  res.status(200).json({
    success: true,
    message: 'Identity parameters successfully modified.',
    user
  });
});

module.exports = { signup, login, getMe, updateMe };



