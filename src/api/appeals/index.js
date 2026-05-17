const express = require('express');
const Appeal = require('../../database/models/Appeal');
const auth = require('../../middleware/auth');
const perms = require('../../middleware/permissions');
const router = express.Router();

// Public POST (submit appeal)
router.post('/', async (req, res) => {
  try {
    const { username, discordId, type, reason, explanation } = req.body;
    if (!username || !discordId || !type || !reason || !explanation) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const appeal = new Appeal({ username, discordId, type, reason, explanation });
    await appeal.save();
    res.status(201).json({ message: 'Submitted', appeal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit' });
  }
});

// Protected GET (review appeals)
router.get('/', auth, perms('Captain'), async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const appeals = await Appeal.find(filter).sort({ createdAt: -1 });
    res.json(appeals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Protected PUT (review appeal)
router.put('/:id', auth, perms('Captain'), async (req, res) => {
  try {
    const { status, reviewNote } = req.body;
    const { username } = req.user;
    if (!status || !['Approved', 'Denied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const appeal = await Appeal.findById(req.params.id);
    if (!appeal) return res.status(404).json({ error: 'Not found' });
    appeal.status = status;
    appeal.reviewedBy = username;
    appeal.reviewNote = reviewNote || '';
    await appeal.save();
    res.json({ message: 'Reviewed', appeal });
  } catch (error) {
    res.status(500).json({ error: 'Failed to review' });
  }
});

module.exports = router;