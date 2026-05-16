const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorRank: {
    type: String,
    required: true,
    enum: ['Vice Captain', 'Captain', 'Sovereign', 'Wizard King', 'Suki']
  },
  postedToDiscord: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Announcement', announcementSchema);