const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true,
    enum: ['Vice Captain', 'Captain', 'Sovereign', 'Wizard King', 'Suki'],
    default: 'Vice Captain'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Staff', staffSchema);