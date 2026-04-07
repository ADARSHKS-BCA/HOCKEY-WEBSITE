import express from 'express';
import Team from '../models/Team.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/teams — Create team
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.team) return res.status(400).json({ message: 'You are already on a team. Leave first.' });

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Team name is required' });

    let code;
    let exists = true;
    while (exists) {
      code = Team.generateCode();
      exists = await Team.findOne({ code });
    }

    const team = await Team.create({
      name,
      code,
      captain: req.user._id,
      players: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, { team: team._id, inQueue: false });
    await team.populate('players', 'name email skillLevel');
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/teams — List all teams
router.get('/', auth, async (req, res) => {
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

// GET /api/teams/:id — Team details
router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captain', 'name email')
      .populate('players', 'name email skillLevel phone');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/teams/join — Join by code
router.post('/join', auth, async (req, res) => {
  try {
    if (req.user.team) return res.status(400).json({ message: 'You are already on a team. Leave first.' });

    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Team code is required' });

    const team = await Team.findOne({ code: code.toUpperCase() });
    if (!team) return res.status(404).json({ message: 'Invalid team code' });
    if (team.players.length >= team.maxPlayers) return res.status(400).json({ message: 'Team is full' });
    if (team.players.includes(req.user._id)) return res.status(400).json({ message: 'Already on this team' });

    team.players.push(req.user._id);
    await team.save();
    await User.findByIdAndUpdate(req.user._id, { team: team._id, inQueue: false });

    await team.populate('players', 'name email skillLevel');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/teams/:id/leave — Leave team
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const playerIdx = team.players.indexOf(req.user._id);
    if (playerIdx === -1) return res.status(400).json({ message: 'Not on this team' });

    team.players.splice(playerIdx, 1);

    // If captain leaves, assign new captain or delete team
    if (team.captain.toString() === req.user._id.toString()) {
      if (team.players.length > 0) {
        team.captain = team.players[0];
      } else {
        await Team.findByIdAndDelete(team._id);
        await User.findByIdAndUpdate(req.user._id, { team: null });
        return res.json({ message: 'Team deleted (no players left)' });
      }
    }

    await team.save();
    await User.findByIdAndUpdate(req.user._id, { team: null });
    res.json({ message: 'Left team successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
