import { useEffect, useState } from 'react';

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function Stats({ moves, elapsed, isRunning }) {
    return (
        <div className="stats-bar">
            <div className="stat-card">
                <span className="stat-label">Moves</span>
                <span className="stat-value">{moves}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
                <span className="stat-label">Time</span>
                <span className="stat-value mono">{formatTime(elapsed)}</span>
            </div>
        </div>
    );
}
