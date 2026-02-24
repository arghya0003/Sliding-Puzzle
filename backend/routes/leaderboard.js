import express from 'express';
import {
  addEntry,
  getLeaderboard,
  getTopEntries,
  getStats
} from '../controllers/leaderboardController.js';

const router = express.Router();

// POST: Add new score
router.post('/', addEntry);

// GET: Fetch leaderboard (with optional filters)
router.get('/', getLeaderboard);

// GET: Fetch top entries
router.get('/top', getTopEntries);

// GET: Fetch statistics
router.get('/stats', getStats);

export default router;
