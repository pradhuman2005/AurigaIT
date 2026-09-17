const express = require('express');
const router = express.Router();
const { getOutbox, dispatchOutbox } = require('../controllers/outboxController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getOutbox);

router.route('/dispatch')
  .post(protect, dispatchOutbox);

module.exports = router;
