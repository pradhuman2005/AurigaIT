require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/redemptions', require('./routes/redemptionRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
