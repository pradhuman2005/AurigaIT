const express = require('express');
const router = express.Router();
const { getClock, advanceClock } = require('../controllers/clockController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getClock)
  .post(protect, advanceClock);

module.exports = router;
