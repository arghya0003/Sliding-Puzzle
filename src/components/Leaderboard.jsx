import { useState, useEffect } from 'react';
import { getLeaderboard, getLeaderboardBySize, clearLeaderboard } from '../utils/leaderboard';
import '../styles/leaderboard.css';

export default function Leaderboard({ showBySize = null }) {
    const [entries, setEntries] = useState([]);
    const [sortBy, setSortBy] = useState('score'); // 'score', 'moves', 'time', 'date'
    const [filterSize, setFilterSize] = useState(showBySize || 'all');

    useEffect(() => {
        refreshLeaderboard();
    }, [filterSize]);

    const refreshLeaderboard = async () => {
        try {
            const data = filterSize === 'all' 
                ? await getLeaderboard() 
                : await getLeaderboardBySize(parseInt(filterSize));
            sortData(data, sortBy);
            setEntries(data);
        } catch (error) {
            console.error('Failed to refresh leaderboard:', error);
            setEntries([]);
        }
    };

    const sortData = (data, sortType) => {
        const sorted = [...data];
        switch (sortType) {
            case 'score':
                sorted.sort((a, b) => a.score - b.score);
                break;
            case 'moves':
                sorted.sort((a, b) => a.moves - b.moves);
                break;
            case 'time':
                sorted.sort((a, b) => a.time - b.time);
                break;
            case 'date':
                sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            default:
                sorted.sort((a, b) => a.score - b.score);
        }
        setEntries(sorted);
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        sortData(entries, newSort);
    };

    const handleClearLeaderboard = async () => {
        if (window.confirm('Are you sure you want to clear the entire leaderboard? This cannot be undone.')) {
            try {
                await clearLeaderboard();
                await refreshLeaderboard();
            } catch (error) {
                console.error('Failed to clear leaderboard:', error);
            }
        }
    };

    const formatTime = (seconds) => {
        return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    };

    const getPuzzleLabel = (size) => {
        const labels = { 3: '8-Puzzle', 4: '15-Puzzle', 5: '24-Puzzle' };
        return labels[size] || `${size}x${size}`;
    };

    const getAlgoLabel = (algo, heuristic) => {
        if (algo === 'bfs') return 'BFS';
        if (algo === 'astar') {
            const hLabels = {
                'manhattan': 'A* (Manhattan)',
                'misplaced': 'A* (Misplaced)',
                'euclidean': 'A* (Euclidean)',
                'combined': 'A* (Combined)',
            };
            return hLabels[heuristic] || 'A*';
        }
        return algo;
    };

    return (
        <div className="leaderboard-container">
            <h2>🏆 Leaderboard</h2>

            <div className="leaderboard-controls">
                {!showBySize && (
                    <div className="filter-group">
                        <label>Filter by Puzzle:</label>
                        <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)}>
                            <option value="all">All Puzzles</option>
                            <option value="3">8-Puzzle (3x3)</option>
                            <option value="4">15-Puzzle (4x4)</option>
                            <option value="5">24-Puzzle (5x5)</option>
                        </select>
                    </div>
                )}

                <div className="sort-group">
                    <label>Sort by:</label>
                    <button
                        className={`sort-btn ${sortBy === 'score' ? 'active' : ''}`}
                        onClick={() => handleSortChange('score')}
                    >
                        Score
                    </button>
                    <button
                        className={`sort-btn ${sortBy === 'moves' ? 'active' : ''}`}
                        onClick={() => handleSortChange('moves')}
                    >
                        Moves
                    </button>
                    <button
                        className={`sort-btn ${sortBy === 'time' ? 'active' : ''}`}
                        onClick={() => handleSortChange('time')}
                    >
                        Time
                    </button>
                    <button
                        className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                        onClick={() => handleSortChange('date')}
                    >
                        Recent
                    </button>
                </div>

                {!showBySize && (
                    <button className="clear-btn" onClick={handleClearLeaderboard}>
                        🗑️ Clear All
                    </button>
                )}
            </div>

            {entries.length === 0 ? (
                <div className="empty-leaderboard">
                    <p>📊 No entries yet. Win a game to appear on the leaderboard!</p>
                </div>
            ) : (
                <div className="leaderboard-table">
                    <div className="leaderboard-header">
                        <div className="rank">Rank</div>
                        <div className="name">Player</div>
                        <div className="puzzle">Puzzle</div>
                        <div className="algorithm">Algorithm</div>
                        <div className="moves">Moves</div>
                        <div className="time">Time</div>
                        <div className="score">Score</div>
                    </div>
                    <div className="leaderboard-rows">
                        {entries.map((entry, idx) => (
                            <div key={entry.id} className={`leaderboard-row rank-${Math.min(idx, 2)}`}>
                                <div className="rank">#{idx + 1}</div>
                                <div className="name">{entry.playerName}</div>
                                <div className="puzzle">{getPuzzleLabel(entry.size)}</div>
                                <div className="algorithm">{getAlgoLabel(entry.algorithm, entry.heuristic)}</div>
                                <div className="moves">{entry.moves}</div>
                                <div className="time">{formatTime(entry.time)}</div>
                                <div className="score">{entry.score.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
