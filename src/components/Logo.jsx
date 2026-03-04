import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Logo.css';

export default function Logo() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    function handleClick() {
        if (!isHome) navigate('/');
    }

    return (
        <motion.div
            className={`site-logo${isHome ? '' : ' site-logo--clickable'}`}
            onClick={handleClick}
            whileHover={!isHome ? { scale: 1.06 } : {}}
            whileTap={!isHome ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            title={isHome ? '' : 'Go to Home'}
        >
            <svg
                className="logo-svg"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect x="0" y="0" width="44" height="44" rx="10" fill="#1e1145" />
                <rect x="6" y="6" width="14" height="14" rx="3" fill="#5b3daf" />
                <rect x="23" y="6" width="14" height="14" rx="3" fill="#4c3199" />
                <rect x="6" y="23" width="14" height="14" rx="3" fill="#8b5cf6" />
                <rect x="23" y="23" width="14" height="14" rx="3" fill="#2d1a6b" />
            </svg>
            <div className="logo-text">
                <span className="logo-name">Slidix</span>
            </div>
        </motion.div>
    );
}
