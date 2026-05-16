const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../../database/models/Staff');

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }

    const staff = await Staff.findOne({ username: username.toLowerCase() });

    if (!staff) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { 
        userId: staff._id,
        username: staff.username,
        rank: staff.rank
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        username: staff.username,
        rank: staff.rank
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;