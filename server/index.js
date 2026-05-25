import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import teamRoutes from './routes/teams.js';
import matchRoutes from './routes/matches.js';
import matchmakingRoutes from './routes/matchmaking.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import leaderboardRoutes from './routes/leaderboard.js';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS Configuration ────────────────────────────────────────
// FRONTEND_URL can be a single URL or comma-separated list
// e.g. "https://hockey-website.vercel.app,https://www.hockeyhub.com"
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, health checks)
    if (!origin) return callback(null, true);
    // Allow if origin is in the allowed list
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/contact', contactRoutes);

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── 404 Catch-all for unknown API routes ───────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ─── Start Server ───────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏒 HockeyHub server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Allowed origins: ${allowedOrigins.length ? allowedOrigins.join(', ') : 'ALL (dev mode)'}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// ─── Graceful Shutdown ──────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

