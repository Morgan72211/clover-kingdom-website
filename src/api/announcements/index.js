console.log('Announcements router loaded');
const express = require('express');
const router = express.Router();
const Announcement = require('../../database/models/Announcement');
const authMiddleware = require('../../middleware/auth');
const permissions = require('../../middleware/permissions');

// List (public — no auth)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json({ announcements });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching announcements.' });
  }
});

// Create (protected)
router.post('/create', authMiddleware, permissions('Vice Captain'), async (req, res) => {
  try {
    const { title, content, sendToDiscord } = req.body;
    const author = req.user.username;
    const authorRank = req.user.rank;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required.' });
    }

    const announcement = new Announcement({
      title,
      content,
      author,
      authorRank,
      postedToDiscord: false
    });

    if (sendToDiscord && process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Clover Kingdom',
            embeds: [{
              title: `📢 ${title}`,
              description: content,
              color: 0xFFFFFF,
              footer: { text: `Posted by ${author} (${authorRank})` },
              timestamp: new Date().toISOString()
            }]
          })
        });
        announcement.postedToDiscord = true;
      } catch (e) {
        console.log('Discord webhook failed');
      }
    }

    await announcement.save();
    res.json({ message: 'Announcement posted', announcement: { id: announcement._id, title, postedToDiscord: announcement.postedToDiscord } });

  } catch (error) {
    res.status(500).json({ error: 'Server error posting announcement.' });
  }
});

// Edit (protected)
router.post('/edit/:id', authMiddleware, permissions('Vice Captain'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userRank = req.user.rank;
    const username = req.user.username;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required.' });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    const canEdit = (
      announcement.author === username ||
      userRank === 'Sovereign' ||
      userRank === 'Wizard King' ||
      userRank === 'Suki'
    );

    if (!canEdit) {
      return res.status(403).json({ error: 'You can only edit your own announcements.' });
    }

    announcement.title = title;
    announcement.content = content;
    await announcement.save();

    res.json({ message: 'Announcement updated', announcement: { id: announcement._id, title, content } });

  } catch (error) {
    res.status(500).json({ error: 'Server error editing announcement.' });
  }
});

// Delete (protected) — POST instead of DELETE
router.post('/delete/:id', authMiddleware, permissions('Vice Captain'), async (req, res) => {
  try {
    const { id } = req.params;
    const userRank = req.user.rank;
    const username = req.user.username;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    const canDelete = (
      announcement.author === username ||
      userRank === 'Captain' ||
      userRank === 'Sovereign' ||
      userRank === 'Wizard King' ||
      userRank === 'Suki'
    );

    if (!canDelete) {
      return res.status(403).json({ error: 'No permission to delete this announcement.' });
    }

    await Announcement.deleteOne({ _id: id });
    res.json({ message: 'Announcement deleted', deletedId: id });

  } catch (error) {
    res.status(500).json({ error: 'Server error deleting announcement.' });
  }
});

module.exports = router;