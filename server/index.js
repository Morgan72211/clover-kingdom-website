import express from 'express';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.js';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(cookieSession({
  name: 'clover_session',
  keys: [process.env.SESSION_SECRET || 'magic_emperor_secret_phrase'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: false, // Set to true if running behind HTTPS in production
  httpOnly: true
}));

// Register Routes
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// Serve production static assets if built
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback to index.html for SPA client-side routing in production
app.get(/^(?!\/api|\/auth).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🍀 Clover Kingdom Portal Backend listening on port ${PORT}`);
  console.log(`👉 Environment Mode: ${process.env.DEV_MODE === 'true' ? 'DEV_BYPASS' : 'STRICT_OAUTH'}`);
});
