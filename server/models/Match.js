import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  teamA: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true, default: 'HockeyHub Arena' },
  status: { type: String, enum: ['upcoming', 'in_progress', 'completed'], default: 'upcoming' },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  notified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);
