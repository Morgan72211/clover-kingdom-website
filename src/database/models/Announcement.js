const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorRank: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  discordPosted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Announcement', announcementSchema);