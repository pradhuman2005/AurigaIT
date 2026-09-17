const mongoose = require('mongoose');

const systemClockSchema = mongoose.Schema({
  // Always use a single static ID like 'clock'
  _id: { type: String, default: 'clock' },
  currentTime: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('SystemClock', systemClockSchema);
