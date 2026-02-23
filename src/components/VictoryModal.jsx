import { motion, AnimatePresence } from 'framer-motion';

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

export default function VictoryModal({ show, moves, elapsed, onPlayAgain, onReset }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="modal-card"
                        initial={{ scale: 0.6, opacity: 0, y: 60 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.6, opacity: 0, y: 60 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    >
                        {/* Trophy */}
                        <div className="modal-trophy">🏆</div>
                        <h2 className="modal-title">Puzzle Solved!</h2>
                        <p className="modal-subtitle">Outstanding performance!</p>

                        <div className="modal-stats">
                            <div className="modal-stat">
                                <span className="mstat-label">Moves</span>
                                <span className="mstat-value">{moves}</span>
                            </div>
                            <div className="modal-stat">
                                <span className="mstat-label">Time</span>
                                <span className="mstat-value mono">{formatTime(elapsed)}</span>
                            </div>
                            <div className="modal-stat">
                                <span className="mstat-label">Score</span>
                                <span className="mstat-value score-glow">
                                    {Math.max(100, 1000 - moves * 5 - elapsed)}
                                </span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <motion.button
                                className="action-btn shuffle-btn"
                                onClick={onPlayAgain}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                🔀 Play Again
                            </motion.button>
                            <motion.button
                                className="action-btn reset-btn"
                                onClick={onReset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ↺ Reset Board
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
