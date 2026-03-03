import { useState, useEffect, useRef } from 'react';
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

// Inline logo SVG for navbar (not the fixed Logo component)
function NavLogo() {
    return (
        <div className="nav-logo">
            <svg className="nav-logo-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="44" height="44" rx="10" fill="#1e1145" />
                <rect x="6" y="6" width="14" height="14" rx="3" fill="#5b3daf" />
                <rect x="23" y="6" width="14" height="14" rx="3" fill="#4c3199" />
                <rect x="6" y="23" width="14" height="14" rx="3" fill="#8b5cf6" />
                <rect x="23" y="23" width="14" height="14" rx="3" fill="#2d1a6b" />
            </svg>
            <span className="nav-logo-text">Slidix</span>
        </div>
    );
}

// Hero puzzle preview card with seamless solving animation
function PuzzlePreview() {
    const ADJACENTS = [
        [1, 3], [0, 2, 4], [1, 5],
        [0, 4, 6], [1, 3, 5, 7], [2, 4, 8],
        [3, 7], [4, 6, 8], [5, 7],
    ];

    const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    const [timer, setTimer] = useState(0);
    const lastBlankRef = useRef(-1);
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, y: 0 });
    const rafRef = useRef(null);

    useEffect(() => {
        const id = setInterval(() => {
            setTiles((prev) => {
                const blank = prev.indexOf(0);
                let neighbors = ADJACENTS[blank].filter((n) => n !== lastBlankRef.current);
                if (neighbors.length === 0) neighbors = ADJACENTS[blank];
                const target = neighbors[Math.floor(Math.random() * neighbors.length)];
                lastBlankRef.current = blank;
                const next = [...prev];
                [next[blank], next[target]] = [next[target], next[blank]];
                return next;
            });
            setTimer((t) => +(t + 0.73).toFixed(2));
        }, 900);
        return () => clearInterval(id);
    }, []);

    function handleMouseMove(e) {
        if (!cardRef.current) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const rect = cardRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;   // 0 → 1
            const y = (e.clientY - rect.top) / rect.height;    // 0 → 1
            const rotateY = (x - 0.5) * 24;   // -12° to +12°
            const rotateX = (0.5 - y) * 18;  // -9° to +9°
            setTilt({ rotateX, rotateY, y: -16 });
        });
    }

    function handleMouseLeave() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setTilt({ rotateX: 0, rotateY: 0, y: 0 });
    }

    return (
        <div
            className="preview-card-perspective"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="preview-card"
                style={{
                    transform: `translateY(${tilt.y}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                }}>
                <div className="preview-header">
                    <div>
                        <div className="preview-level">Current Level</div>
                        <div className="preview-sublevel">Master Chamber #42</div>
                    </div>
                    <div className="preview-timer">
                        <span className="timer-label">TIME</span>
                        <span className="timer-value">{`00:${timer.toFixed(2).padStart(5, '0')}`}</span>
                    </div>
                </div>
                <div className="preview-grid">
                    {tiles.map((v) =>
                        v !== 0 ? (
                            <motion.div
                                key={v}
                                layout
                                transition={{
                                    type: 'spring',
                                    stiffness: 350,
                                    damping: 26,
                                    mass: 0.8,
                                }}
                                className="preview-tile"
                            >
                                <span>{v}</span>
                            </motion.div>
                        ) : (
                            <div key="blank" className="preview-tile preview-tile--blank" />
                        )
                    )}
                </div>
                <div className="preview-footer">
                    <div className="preview-live">
                        <span className="live-dot" />
                        Live Solvers: 142
                    </div>
                    <div className="preview-stars">★★★☆☆</div>
                </div>
            </div>
        </div>
    );
}

// Mini preview grid for each mode card
function MiniGrid({ size, color }) {
    const cells = Array.from({ length: size * size }, (_, i) => i + 1);
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
    const modesRef = useRef(null);
    const [playerName, setPlayerName] = useState('');
    const [selectedDiff, setSelectedDiff] = useState({
        '8puzzle': MODES[0].difficulties[1],
        '15puzzle': MODES[1].difficulties[1],
        '24puzzle': MODES[2].difficulties[1],
    });

    useEffect(() => {
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

    function scrollToModes() {
        modesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return (
        <div className="landing-root">
            {/* Ambient Orbs */}
            <div className="bg-orb orb1" />
            <div className="bg-orb orb2" />
            <div className="bg-orb orb3" />

            {/* ── Navbar ── */}
            <motion.nav
                className="landing-navbar"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <NavLogo />
                <div className="nav-links">
                    <button className="nav-link" onClick={scrollToModes}>Modes</button>
                    <button className="nav-link" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
                    <motion.button
                        className="nav-play-btn"
                        onClick={scrollToModes}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        Play Now
                    </motion.button>
                </div>
            </motion.nav>

            <div className="landing-inner">
                {/* ── Hero Split ── */}
                <section className="hero-split">
                    <motion.div
                        className="hero-left"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <div className="hero-badge">
                            <span>⚡</span> SLIDING PUZZLE CHALLENGE
                        </div>
                        <h1 className="hero-title">
                            Master the <span className="accent-violet">Art</span> of the Slide
                        </h1>
                        <p className="hero-sub">
                            Challenge your brain with Slidix. A modern, minimalist take on the
                            classic sliding puzzle. Multiple modes, <strong>A★ auto-solver</strong>,
                            and global competition.
                        </p>
                        <div className="hero-actions">
                            <motion.button
                                className="cta-primary"
                                onClick={scrollToModes}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                Start Playing Free
                            </motion.button>
                            <motion.button
                                className="cta-outline"
                                onClick={() => navigate('/leaderboard')}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                View Leaderboard
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-right"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                    >
                        <PuzzlePreview />
                    </motion.div>
                </section>

                {/* ── Player Name + Modes Section ── */}
                <section className="modes-section" ref={modesRef}>
                    <div className="section-header">
                        <h2 className="section-title">Choose Your Battleground</h2>
                        <div className="player-name-group">
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
                    </div>

                    <div className="modes-grid">
                        {MODES.map((mode, idx) => (
                            <motion.div
                                key={mode.id}
                                className={`mode-card mode-card--${mode.color}`}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.15, ease: 'easeOut' } }}
                                transition={{ delay: 0.15 + idx * 0.12, duration: 0.6, ease: 'easeOut' }}
                            >
                                <div className="card-header">
                                    <div className="card-icon">{mode.icon}</div>
                                    <div>
                                        <h2 className="card-title">{mode.title}</h2>
                                        <span className={`card-badge badge--${mode.color}`}>{mode.label}</span>
                                    </div>
                                </div>
                                <MiniGrid size={mode.size} color={mode.color} />
                                <p className="card-tagline">{mode.tagline}</p>
                                <p className="card-desc">{mode.description}</p>
                                <div className="solver-note">
                                    <span className="solver-icon">⚡</span>
                                    <span>{mode.solverNote}</span>
                                </div>
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
                    </div>
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
