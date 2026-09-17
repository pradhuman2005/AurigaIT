const express = require('express');
const router = express.Router();
const { createPurchase } = require('../controllers/purchaseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createPurchase);

module.exports = router;
