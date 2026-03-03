import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Leaderboard from '../components/Leaderboard';
import Logo from '../components/Logo';
import '../styles/leaderboard-page.css';

export default function LeaderboardPage() {
    const navigate = useNavigate();

    return (
        <div className="leaderboard-page">
            <Logo />
            <div className="bg-orb orb1" />
            <div className="bg-orb orb2" />

            <main className="leaderboard-wrap">
                <div className="leaderboard-header-bar">
                    <motion.button
                        className="back-btn"
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        ← Back
                    </motion.button>
                    <h1>Puzzle Champions</h1>
                </div>

                <Leaderboard />
            </main>
        </div>
    );
}
