const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Validator Execution Middleware
 * Intercepts validation results and formats institutional error responses
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map(err => err.msg);
  return next(new ErrorResponse(`Protocol Validation Failure: ${extractedErrors.join(', ')}`, 400));
};

/**
 * Authentication Validation Schemas
 */
const authValidation = {
  signup: [
    body('name')
      .trim()
      .notEmpty().withMessage('Identity name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Identity name must be between 2 and 50 characters'),
    body('email')
      .isEmail().withMessage('Valid institutional email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Security credentials must be at least 6 characters in length'),
    body('role')
      .optional()
      .isIn(['bidder', 'auctioneer']).withMessage('Invalid entity role assignment'),
    validate
  ],
  login: [
    body('email').isEmail().withMessage('Valid institutional email is required'),
    body('password').notEmpty().withMessage('Security credentials are required'),
    validate
  ]
};

/**
 * Asset Management Validation Schemas
 */
const itemValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Asset title is required')
      .isLength({ max: 100 }).withMessage('Asset title exceeds maximum length'),
    body('description')
      .notEmpty().withMessage('Asset description is required'),
    body('startingPrice')
      .isFloat({ min: 0 }).withMessage('Baseline valuation must be a non-negative numeric value'),
    body('category')
      .notEmpty().withMessage('Asset categorization is required'),
    body('endDate')
      .isISO8601().withMessage('Valid protocol termination date is required')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Protocol termination must be scheduled in the future');
        }
        return true;
      }),
    validate
  ],
  update: [
    body('title').optional().trim().notEmpty(),
    body('description').optional().notEmpty(),
    body('startingPrice').optional().isFloat({ min: 0 }),
    body('category').optional().notEmpty(),
    body('status').optional().isIn(['active', 'closed']),
    validate
  ]
};

/**
 * Capital Proposal (Bid) Validation Schemas
 */
const bidValidation = {
  place: [
    body('amount')
      .isFloat({ min: 0.01 }).withMessage('Capital allocation must be a positive numeric value'),
    validate
  ]
};

module.exports = {
  authValidation,
  itemValidation,
  bidValidation
};
