const express = require('express');
const Event = require('../../database/models/Event');
const auth = require('../../middleware/auth');
const perms = require('../../middleware/permissions');
const router = express.Router();

// Public GET
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ active: true }).sort({ date: 1 }).limit(20);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Protected POST
router.post('/', auth, perms('Vice Captain'), async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    const { username, rank } = req.user;
    if (!title || !description || !date || !time) return res.status(400).json({ error: 'All fields required' });

    const event = new Event({ title, description, date: new Date(date), time, host: username, hostRank: rank });
    await event.save();
    res.status(201).json({ message: 'Created', event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

// Protected PUT
router.put('/:id', auth, perms('Vice Captain'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Not found' });
    event.active = !event.active;
    await event.save();
    res.json({ message: 'Updated', event });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

module.exports = router;