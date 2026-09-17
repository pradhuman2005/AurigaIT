const express = require('express');
const router = express.Router();
const { createRedemption } = require('../controllers/redemptionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRedemption);

module.exports = router;
