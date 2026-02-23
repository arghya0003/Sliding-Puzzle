import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/landing.css';

const MODES = [
    {
        id: '8puzzle',
        size: 3,
        title: '8-Puzzle',
        label: '3 × 3',
        tiles: 8,
        tagline: 'The classic brain teaser',
        description: 'The legendary 8-tile challenge. Perfect for beginners and puzzle veterans alike.',
        color: 'violet',
        icon: '🧩',
        solverNote: 'Full A* solver',
        difficulties: [
            { label: 'Easy', moves: 20 },
            { label: 'Medium', moves: 50 },
            { label: 'Hard', moves: 120 },
        ],
    },
    {
        id: '15puzzle',
        size: 4,
        title: '15-Puzzle',
        label: '4 × 4',
        tiles: 15,
        tagline: 'Raise the stakes',
        description: '15 tiles, exponentially more permutations. Strategy and pattern recognition required.',
        color: 'cyan',
        icon: '⚡',
        solverNote: 'A* solver (may take a moment)',
        difficulties: [
            { label: 'Easy', moves: 30 },
            { label: 'Medium', moves: 80 },
            { label: 'Hard', moves: 200 },
        ],
    },
    {
        id: '24puzzle',
        size: 5,
        title: '24-Puzzle',
        label: '5 × 5',
        tiles: 24,
        tagline: 'For the fearless',
        description: '24 tiles. 15 trillion+ possible states. Only true puzzle masters attempt this.',
        color: 'amber',
        icon: '🔥',
        solverNote: 'Auto-solve disabled (too complex)',
        difficulties: [
            { label: 'Easy', moves: 50 },
            { label: 'Medium', moves: 150 },
            { label: 'Hard', moves: 350 },
        ],
    },
];

// Mini preview grid for each mode card
function MiniGrid({ size, color }) {
    const cells = Array.from({ length: size * size }, (_, i) => i + 1);
    // Place blank at bottom-right for preview
    cells[size * size - 1] = 0;
    return (
        <div
            className={`mini-grid mini-grid--${color}`}
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
            {cells.map((v, i) => (
                <div
                    key={i}
                    className={`mini-cell${v === 0 ? ' mini-cell--blank' : ''}`}
                >
                    {v !== 0 && <span>{v}</span>}
                </div>
            ))}
        </div>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();
    const [playerName, setPlayerName] = useState('');
    const [selectedDiff, setSelectedDiff] = useState({
        '8puzzle': MODES[0].difficulties[1],
        '15puzzle': MODES[1].difficulties[1],
        '24puzzle': MODES[2].difficulties[1],
    });

    useEffect(() => {
        // Load player name from localStorage
        const saved = localStorage.getItem('playerName');
        if (saved) setPlayerName(saved);
    }, []);

    function handlePlayerNameChange(e) {
        const name = e.target.value;
        setPlayerName(name);
        localStorage.setItem('playerName', name);
    }

    function handlePlay(mode) {
        const name = playerName.trim() || 'Anonymous Player';
        navigate('/game', {
            state: {
                size: mode.size,
                difficulty: selectedDiff[mode.id],
                modeName: mode.title,
                modeColor: mode.color,
                playerName: name,
            },
        });
    }

    return (
        <div className="landing-root">
            {/* Ambient Orbs */}
            <div className="bg-orb orb1" />
            <div className="bg-orb orb2" />
            <div className="bg-orb orb3" />

            <div className="landing-inner">
                {/* ── Player Info Bar ── */}
                <motion.div
                    className="player-info-bar"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="player-name-input-group">
                        <label htmlFor="playerName">👤 Player Name:</label>
                        <input
                            id="playerName"
                            type="text"
                            value={playerName}
                            onChange={handlePlayerNameChange}
                            placeholder="Enter your name..."
                            maxLength={20}
                            className="player-name-input"
                        />
                    </div>
                    <motion.button
                        className="leaderboard-btn"
                        onClick={() => navigate('/leaderboard')}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        🏆 Leaderboard
                    </motion.button>
                </motion.div>

                {/* ── Hero ── */}
                <motion.header
                    className="hero"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="hero-badge">
                        <span>🧠</span> Sliding Puzzle Challenge
                    </div>
                    <h1 className="hero-title">
                        Slide. <span className="accent-violet">Think.</span>{' '}
                        <span className="accent-cyan">Solve.</span>
                    </h1>
                    <p className="hero-sub">
                        A premium sliding puzzle experience with smooth animations, undo/redo,
                        and an <strong>A★ auto-solver</strong> with multiple algorithms and heuristics.
                        Choose your battleground below.
                    </p>
                </motion.header>

                {/* ── Mode Cards ── */}
                <section className="modes-grid">
                    {MODES.map((mode, idx) => (
                        <motion.div
                            key={mode.id}
                            className={`mode-card mode-card--${mode.color}`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + idx * 0.12, duration: 0.6, ease: 'easeOut' }}
                        >
                            {/* Card Header */}
                            <div className="card-header">
                                <div className="card-icon">{mode.icon}</div>
                                <div>
                                    <h2 className="card-title">{mode.title}</h2>
                                    <span className={`card-badge badge--${mode.color}`}>{mode.label}</span>
                                </div>
                            </div>

                            {/* Mini Grid Preview */}
                            <MiniGrid size={mode.size} color={mode.color} />

                            {/* Description */}
                            <p className="card-tagline">{mode.tagline}</p>
                            <p className="card-desc">{mode.description}</p>

                            {/* Solver Note */}
                            <div className="solver-note">
                                <span className="solver-icon">⚡</span>
                                <span>{mode.solverNote}</span>
                            </div>

                            {/* Difficulty Selector */}
                            <div className="diff-row">
                                {mode.difficulties.map((d) => (
                                    <button
                                        key={d.label}
                                        className={`diff-pill${selectedDiff[mode.id].label === d.label
                                                ? ` diff-pill--active diff-pill--${mode.color}`
                                                : ''
                                            }`}
                                        onClick={() =>
                                            setSelectedDiff((prev) => ({ ...prev, [mode.id]: d }))
                                        }
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>

                            {/* Play Button */}
                            <motion.button
                                className={`play-btn play-btn--${mode.color}`}
                                onClick={() => handlePlay(mode)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Play {mode.title}
                                <span className="play-arrow">→</span>
                            </motion.button>
                        </motion.div>
                    ))}
                </section>

                {/* ── Feature Row ── */}
                <motion.div
                    className="feature-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    {[
                        { icon: '↩️', label: 'Undo / Redo' },
                        { icon: '⚡', label: 'Multiple Algorithms' },
                        { icon: '🔊', label: 'Sound FX' },
                        { icon: '🏆', label: 'Leaderboard' },
                        { icon: '📈', label: 'Score System' },
                    ].map((f) => (
                        <div key={f.label} className="feature-chip">
                            <span>{f.icon}</span>
                            <span>{f.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
