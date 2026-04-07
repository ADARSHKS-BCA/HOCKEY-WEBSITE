import express from 'express';
import User from '../models/User.js';
import Team from '../models/Team.js';

const router = express.Router();

// GET /api/leaderboard — Player and team rankings
router.get('/', async (req, res) => {
  try {
    const topPlayers = await User.find({ role: 'player' })
      .select('name skillLevel wins losses team')
      .populate('team', 'name')
      .sort('-wins')
      .limit(20);

    const topTeams = await Team.find()
      .select('name wins losses players')
      .sort('-wins')
      .limit(10);

    res.json({ topPlayers, topTeams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
