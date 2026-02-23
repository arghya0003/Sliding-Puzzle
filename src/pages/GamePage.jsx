import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Board from '../components/Board';
import VictoryModal from '../components/VictoryModal';
import {
    goalState, isGoal, moveTile, generateShuffled,
} from '../utils/puzzleLogic';
import { solvePuzzle, manhattanDistance, misplacedTiles } from '../utils/solver';
import { clickSound, victorySound } from '../utils/sounds';
import '../styles/game.css';

const SOLVE_INTERVAL_MS = { 3: 320, 4: 280, 5: 240 };

function formatTime(s) {
    return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

const DIFFICULTIES = {
    3: [{ label: 'Easy', moves: 20 }, { label: 'Medium', moves: 50 }, { label: 'Hard', moves: 120 }],
    4: [{ label: 'Easy', moves: 30 }, { label: 'Medium', moves: 80 }, { label: 'Hard', moves: 200 }],
    5: [{ label: 'Easy', moves: 50 }, { label: 'Medium', moves: 150 }, { label: 'Hard', moves: 350 }],
};

export default function GamePage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const size = state?.size ?? 3;
    const modeColor = state?.modeColor ?? 'violet';
    const modeName = state?.modeName ?? '8-Puzzle';
    const initDiff = state?.difficulty ?? DIFFICULTIES[size][1];

    const [difficulty, setDifficulty] = useState(initDiff);
    const [tiles, setTiles] = useState(() => goalState(size));
    const [history, setHistory] = useState(() => [goalState(size)]);
    const [future, setFuture] = useState([]);
    const [moves, setMoves] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const [won, setWon] = useState(false);
    const [isSolving, setIsSolving] = useState(false);
    const [solverStepsLeft, setSolverStepsLeft] = useState(0);
    const [solverMsg, setSolverMsg] = useState('');
    const solverRef = useRef(null);

    // Heuristic display (live)
    const md = manhattanDistance(tiles, size);
    const mt = misplacedTiles(tiles, size);

    // Timer
    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(id);
    }, [running]);

    const stopSolver = () => {
        if (solverRef.current) { clearInterval(solverRef.current); solverRef.current = null; }
        setIsSolving(false);
        setSolverStepsLeft(0);
    };

    const applyTiles = useCallback((next) => {
        setTiles(next);
        setHistory((h) => [...h, next]);
        setFuture([]);
        if (!running) setRunning(true);
        if (isGoal(next, size)) {
            setRunning(false);
            setWon(true);
            victorySound.play();
        }
    }, [running, size]);

    const handleTileClick = useCallback((idx) => {
        if (isSolving || won) return;
        const next = moveTile(tiles, idx, size);
        if (!next) return;
        clickSound.play();
        setMoves((m) => m + 1);
        applyTiles(next);
    }, [tiles, size, isSolving, won, applyTiles]);

    const resetAll = useCallback((newTiles, resetDiff) => {
        stopSolver();
        const goal = goalState(size);
        const t = newTiles ?? goal;
        setTiles(t);
        setHistory([t]);
        setFuture([]);
        setMoves(0);
        setElapsed(0);
        setRunning(false);
        setWon(false);
        setSolverMsg('');
        if (resetDiff) setDifficulty(resetDiff);
    }, [size]);

    const handleShuffle = useCallback(() => {
        const shuffled = generateShuffled(difficulty.moves, size);
        stopSolver();
        setTiles(shuffled);
        setHistory([shuffled]);
        setFuture([]);
        setMoves(0);
        setElapsed(0);
        setRunning(false);
        setWon(false);
        setSolverMsg('');
    }, [difficulty, size]);

    const handleUndo = useCallback(() => {
        if (history.length < 2) return;
        const prev = history[history.length - 2];
        const cur = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        setFuture((f) => [cur, ...f]);
        setTiles(prev);
        setMoves((m) => Math.max(0, m - 1));
    }, [history]);

    const handleRedo = useCallback(() => {
        if (!future.length) return;
        const next = future[0];
        setFuture((f) => f.slice(1));
        setHistory((h) => [...h, next]);
        setTiles(next);
        setMoves((m) => m + 1);
    }, [future]);

    const handleSolve = useCallback(() => {
        if (isSolving || size === 5) return;
        setSolverMsg('');
        const solution = solvePuzzle(tiles, size);
        if (!solution || solution.length <= 1) {
            setSolverMsg('No solution found within node limit.');
            return;
        }
        const steps = solution.slice(1);
        setSolverStepsLeft(steps.length);
        setIsSolving(true);
        if (!running) setRunning(true);

        let i = 0;
        solverRef.current = setInterval(() => {
            if (i >= steps.length) { stopSolver(); return; }
            const next = steps[i];
            clickSound.play();
            setTiles(next);
            setMoves((m) => m + 1);
            setSolverStepsLeft(steps.length - i - 1);
            i++;
            if (isGoal(next, size)) {
                stopSolver();
                setRunning(false);
                setWon(true);
                victorySound.play();
            }
        }, SOLVE_INTERVAL_MS[size] ?? 300);
    }, [tiles, size, isSolving, running]);

    const handlePlayAgain = useCallback(() => {
        const shuffled = generateShuffled(difficulty.moves, size);
        resetAll(shuffled);
    }, [difficulty, size, resetAll]);

    const diffList = DIFFICULTIES[size];

    return (
        <div className="game-root">
            <div className="bg-orb orb1" />
            <div className="bg-orb orb2" />

            <main className="game-wrap">
                {/* Top Bar */}
                <div className="topbar">
                    <motion.button
                        className="back-btn"
                        onClick={() => { stopSolver(); navigate('/'); }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        ← Back
                    </motion.button>
                    <div className="mode-label">
                        <span className={`mode-badge badge--${modeColor}`}>{modeName}</span>
                        <span className={`diff-badge badge--muted`}>{difficulty.label}</span>
                    </div>
                </div>

                {/* Stats Bar */}
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
                    <div className="stat-divider" />
                    <div className="stat-card" title="Manhattan Distance">
                        <span className="stat-label">MD</span>
                        <span className="stat-value hval" style={{ color: md === 0 ? '#10b981' : '#c4b5fd' }}>{md}</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-card" title="Misplaced Tiles">
                        <span className="stat-label">MT</span>
                        <span className="stat-value hval" style={{ color: mt === 0 ? '#10b981' : '#67e8f9' }}>{mt}</span>
                    </div>
                </div>

                {/* Board */}
                <Board
                    tiles={tiles}
                    size={size}
                    onTileClick={handleTileClick}
                    isSolving={isSolving}
                />

                {/* Difficulty Row */}
                <div className="diff-group">
                    {diffList.map((d) => (
                        <button
                            key={d.label}
                            className={`diff-btn${difficulty.label === d.label ? ' active' : ''}`}
                            onClick={() => setDifficulty(d)}
                            disabled={isSolving}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="action-group">
                    <motion.button className="action-btn shuffle-btn" onClick={handleShuffle} disabled={isSolving} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        🔀 Shuffle
                    </motion.button>
                    <motion.button className="action-btn reset-btn" onClick={() => resetAll()} disabled={isSolving} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        ↺ Reset
                    </motion.button>
                </div>

                <div className="action-group">
                    <motion.button className="action-btn undo-btn" onClick={handleUndo} disabled={history.length < 2 || isSolving} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        ⟵ Undo
                    </motion.button>
                    <motion.button className="action-btn redo-btn" onClick={handleRedo} disabled={!future.length || isSolving} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        Redo ⟶
                    </motion.button>
                </div>

                {/* Auto Solve */}
                {size < 5 ? (
                    <motion.button
                        className={`action-btn solve-btn${isSolving ? ' solving-active' : ''}`}
                        onClick={handleSolve}
                        disabled={isSolving}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        {isSolving ? `⚡ Solving… (${solverStepsLeft} steps left)` : '⚡ Auto Solve (A*)'}
                    </motion.button>
                ) : (
                    <div className="solve-disabled">
                        🔒 Auto-Solve disabled for 5×5 (computationally infeasible)
                    </div>
                )}

                {solverMsg && <p className="solver-msg">{solverMsg}</p>}

                {/* Heuristic Legend */}
                <div className="heuristic-legend">
                    <span>📐 <strong>MD</strong> = Manhattan Distance</span>
                    <span>·</span>
                    <span>📍 <strong>MT</strong> = Misplaced Tiles</span>
                </div>
            </main>

            <VictoryModal
                show={won}
                moves={moves}
                elapsed={elapsed}
                onPlayAgain={handlePlayAgain}
                onReset={() => resetAll()}
            />
        </div>
    );
}
