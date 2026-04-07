import express from 'express';
import Match from '../models/Match.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// GET /api/matches — List matches (filter by user's team)
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.query.myMatches === 'true' && req.user.team) {
      filter = { $or: [{ teamA: req.user.team }, { teamB: req.user.team }] };
    }
    const matches = await Match.find(filter)
      .populate({ path: 'teamA', populate: { path: 'players', select: 'name' } })
      .populate({ path: 'teamB', populate: { path: 'players', select: 'name' } })
      .populate('winner', 'name')
      .sort('-date');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/matches/:id — Match details
router.get('/:id', auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate({ path: 'teamA', populate: { path: 'players', select: 'name email skillLevel' } })
      .populate({ path: 'teamB', populate: { path: 'players', select: 'name email skillLevel' } })
      .populate('winner', 'name');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/matches — Create match (admin)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { teamA, teamB, date, time, location } = req.body;
    const match = await Match.create({ teamA, teamB, date, time, location: location || 'HockeyHub Arena' });
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/matches/auto — Auto-generate matches from existing teams (admin)
router.post('/auto', auth, admin, async (req, res) => {
  try {
    const teams = await Team.find({ players: { $exists: true, $not: { $size: 0 } } });
    if (teams.length < 2) return res.status(400).json({ message: 'Need at least 2 teams with players' });

    // Shuffle teams
    const shuffled = teams.sort(() => Math.random() - 0.5);
    const pairCount = Math.floor(shuffled.length / 2);
    const matches = [];
    const locations = ['HockeyHub Arena', 'Frost Stadium', 'Ice Palace', 'Winter Dome'];

    for (let i = 0; i < pairCount; i++) {
      const matchDate = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000);
      const hours = [14, 16, 18, 20];
      const match = await Match.create({
        teamA: shuffled[i * 2]._id,
        teamB: shuffled[i * 2 + 1]._id,
        date: matchDate,
        time: `${hours[i % hours.length]}:00`,
        location: locations[i % locations.length],
      });
      matches.push(match);
    }

    res.status(201).json({ message: `${matches.length} matches created`, matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/matches/:id/score — Update score (admin)
router.put('/:id/score', auth, admin, async (req, res) => {
  try {
    const { scoreA, scoreB, status } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.scoreA = scoreA ?? match.scoreA;
    match.scoreB = scoreB ?? match.scoreB;
    match.status = status || match.status;

    if (match.status === 'completed') {
      if (match.scoreA > match.scoreB) {
        match.winner = match.teamA;
        await Team.findByIdAndUpdate(match.teamA, { $inc: { wins: 1 } });
        await Team.findByIdAndUpdate(match.teamB, { $inc: { losses: 1 } });
        // Update player stats
        const winTeam = await Team.findById(match.teamA);
        const loseTeam = await Team.findById(match.teamB);
        await User.updateMany({ _id: { $in: winTeam.players } }, { $inc: { wins: 1 } });
        await User.updateMany({ _id: { $in: loseTeam.players } }, { $inc: { losses: 1 } });
      } else if (match.scoreB > match.scoreA) {
        match.winner = match.teamB;
        await Team.findByIdAndUpdate(match.teamB, { $inc: { wins: 1 } });
        await Team.findByIdAndUpdate(match.teamA, { $inc: { losses: 1 } });
        const winTeam = await Team.findById(match.teamB);
        const loseTeam = await Team.findById(match.teamA);
        await User.updateMany({ _id: { $in: winTeam.players } }, { $inc: { wins: 1 } });
        await User.updateMany({ _id: { $in: loseTeam.players } }, { $inc: { losses: 1 } });
      }
    }

    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
