const express = require('express');
const router = express.Router();
const Appeal = require('../../database/models/Appeal');
const authMiddleware = require('../../middleware/auth');
const permissions = require('../../middleware/permissions');

// Submit appeal (public — no auth)
router.post('/', async (req, res) => {
  try {
    const { type, username, discordTag, reason, explanation, evidence } = req.body;

    if (!type || !username || !discordTag || !reason || !explanation) {
      return res.status(400).json({ error: 'All fields except evidence are required.' });
    }

    const appeal = new Appeal({
      type,
      username,
      discordTag,
      reason,
      explanation,
      evidence: evidence || '',
      status: 'Pending'
    });

    await appeal.save();

    res.json({
      message: 'Appeal submitted successfully',
      appeal: {
        id: appeal._id,
        type: appeal.type,
        status: appeal.status
      }
    });

  } catch (error) {
    console.error('Submit appeal error:', error);
    res.status(500).json({ error: 'Server error submitting appeal.' });
  }
});

// List all appeals (Captain+)
router.get('/review', authMiddleware, permissions('Captain'), async (req, res) => {
  try {
    const appeals = await Appeal.find().sort({ createdAt: -1 });
    res.json({ appeals });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching appeals.' });
  }
});

// Review/approve/deny appeal (Captain+)
router.post('/review/:id', authMiddleware, permissions('Captain'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNote } = req.body;
    const reviewer = req.user.username;

    if (!status || !['Approved', 'Denied'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Approved or Denied.' });
    }

    const appeal = await Appeal.findById(id);
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found.' });
    }

    if (appeal.status !== 'Pending') {
      return res.status(400).json({ error: 'This appeal has already been reviewed.' });
    }

    appeal.status = status;
    appeal.reviewedBy = reviewer;
    appeal.reviewNote = reviewNote || '';
    appeal.reviewedAt = new Date();
    await appeal.save();

    res.json({
      message: `Appeal ${status.toLowerCase()}`,
      appeal: {
        id: appeal._id,
        status: appeal.status,
        reviewedBy: appeal.reviewedBy
      }
    });

  } catch (error) {
    console.error('Review appeal error:', error);
    res.status(500).json({ error: 'Server error reviewing appeal.' });
  }
});

module.exports = router;