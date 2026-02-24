import { v4 as uuidv4 } from 'uuid';

// In-memory storage (replace with database later)
let leaderboard = [];

// Add new leaderboard entry
export function addEntry(req, res) {
  try {
    const { playerName, size, moves, time, algorithm, heuristic } = req.body;

    // Validate input
    if (!playerName || !size || moves === undefined || time === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate score
    const normalizedMoves = moves / 50;
    const normalizedTime = time / 300;
    const score = normalizedMoves * 0.6 + normalizedTime * 0.4;

    const entry = {
      id: uuidv4(),
      playerName,
      size,
      moves,
      time,
      algorithm: algorithm || 'manual',
      heuristic: heuristic || 'none',
      score,
      timestamp: new Date().toISOString()
    };

    leaderboard.push(entry);
    leaderboard.sort((a, b) => a.score - b.score);
    leaderboard = leaderboard.slice(0, 100); // Keep top 100

    console.log(`✅ New entry: ${playerName} - Score: ${score.toFixed(2)}`);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
}

// Get all leaderboard entries
export function getLeaderboard(req, res) {
  try {
    const { size, algorithm } = req.query;
    
    let filtered = leaderboard;

    if (size) {
      filtered = filtered.filter(entry => entry.size === parseInt(size));
    }

    if (algorithm) {
      filtered = filtered.filter(entry => entry.algorithm === algorithm);
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

// Get top entries by size
export function getTopEntries(req, res) {
  try {
    const { size = 3, limit = 10 } = req.query;
    const filtered = leaderboard
      .filter(entry => entry.size === parseInt(size))
      .slice(0, parseInt(limit));

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching top entries:', error);
    res.status(500).json({ error: 'Failed to fetch top entries' });
  }
}

// Get statistics
export function getStats(req, res) {
  try {
    const totalEntries = leaderboard.length;
    const averageScore = leaderboard.length > 0
      ? (leaderboard.reduce((sum, entry) => sum + entry.score, 0) / totalEntries).toFixed(2)
      : 0;

    const sizeStats = {};
    [3, 4, 5].forEach(size => {
      const entries = leaderboard.filter(entry => entry.size === size);
      sizeStats[size] = {
        count: entries.length,
        bestScore: entries.length > 0 ? entries[0].score.toFixed(2) : 0
      };
    });

    res.json({
      totalEntries,
      averageScore,
      sizeStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
