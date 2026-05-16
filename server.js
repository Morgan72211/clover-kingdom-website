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

const connectDB = require('./src/database/mongo');
connectDB();

app.use('/api/auth', require('./src/api/auth/login'));

const authMiddleware = require('./src/middleware/auth');
const permissions = require('./src/middleware/permissions');

const announcementsRouter = require('./src/api/announcements/index');
app.use('/api/announcements', announcementsRouter);

app.use('/api/events', require('./src/api/events/index'));

app.use('/api/appeals', require('./src/api/appeals/index'));

app.use('/api/ranks', authMiddleware, permissions('Wizard King'), require('./src/api/ranks/manage'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});