require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src/dashboard', express.static(path.join(__dirname, 'src/dashboard')));

// ========== MONGODB CONNECTION (with crash-loop fix) ==========
const connectDB = require('./src/database/mongo');

// Wrap connection so Render doesn't crash-loop on auth failure
connectDB().catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('⚠️ Server running without database — check your MONGODB_URI in Render Environment variables');
  // DON'T exit — server stays alive for /health checks and retry logic
});

// ========== HEALTH CHECK (for UptimeRobot & Render) ==========
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 1 = connected, 0 = disconnected, 2 = connecting, 3 = disconnecting
  if (dbState === 1) {
    res.status(200).json({ status: 'OK', db: 'connected' });
  } else {
    res.status(503).json({ status: 'Degraded', db: 'disconnected', message: 'MongoDB not connected' });
  }
});

// Public routes
app.use('/api/announcements', require('./src/api/announcements'));
app.use('/api/events', require('./src/api/events'));
app.use('/api/appeals', require('./src/api/appeals'));

// Auth
app.use('/api/auth', require('./src/api/auth/login'));

// Protected routes
const auth = require('./src/middleware/auth');
const perms = require('./src/middleware/permissions');

// Announcements POST (protected) - mounted after public GET
app.post('/api/announcements', auth, perms('Vice Captain'), require('./src/api/announcements'));
app.post('/api/events', auth, perms('Vice Captain'), require('./src/api/events'));
app.put('/api/events/:id', auth, perms('Vice Captain'), require('./src/api/events'));
app.get('/api/appeals', auth, perms('Captain'), require('./src/api/appeals'));
app.put('/api/appeals/:id', auth, perms('Captain'), require('./src/api/appeals'));
app.get('/api/staff/all', auth, perms('Sovereign'), require('./src/api/staff/all'));
app.use('/api/ranks', auth, perms('Wizard King'), require('./src/api/ranks/manage'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));