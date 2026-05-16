const express = require('express');
const router = express.Router();
const Event = require('../../database/models/Event');
const authMiddleware = require('../../middleware/auth');
const permissions = require('../../middleware/permissions');

console.log('Events router loading...');

// List (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: 1 }).limit(20);
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching events.' });
  }
});

// Create (protected)
router.post('/create', authMiddleware, permissions('Vice Captain'), async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    const host = req.user.username;
    const hostRank = req.user.rank;

    if (!title || !description || !eventDate) {
      return res.status(400).json({ error: 'Title, description, and date required.' });
    }

    const event = new Event({
      title,
      description,
      host,
      hostRank,
      eventDate: new Date(eventDate),
      status: 'Upcoming'
    });

    await event.save();

    res.json({
      message: 'Event created successfully',
      event: {
        id: event._id,
        title: event.title,
        eventDate: event.eventDate
      }
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error creating event.' });
  }
});

// Edit (protected)
router.post('/edit/:id', authMiddleware, permissions('Vice Captain'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate, status } = req.body;
    const userRank = req.user.rank;
    const username = req.user.username;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const canEdit = (
      event.host === username ||
      userRank === 'Sovereign' ||
      userRank === 'Wizard King' ||
      userRank === 'Suki'
    );

    if (!canEdit) {
      return res.status(403).json({ error: 'You can only edit your own events.' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = new Date(eventDate);
    if (status && ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'].includes(status)) {
      event.status = status;
    }

    await event.save();

    res.json({
      message: 'Event updated successfully',
      event: {
        id: event._id,
        title: event.title,
        status: event.status
      }
    });

  } catch (error) {
    console.error('Edit event error:', error);
    res.status(500).json({ error: 'Server error editing event.' });
  }
});

// Delete (protected)
router.post('/delete/:id', authMiddleware, permissions('Captain'), async (req, res) => {
  try {
    const { id } = req.params;
    const userRank = req.user.rank;
    const username = req.user.username;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const canDelete = (
      event.host === username ||
      userRank === 'Captain' ||
      userRank === 'Sovereign' ||
      userRank === 'Wizard King' ||
      userRank === 'Suki'
    );

    if (!canDelete) {
      return res.status(403).json({ error: 'No permission to delete this event.' });
    }

    await Event.deleteOne({ _id: id });
    res.json({ message: 'Event deleted successfully', deletedId: id });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Server error deleting event.' });
  }
});

module.exports = router;