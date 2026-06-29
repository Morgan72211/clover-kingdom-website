import express from 'express';
import db from '../db.js';
import { config } from '../../config.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Middleware to check if user is a staff member
function requireStaff(req, res, next) {
  const isDev = process.env.DEV_MODE === 'true';
  if (isDev) {
    return next(); // Bypass checks in DEV_MODE
  }
  if (req.session && req.session.user && req.session.user.isStaff) {
    return next();
  }
  res.status(403).json({ error: 'Forbidden: Staff access required' });
}

/**
 * Send a message with embeds to a Discord Webhook
 */
async function sendDiscordWebhook(webhookUrl, embed, content = '') {
  if (!webhookUrl || webhookUrl.includes('mock_')) {
    console.log('Mock Webhook Log (No real webhook URL configured):', JSON.stringify({ content, embeds: [embed] }, null, 2));
    return;
  }
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, embeds: [embed] })
    });
  } catch (error) {
    console.error('Error sending Discord Webhook:', error);
  }
}

/**
 * GET /api/config
 * Exposes the central config.js configuration options to the client SPA
 */
router.get('/config', (req, res) => {
  res.json(config);
});

/* --- ANNOUNCEMENTS --- */

router.get('/announcements', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/announcements', requireStaff, async (req, res) => {
  const { title, content, ping } = req.body;
  const author = req.session?.user?.username || 'Staff Member';

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO announcements (title, content, author) VALUES (?, ?, ?)');
    const result = stmt.run(title, content, author);

    // Send Discord notification
    const embed = {
      title: `📢 New Announcement: ${title}`,
      description: content,
      color: 0xf59e0b, // Gold
      footer: { text: `Published by: ${author}` },
      timestamp: new Date().toISOString()
    };

    const pingText = ping === 'everyone' ? '@everyone' : (ping === 'here' ? '@here' : '');
    await sendDiscordWebhook(process.env.ANNOUNCEMENTS_WEBHOOK, embed, pingText);

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/announcements/:id', requireStaff, (req, res) => {
  try {
    db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --- EVENTS --- */

router.get('/events', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM events ORDER BY event_date ASC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/events', requireStaff, async (req, res) => {
  const { title, description, eventDate, ping } = req.body;

  if (!title || !description || !eventDate) {
    return res.status(400).json({ error: 'Title, description, and eventDate are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)');
    const result = stmt.run(title, description, eventDate);

    // Send Discord notification
    const embed = {
      title: `📅 Upcoming Event: ${title}`,
      description: description,
      fields: [{ name: 'Date & Time', value: eventDate, inline: true }],
      color: 0x10b981, // Green
      timestamp: new Date().toISOString()
    };

    const pingText = ping === 'everyone' ? '@everyone' : (ping === 'here' ? '@here' : '');
    await sendDiscordWebhook(process.env.EVENTS_WEBHOOK, embed, pingText);

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/events/:id', requireStaff, (req, res) => {
  try {
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --- APPLICATIONS --- */

router.get('/applications', requireStaff, (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/applications', async (req, res) => {
  const { username, squad, magicAttribute, strengths, whyJoin, whyAccept, level } = req.body;

  if (!username || !squad || !magicAttribute || !strengths || !whyJoin || !whyAccept || !level) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO applications (username, squad, magic_attribute, strengths, why_join, why_accept, level) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(username, squad, magicAttribute, strengths, whyJoin, whyAccept, level);

    // Optional Webhook notification for new applications
    const embed = {
      title: `📥 New Magic Knight Application`,
      description: `**${username}** has applied to join the **${squad}** squad.`,
      fields: [
        { name: 'Magic Attribute', value: magicAttribute, inline: true },
        { name: 'In-Game Level', value: level, inline: true },
        { name: 'Strengths', value: strengths },
        { name: 'Why Join', value: whyJoin },
        { name: 'Why Accept', value: whyAccept }
      ],
      color: 0x3b82f6, // Blue
      timestamp: new Date().toISOString()
    };
    await sendDiscordWebhook(process.env.APPLICATIONS_WEBHOOK || process.env.EVENTS_WEBHOOK, embed); // Notify staff on applications channel

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/applications/:id/review', requireStaff, async (req, res) => {
  const { status } = req.body;
  const reviewer = req.session?.user?.username || 'Staff Member';

  if (!['approved', 'denied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid review status. Must be approved or denied' });
  }

  try {
    const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    db.prepare('UPDATE applications SET status = ?, reviewer = ? WHERE id = ?')
      .run(status, reviewer, req.params.id);

    // Webhook notification for application status change
    const embed = {
      title: `⚖️ Application ${status.toUpperCase()}`,
      description: `**${app.username}**'s application to join the **${app.squad}** squad was **${status}** by **${reviewer}**.`,
      color: status === 'approved' ? 0x10b981 : 0xff4757, // Green or Red
      timestamp: new Date().toISOString()
    };
    await sendDiscordWebhook(process.env.APPLICATIONS_WEBHOOK || process.env.EVENTS_WEBHOOK, embed);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* --- APPEALS --- */

router.get('/appeals', requireStaff, (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM appeals ORDER BY created_at DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/appeals', async (req, res) => {
  const { username, banReason, whyAppeal } = req.body;

  if (!username || !banReason || !whyAppeal) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO appeals (username, ban_reason, why_appeal) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, banReason, whyAppeal);

    // Send Discord log webhook
    const embed = {
      title: `📥 New Ban Appeal Submitted`,
      description: `**${username}** has submitted a ban appeal.`,
      fields: [
        { name: 'Ban Reason', value: banReason },
        { name: 'Appeal Argument', value: whyAppeal }
      ],
      color: 0xeab308, // Orange/Yellow
      timestamp: new Date().toISOString()
    };
    await sendDiscordWebhook(process.env.EVENTS_WEBHOOK, embed);

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/appeals/:id/review', requireStaff, async (req, res) => {
  const { status } = req.body;
  const reviewer = req.session?.user?.username || 'Staff Member';

  if (!['approved', 'denied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid review status' });
  }

  try {
    const appeal = db.prepare('SELECT * FROM appeals WHERE id = ?').get(req.params.id);
    if (!appeal) {
      return res.status(404).json({ error: 'Appeal not found' });
    }

    db.prepare('UPDATE appeals SET status = ?, reviewer = ? WHERE id = ?')
      .run(status, reviewer, req.params.id);

    // Send Discord log webhook
    const embed = {
      title: `⚖️ Ban Appeal ${status.toUpperCase()}`,
      description: `**${appeal.username}**'s ban appeal was **${status}** by **${reviewer}**.`,
      color: status === 'approved' ? 0x10b981 : 0xff4757, // Green or Red
      timestamp: new Date().toISOString()
    };
    await sendDiscordWebhook(process.env.EVENTS_WEBHOOK, embed);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
