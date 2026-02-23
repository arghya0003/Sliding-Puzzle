import { LayoutGroup } from 'framer-motion';
import Tile from './Tile';

// Board pixel size based on grid size
function boardPx(size) {
    if (size <= 3) return 340;
    if (size === 4) return 380;
    return 420;
}

export default function Board({ tiles, size, onTileClick, isSolving }) {
    const px = boardPx(size);

    return (
        <div
            className="board"
            style={{
                width: px,
                height: px,
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                gridTemplateRows: `repeat(${size}, 1fr)`,
            }}
            aria-label={`${size}×${size} sliding puzzle board`}
        >
            <LayoutGroup>
                {tiles.map((value, index) => (
                    <Tile
                        key={value === 0 ? 'blank' : value}
                        value={value}
                        index={index}
                        size={size}
                        onClick={onTileClick}
                        isSolving={isSolving}
                    />
                ))}
            </LayoutGroup>
        </div>
    );
}
