const express = require('express');
const { signup, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authValidation } = require('../middleware/validator');

const router = express.Router();

/**
 * Public Authentication Routes
 */
router.post('/signup', authValidation.signup, signup);
router.post('/login', authValidation.login, login);

/**
 * Private Identity Routes
 */
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;

