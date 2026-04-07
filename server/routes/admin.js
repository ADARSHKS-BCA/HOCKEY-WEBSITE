import express from 'express';
import User from '../models/User.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// GET /api/admin/players — All players
router.get('/players', auth, admin, async (req, res) => {
  try {
    const players = await User.find().populate('team', 'name code').sort('-createdAt');
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/teams — All teams
router.get('/teams', auth, admin, async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('captain', 'name email')
      .populate('players', 'name email skillLevel')
      .sort('-createdAt');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/teams/:id — Edit team
router.put('/teams/:id', auth, admin, async (req, res) => {
  try {
    const { name, maxPlayers } = req.body;
    const team = await Team.findByIdAndUpdate(req.params.id, { name, maxPlayers }, { new: true })
      .populate('players', 'name email skillLevel');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/teams/:id — Delete team
router.delete('/teams/:id', auth, admin, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    await User.updateMany({ _id: { $in: team.players } }, { team: null });
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/stats — Dashboard stats
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const [totalPlayers, totalTeams, totalMatches, queuedPlayers] = await Promise.all([
      User.countDocuments({ role: 'player' }),
      Team.countDocuments(),
      Match.countDocuments(),
      User.countDocuments({ inQueue: true }),
    ]);
    res.json({ totalPlayers, totalTeams, totalMatches, queuedPlayers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
