import { v4 as uuidv4 } from 'uuid';

// Validation helper
function validateInput(data) {
  const { playerName, size, moves, time, algorithm, heuristic } = data;
  
  // Check required fields
  if (!playerName || size === undefined || moves === undefined || time === undefined) {
    return { valid: false, error: 'Missing required fields' };
  }
  
  // Validate playerName
  if (typeof playerName !== 'string' || playerName.trim().length === 0 || playerName.length > 50) {
    return { valid: false, error: 'Invalid player name (1-50 chars)' };
  }
  
  // Validate size
  if (![3, 4, 5].includes(parseInt(size))) {
    return { valid: false, error: 'Invalid puzzle size (must be 3, 4, or 5)' };
  }
  
  // Validate moves and time
  if (typeof moves !== 'number' || moves < 0 || moves > 10000) {
    return { valid: false, error: 'Invalid moves count' };
  }
  
  if (typeof time !== 'number' || time < 0 || time > 3600) {
    return { valid: false, error: 'Invalid time (max 1 hour)' };
  }
  
  // Validate algorithm and heuristic
  const validAlgos = ['manual', 'bfs', 'astar'];
  const validHeuristics = ['none', 'manhattan', 'misplaced', 'euclidean', 'combined'];
  
  if (algorithm && !validAlgos.includes(algorithm)) {
    return { valid: false, error: 'Invalid algorithm' };
  }
  
  if (heuristic && !validHeuristics.includes(heuristic)) {
    return { valid: false, error: 'Invalid heuristic' };
  }
  
  return { valid: true };
}

// In-memory storage (replace with database later)
let leaderboard = [];

// Add new leaderboard entry
export function addEntry(req, res) {
  try {
    const { playerName, size, moves, time, algorithm, heuristic } = req.body;

    // Validate input
    const validation = validateInput({ playerName, size, moves, time, algorithm, heuristic });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Check for duplicate submissions (same player, same size, same moves within 10 seconds)
    const recentDuplicate = leaderboard.find(entry => 
      entry.playerName === playerName &&
      entry.size === size &&
      entry.moves === moves &&
      (Date.now() - new Date(entry.timestamp).getTime()) < 10000
    );
    
    if (recentDuplicate) {
      return res.status(409).json({ error: 'Duplicate submission detected' });
    }

    // Calculate score
    const normalizedMoves = moves / 50;
    const normalizedTime = time / 300;
    const score = normalizedMoves * 0.6 + normalizedTime * 0.4;

    const entry = {
      id: uuidv4(),
      playerName: playerName.trim(),
      size: parseInt(size),
      moves: parseInt(moves),
      time: parseInt(time),
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
