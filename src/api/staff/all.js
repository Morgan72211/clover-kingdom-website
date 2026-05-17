const express = require('express');
const User = require('../../database/models/User');
const auth = require('../../middleware/auth');
const perms = require('../../middleware/permissions');
const router = express.Router();

router.get('/', auth, perms('Sovereign'), async (req, res) => {
  try {
    const staff = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

module.exports = router;