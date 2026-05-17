const express = require('express');
const User = require('../../database/models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const staff = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, password, rank } = req.body;
    if (!username || !password || !rank) return res.status(400).json({ error: 'All fields required' });
    const validRanks = ['Vice Captain', 'Captain', 'Sovereign', 'Wizard King'];
    if (!validRanks.includes(rank)) return res.status(400).json({ error: 'Invalid rank' });
    if (await User.findOne({ username })) return res.status(400).json({ error: 'Username taken' });

    const user = new User({ username, password, rank });
    await user.save();
    res.status(201).json({ message: 'Created', user: { username, rank } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { rank } = req.body;
    const validRanks = ['Vice Captain', 'Captain', 'Sovereign', 'Wizard King'];
    if (!validRanks.includes(rank)) return res.status(400).json({ error: 'Invalid rank' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    user.rank = rank;
    await user.save();
    res.json({ message: 'Updated', user: { username: user.username, rank } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;