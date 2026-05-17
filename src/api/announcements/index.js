const express = require('express');
const Announcement = require('../../database/models/Announcement');
const sendToDiscord = require('../../discord/webhook');
const auth = require('../../middleware/auth');
const perms = require('../../middleware/permissions');
const router = express.Router();

// Public GET
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Protected POST
router.post('/', auth, perms('Vice Captain'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const { username, rank } = req.user;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    const announcement = new Announcement({ title, content, author: username, authorRank: rank });
    await announcement.save();

    try {
      await sendToDiscord(title, content, username, rank);
      announcement.discordPosted = true;
      await announcement.save();
    } catch (e) {
      console.error('Discord failed:', e.message);
    }

    res.status(201).json({ message: 'Posted', announcement });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

module.exports = router;