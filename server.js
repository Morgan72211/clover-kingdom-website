const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== MONGODB CONNECTION (with error handling) ==========
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    // Server keeps running — won't crash-loop on Render
  });

// ========== HEALTH CHECK (for UptimeRobot & Render) ==========
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected, 0 = disconnected
  if (dbState === 1) {
    res.status(200).json({ status: 'OK', db: 'connected' });
  } else {
    res.status(503).json({ status: 'Degraded', db: 'disconnected' });
  }
});

// ========== ROUTES ==========
// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working' });
});

// Serve your dashboard (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});