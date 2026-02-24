/**
 * Leaderboard utility - API-based backend integration
 */

// Support environment variables for deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
 *   timestamp: string - ISO timestamp when entry was created
 *   score: number - calculated score (lower is better)
 * }
 */

/**
 * Get all leaderboard entries from backend
 */
export async function getLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

/**
 * Add a new entry to the leaderboard
 */
export async function addLeaderboardEntry(playerName, size, moves, time, algorithm, heuristic) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName,
                size,
                moves,
                time,
                algorithm,
                heuristic
            })
        });

        if (!response.ok) throw new Error('Failed to add leaderboard entry');
        const entry = await response.json();
        console.log('✅ Score submitted:', entry);
        return entry;
    } catch (error) {
        console.error('Error adding leaderboard entry:', error);
        throw error;
    }
}

/**
 * Get leaderboard entries filtered by puzzle size
 */
export async function getLeaderboardBySize(size) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard?size=${size}`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard by size:', error);
        return [];
    }
}

/**
 * Get top N entries overall
 */
export async function getTopEntries(n = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard/top?limit=${n}`);
        if (!response.ok) throw new Error('Failed to fetch top entries');
        return await response.json();
    } catch (error) {
        console.error('Error fetching top entries:', error);
        return [];
    }
}

/**
 * Get top N entries for a specific puzzle size
 */
export async function getTopEntriesBySize(size, n = 10) {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard/top?size=${size}&limit=${n}`);
        if (!response.ok) throw new Error('Failed to fetch top entries');
        return await response.json();
    } catch (error) {
        console.error('Error fetching top entries by size:', error);
        return [];
    }
}

/**
 * Get leaderboard statistics
 */
export async function getLeaderboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

/**
 * Clear all leaderboard entries (admin function)
 */
export async function clearLeaderboard() {
    console.warn('⚠️ clearLeaderboard() requires backend implementation');
    return false;
}
