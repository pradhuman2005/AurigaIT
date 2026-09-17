const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

module.exports = router;
