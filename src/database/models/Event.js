const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  hostRank: {
    type: String,
    required: true,
    enum: ['Vice Captain', 'Captain', 'Sovereign', 'Wizard King', 'Suki']
  },
  eventDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);