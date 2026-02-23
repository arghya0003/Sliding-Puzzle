import { motion } from 'framer-motion';

const DIFFICULTIES = [
    { label: 'Easy', moves: 20 },
    { label: 'Medium', moves: 50 },
    { label: 'Hard', moves: 120 },
];

export default function Controls({
    difficulty,
    onDifficultyChange,
    onShuffle,
    onReset,
    onUndo,
    onRedo,
    onSolve,
    canUndo,
    canRedo,
    isSolving,
    solverStepsLeft,
}) {
    return (
        <div className="controls-panel">
            {/* Difficulty Selector */}
            <div className="difficulty-group">
                {DIFFICULTIES.map((d) => (
                    <button
                        key={d.label}
                        className={`diff-btn ${difficulty.label === d.label ? 'active' : ''}`}
                        onClick={() => onDifficultyChange(d)}
                    >
                        {d.label}
                    </button>
                ))}
            </div>

            {/* Main Action Buttons */}
            <div className="action-group">
                <motion.button
                    className="action-btn shuffle-btn"
                    onClick={onShuffle}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    disabled={isSolving}
                >
                    <span className="btn-icon">🔀</span> Shuffle
                </motion.button>

                <motion.button
                    className="action-btn reset-btn"
                    onClick={onReset}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    disabled={isSolving}
                >
                    <span className="btn-icon">↺</span> Reset
                </motion.button>
            </div>

            {/* Undo / Redo */}
            <div className="action-group">
                <motion.button
                    className="action-btn undo-btn"
                    onClick={onUndo}
                    disabled={!canUndo || isSolving}
                    whileHover={{ scale: canUndo ? 1.04 : 1 }}
                    whileTap={{ scale: canUndo ? 0.96 : 1 }}
                >
                    <span className="btn-icon">⟵</span> Undo
                </motion.button>

                <motion.button
                    className="action-btn redo-btn"
                    onClick={onRedo}
                    disabled={!canRedo || isSolving}
                    whileHover={{ scale: canRedo ? 1.04 : 1 }}
                    whileTap={{ scale: canRedo ? 0.96 : 1 }}
                >
                    Redo <span className="btn-icon">⟶</span>
                </motion.button>
            </div>

            {/* Auto Solve */}
            <motion.button
                className={`action-btn solve-btn${isSolving ? ' solving-active' : ''}`}
                onClick={onSolve}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                disabled={isSolving}
            >
                {isSolving
                    ? `⚡ Solving… (${solverStepsLeft} steps)`
                    : '⚡ Auto Solve'}
            </motion.button>
        </div>
    );
}
