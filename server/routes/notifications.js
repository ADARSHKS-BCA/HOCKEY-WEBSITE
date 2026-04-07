import express from 'express';
import Match from '../models/Match.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { sendMatchNotification } from '../services/emailService.js';

const router = express.Router();

// POST /api/notifications/match/:id — Send email notifications for a match
router.post('/match/:id', auth, admin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({ path: 'teamA', populate: { path: 'players', select: 'name email' } })
      .populate({ path: 'teamB', populate: { path: 'players', select: 'name email' } });

    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (match.notified) return res.status(400).json({ message: 'Notifications already sent' });

    const dateStr = new Date(match.date).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const results = [];

    // Notify team A
    for (const player of match.teamA.players) {
      const r = await sendMatchNotification(player.email, {
        teamName: match.teamA.name,
        opponentName: match.teamB.name,
        date: dateStr,
        time: match.time,
        location: match.location,
      });
      results.push({ player: player.name, ...r });
    }

    // Notify team B
    for (const player of match.teamB.players) {
      const r = await sendMatchNotification(player.email, {
        teamName: match.teamB.name,
        opponentName: match.teamA.name,
        date: dateStr,
        time: match.time,
        location: match.location,
      });
      results.push({ player: player.name, ...r });
    }

    match.notified = true;
    await match.save();

    res.json({ message: 'Notifications sent', results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
