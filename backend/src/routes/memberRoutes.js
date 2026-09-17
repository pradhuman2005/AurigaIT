const express = require('express');
const router = express.Router();
const { getMembers, getMemberById, searchMembers, createMember, getMemberTransactions } = require('../controllers/memberController');
const { getMemberOutbox } = require('../controllers/outboxController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMembers).post(protect, createMember);
router.route('/search').get(protect, searchMembers);
router.route('/:id').get(protect, getMemberById);
router.route('/:id/transactions').get(protect, getMemberTransactions);
router.route('/:id/outbox').get(protect, getMemberOutbox);

module.exports = router;
