import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { runMatchmaking } from '../services/matchmaker.js';

const router = express.Router();

// POST /api/matchmaking/queue — Join solo queue
router.post('/queue', auth, async (req, res) => {
  try {
    if (req.user.team) return res.status(400).json({ message: 'Leave your current team first to join solo queue' });
    if (req.user.inQueue) return res.status(400).json({ message: 'Already in queue' });

    await User.findByIdAndUpdate(req.user._id, { inQueue: true });
    const queueCount = await User.countDocuments({ inQueue: true });
    res.json({ message: 'Joined matchmaking queue', queuePosition: queueCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/matchmaking/queue — Leave queue
router.delete('/queue', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { inQueue: false });
    res.json({ message: 'Left matchmaking queue' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/matchmaking/status — Queue status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const queueCount = await User.countDocuments({ inQueue: true });
    res.json({
      inQueue: user.inQueue,
      queueCount,
      minRequired: 10,
      ready: queueCount >= 10,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/matchmaking/run — Trigger matchmaking (admin)
router.post('/run', auth, admin, async (req, res) => {
  try {
    const teamSize = req.body.teamSize || 5;
    const result = await runMatchmaking(teamSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
