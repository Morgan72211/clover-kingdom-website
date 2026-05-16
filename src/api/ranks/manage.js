const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Staff = require('../../database/models/Staff');

// Create new staff account (Suki & Wizard King only)
router.post('/create', async (req, res) => {
  try {
    const { username, password, rank } = req.body;
    const creatorRank = req.user.rank;

    // Only Suki and Wizard King can create accounts
    if (creatorRank !== 'Suki' && creatorRank !== 'Wizard King') {
      return res.status(403).json({ error: 'Only Suki and Wizard King can create staff accounts.' });
    }

    // Validate required fields
    if (!username || !password || !rank) {
      return res.status(400).json({ error: 'Username, password, and rank required.' });
    }

    // Validate rank is legitimate
    const validRanks = ['Vice Captain', 'Captain', 'Sovereign', 'Wizard King'];
    if (!validRanks.includes(rank)) {
      return res.status(400).json({ error: 'Invalid rank. Must be Vice Captain, Captain, Sovereign, or Wizard King.' });
    }

    // Prevent creating Suki rank accounts
    if (rank === 'Suki') {
      return res.status(403).json({ error: 'Cannot create accounts with Suki rank.' });
    }

    // Check if username already exists
    const existing = await Staff.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Username already taken.' });
    }

    // Hash password and create account
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = new Staff({
      username: username.toLowerCase(),
      password: hashedPassword,
      rank: rank
    });

    await newStaff.save();

    res.json({
      message: 'Staff account created successfully',
      user: {
        username: newStaff.username,
        rank: newStaff.rank,
        createdAt: newStaff.createdAt
      }
    });

  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Server error creating staff account.' });
  }
});

// Update staff rank (Suki & Wizard King only)
router.post('/update', async (req, res) => {
  try {
    const { username, newRank } = req.body;
    const editorRank = req.user.rank;
    const editorUsername = req.user.username;

    // Only Suki and Wizard King can change ranks
    if (editorRank !== 'Suki' && editorRank !== 'Wizard King') {
      return res.status(403).json({ error: 'Only Suki and Wizard King can change ranks.' });
    }

    if (!username || !newRank) {
      return res.status(400).json({ error: 'Username and new rank required.' });
    }

    // Validate rank
    const validRanks = ['Vice Captain', 'Captain', 'Sovereign', 'Wizard King', 'Suki'];
    if (!validRanks.includes(newRank)) {
      return res.status(400).json({ error: 'Invalid rank.' });
    }

    // Find target staff
    const targetStaff = await Staff.findOne({ username: username.toLowerCase() });
    if (!targetStaff) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    // Prevent changing your own rank (Suki can't demote themselves accidentally)
    if (targetStaff.username === editorUsername && editorRank === 'Suki') {
      return res.status(403).json({ error: 'You cannot change your own rank.' });
    }

    // Prevent demoting other Suki-ranked accounts
    if (targetStaff.rank === 'Suki' && editorRank !== 'Suki') {
      return res.status(403).json({ error: 'Only Suki can modify other Suki-ranked accounts.' });
    }

    // Prevent Wizard King from promoting someone to Suki
    if (newRank === 'Suki' && editorRank !== 'Suki') {
      return res.status(403).json({ error: 'Only Suki can assign the Suki rank.' });
    }

    const oldRank = targetStaff.rank;
    targetStaff.rank = newRank;
    await targetStaff.save();

    res.json({
      message: 'Rank updated successfully',
      user: {
        username: targetStaff.username,
        oldRank: oldRank,
        newRank: targetStaff.rank
      }
    });

  } catch (error) {
    console.error('Update rank error:', error);
    res.status(500).json({ error: 'Server error updating rank.' });
  }
});

// Delete staff account (Suki & Wizard King only)
router.post('/delete', async (req, res) => {
  try {
    const { username } = req.body;
    const deleterRank = req.user.rank;

    // Only Suki and Wizard King can delete accounts
    if (deleterRank !== 'Suki' && deleterRank !== 'Wizard King') {
      return res.status(403).json({ error: 'Only Suki and Wizard King can delete staff accounts.' });
    }

    if (!username) {
      return res.status(400).json({ error: 'Username required.' });
    }

    const targetStaff = await Staff.findOne({ username: username.toLowerCase() });
    if (!targetStaff) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    // Prevent deleting Suki accounts unless you're Suki
    if (targetStaff.rank === 'Suki' && deleterRank !== 'Suki') {
      return res.status(403).json({ error: 'Cannot delete Suki-ranked accounts.' });
    }

    // Prevent self-deletion
    if (targetStaff.username === req.user.username) {
      return res.status(403).json({ error: 'You cannot delete your own account.' });
    }

    await Staff.deleteOne({ username: username.toLowerCase() });

    res.json({
      message: 'Staff account deleted successfully',
      deletedUser: username.toLowerCase()
    });

  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ error: 'Server error deleting staff account.' });
  }
});

// List all staff (Suki & Wizard King only)
router.get('/list', async (req, res) => {
  try {
    const requesterRank = req.user.rank;

    if (requesterRank !== 'Suki' && requesterRank !== 'Wizard King') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const staffList = await Staff.find({}, { password: 0 }).sort({ rank: 1 });

    res.json({
      count: staffList.length,
      staff: staffList
    });

  } catch (error) {
    console.error('List staff error:', error);
    res.status(500).json({ error: 'Server error fetching staff list.' });
  }
});

module.exports = router;