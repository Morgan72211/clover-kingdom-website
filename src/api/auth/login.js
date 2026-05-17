const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../database/models/User');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    // Remove .toLowerCase() to match exact case
    const user = await User.findOne({ username: username.trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, rank: user.rank },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { username: user.username, rank: user.rank } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;