require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Express 5 makes req.query a getter, so we sanitize in-place instead of reassigning
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  if (req.query) mongoSanitize.sanitize(req.query, { replaceWith: '_' });
  if (req.headers) mongoSanitize.sanitize(req.headers, { replaceWith: '_' });
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/redemptions', require('./routes/redemptionRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/clock', require('./routes/clockRoutes'));
app.use('/api/outbox', require('./routes/outboxRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
