const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Ban', 'Warn', 'Mute']
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  discordTag: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  evidence: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied'],
    default: 'Pending'
  },
  reviewedBy: {
    type: String,
    default: null
  },
  reviewNote: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Appeal', appealSchema);