/**
 * Leaderboard utility for storing and retrieving player scores
 */

const LEADERBOARD_KEY = 'puzzleLeaderboard';
const MAX_ENTRIES = 100;

/**
 * Leaderboard entry structure:
 * {
 *   id: string - unique identifier
 *   playerName: string - player's name
 *   size: number - puzzle size (3, 4, 5)
 *   moves: number - number of moves to solve
 *   time: number - time taken in seconds
 *   algorithm: string - 'bfs' or 'astar'
 *   heuristic: string - 'manhattan', 'misplaced', 'euclidean', 'combined'
 *   timestamp: number - when the entry was created
 *   score: number - calculated score (lower is better)
 * }
 */

/**
 * Calculate score: weighted combination of moves and time
 * Lower score is better
 */
function calculateScore(moves, time, moves_weight = 0.6, time_weight = 0.4) {
    // Normalize: assume reasonable puzzle completion is 50 moves, 300 seconds
    const normalizedMoves = moves / 50;
    const normalizedTime = time / 300;
    return normalizedMoves * moves_weight + normalizedTime * time_weight;
}

/**
 * Get all leaderboard entries from localStorage
 */
export function getLeaderboard() {
    try {
        const data = localStorage.getItem(LEADERBOARD_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading leaderboard:', error);
        return [];
    }
}

/**
 * Add a new entry to the leaderboard
 */
export function addLeaderboardEntry(playerName, size, moves, time, algorithm, heuristic) {
    const entries = getLeaderboard();
    const newEntry = {
        id: `${Date.now()}-${Math.random()}`,
        playerName,
        size,
        moves,
        time,
        algorithm,
        heuristic,
        timestamp: Date.now(),
        score: calculateScore(moves, time),
    };

    entries.push(newEntry);

    // Sort by score (lower is better)
    entries.sort((a, b) => a.score - b.score);

    // Keep only top MAX_ENTRIES
    const limited = entries.slice(0, MAX_ENTRIES);

    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(limited));
        return newEntry;
    } catch (error) {
        console.error('Error saving to leaderboard:', error);
        return newEntry;
    }
}

/**
 * Get leaderboard entries filtered by puzzle size
 */
export function getLeaderboardBySize(size) {
    const entries = getLeaderboard();
    return entries.filter(e => e.size === size);
}

/**
 * Clear all leaderboard entries
 */
export function clearLeaderboard() {
    try {
        localStorage.removeItem(LEADERBOARD_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing leaderboard:', error);
        return false;
    }
}

/**
 * Get top N entries overall
 */
export function getTopEntries(n = 10) {
    const entries = getLeaderboard();
    return entries.slice(0, n);
}

/**
 * Get top N entries for a specific puzzle size
 */
export function getTopEntriesBySize(size, n = 10) {
    const entries = getLeaderboardBySize(size);
    return entries.slice(0, n);
}
