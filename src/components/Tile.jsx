import { motion } from 'framer-motion';

// Tile font size scales with grid size
function tileFontSize(size) {
    if (size <= 3) return '1.65rem';
    if (size === 4) return '1.25rem';
    return '0.95rem';
}

export default function Tile({ value, index, size, onClick, isSolving }) {
    if (value === 0) {
        return <div className="tile tile-empty" />;
    }

    return (
        <motion.button
            className={`tile tile-filled${isSolving ? ' solving' : ''}`}
            onClick={() => onClick(index)}
            layout
            layoutId={`tile-${value}`}
            transition={{
                layout: { type: 'spring', stiffness: 400, damping: 32 },
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
        >
            <span className="tile-number" style={{ fontSize: tileFontSize(size) }}>
                {value}
            </span>
        </motion.button>
    );
}
