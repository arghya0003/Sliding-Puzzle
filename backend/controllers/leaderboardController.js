import prisma from '../config/prisma.js';

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

// In-memory storage (replaced with Prisma database)
// No longer needed - using PostgreSQL with Prisma

// Add new leaderboard entry
export async function addEntry(req, res) {
  try {
    const { playerName, size, moves, time, algorithm, heuristic } = req.body;

    // Validate input
    const validation = validateInput({ playerName, size, moves, time, algorithm, heuristic });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Check for duplicate submissions in database (same player, same size, same moves within 10 seconds)
    const recentDuplicate = await prisma.leaderboardEntry.findFirst({
      where: {
        playerName: playerName.trim(),
        size: parseInt(size),
        moves: parseInt(moves),
        timestamp: {
          gte: new Date(Date.now() - 10000) // Last 10 seconds
        }
      }
    });
    
    if (recentDuplicate) {
      return res.status(409).json({ error: 'Duplicate submission detected' });
    }

    // Calculate score
    const normalizedMoves = moves / 50;
    const normalizedTime = time / 300;
    const score = normalizedMoves * 0.6 + normalizedTime * 0.4;

    // Create entry in database
    const entry = await prisma.leaderboardEntry.create({
      data: {
        playerName: playerName.trim(),
        size: parseInt(size),
        moves: parseInt(moves),
        time: parseInt(time),
        algorithm: algorithm || 'manual',
        heuristic: heuristic || 'none',
        score: parseFloat(score.toFixed(4))
      }
    });

    console.log(`✅ New entry: ${playerName} - Score: ${score.toFixed(2)}`);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
}

// Get all leaderboard entries
export async function getLeaderboard(req, res) {
  try {
    const { size, algorithm, limit = 100 } = req.query;
    
    const where = {};
    if (size) where.size = parseInt(size);
    if (algorithm) where.algorithm = algorithm;

    const entries = await prisma.leaderboardEntry.findMany({
      where,
      orderBy: { score: 'asc' },
      take: parseInt(limit)
    });

    res.json(entries);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}

// Get top entries by size
export async function getTopEntries(req, res) {
  try {
    const { size = 3, limit = 10 } = req.query;
    
    const entries = await prisma.leaderboardEntry.findMany({
      where: { size: parseInt(size) },
      orderBy: { score: 'asc' },
      take: parseInt(limit)
    });

    res.json(entries);
  } catch (error) {
    console.error('Error fetching top entries:', error);
    res.status(500).json({ error: 'Failed to fetch top entries' });
  }
}

// Get statistics
export async function getStats(req, res) {
  try {
    const totalEntries = await prisma.leaderboardEntry.count();
    
    // Get average score
    const avgResult = await prisma.leaderboardEntry.aggregate({
      _avg: { score: true }
    });
    const averageScore = avgResult._avg.score ? avgResult._avg.score.toFixed(2) : 0;

    // Get stats for each size
    const sizeStats = {};
    for (const size of [3, 4, 5]) {
      const count = await prisma.leaderboardEntry.count({ where: { size } });
      
      const bestEntry = await prisma.leaderboardEntry.findFirst({
        where: { size },
        orderBy: { score: 'asc' }
      });

      sizeStats[size] = {
        count,
        bestScore: bestEntry ? bestEntry.score.toFixed(2) : 0
      };
    }

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
