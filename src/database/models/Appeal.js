const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  discordId: { type: String, required: true },
  type: { type: String, required: true, enum: ['Ban', 'Warn', 'Mute'] },
  reason: { type: String, required: true },
  explanation: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Denied'] },
  reviewedBy: { type: String, default: null },
  reviewNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appeal', appealSchema);