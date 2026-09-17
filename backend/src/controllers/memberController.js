const asyncHandler = require('express-async-handler');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

const getMembers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sort || 'createdAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;

  const totalItems = await Member.countDocuments();
  const members = await Member.find()
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  res.json({
    members,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
    limit
  });
});

const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (member) {
    res.json(member);
  } else {
    res.status(404);
    throw new Error('Member not found');
  }
});

const searchMembers = asyncHandler(async (req, res) => {
  const phone = req.query.phone;
  if (!phone) {
    res.status(400);
    throw new Error('Phone number query parameter is required');
  }
  const members = await Member.find({ phone: { $regex: phone, $options: 'i' } });
  res.json(members);
});

const createMember = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone) {
    res.status(400);
    throw new Error('Name and phone are required');
  }
  
  const memberExists = await Member.findOne({ phone });
  if (memberExists) {
    res.status(409);
    throw new Error('Phone number is already registered');
  }
  
  const member = await Member.create({ name, phone, email });
  res.status(201).json(member);
});

const getMemberTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ memberId: req.params.id })
    .sort({ createdAt: -1 });
  res.json(transactions);
});

module.exports = { getMembers, getMemberById, searchMembers, createMember, getMemberTransactions };
