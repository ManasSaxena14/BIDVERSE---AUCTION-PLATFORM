const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Retrieve all registered entities (Superadmin Governance)
 * @route   GET /api/users
 * @access  Private (Superadmin)
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

/**
 * @desc    Retrieve specific entity intelligence (Superadmin Governance)
 * @route   GET /api/users/:id
 * @access  Private (Superadmin)
 */
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new ErrorResponse('Identity Retrieval Failure: Specified identifier not found.', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

/**
 * @desc    Modify entity parameters (Superadmin Governance)
 * @route   PUT /api/users/:id
 * @access  Private (Superadmin)
 */
const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role, status } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('Identity Modification Failure: Specified identifier not found.', 404));
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (status) user.status = status;

  await user.save();

  const updatedUser = await User.findById(user._id).select('-password');

  res.status(200).json({
    success: true,
    message: 'Entity identity parameters successfully modified.',
    user: updatedUser
  });
});

/**
 * @desc    Terminate entity identity and associated assets (Superadmin Governance)
 * @route   DELETE /api/users/:id
 * @access  Private (Superadmin)
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('Identity Termination Failure: Specified identifier not found.', 404));
  }

  /**
   * Cascade Liquidation: Purge all assets and capital proposals associated with this identity
   */
  const AuctionItem = require('../models/AuctionItem');
  const Bid = require('../models/Bid');
  
  await AuctionItem.deleteMany({ createdBy: req.params.id });
  await Bid.deleteMany({ user: req.params.id });

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Entity identity and all associated asset/bid records successfully purged from the registry.'
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

