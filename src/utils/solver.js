/**
 * A* solver for NxN sliding puzzle.
 * Heuristics: Manhattan Distance + Misplaced Tiles (max of both for tighter bound).
 */
import { goalState, getBlankIdx, isGoal } from './puzzleLogic';

/** Manhattan Distance heuristic */
export function manhattanDistance(tiles, size) {
    const goal = goalState(size);
    let dist = 0;
    for (let i = 0; i < tiles.length; i++) {
        const val = tiles[i];
        if (val === 0) continue;
        const goalIdx = goal.indexOf(val);
        dist +=
            Math.abs(Math.floor(i / size) - Math.floor(goalIdx / size)) +
            Math.abs((i % size) - (goalIdx % size));
    }
    return dist;
}

/** Misplaced Tiles heuristic */
export function misplacedTiles(tiles, size) {
    const goal = goalState(size);
    let count = 0;
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== 0 && tiles[i] !== goal[i]) count++;
    }
    return count;
}

/** Combined heuristic — max gives better admissible lower bound */
function heuristic(tiles, size) {
    return Math.max(manhattanDistance(tiles, size), misplacedTiles(tiles, size));
}

function stateKey(tiles) {
    return tiles.join(',');
}

function getNeighbors(tiles, size) {
    const blank = getBlankIdx(tiles);
    const row = Math.floor(blank / size);
    const col = blank % size;
    const neighbors = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            const nIdx = nr * size + nc;
            const next = [...tiles];
            [next[blank], next[nIdx]] = [next[nIdx], next[blank]];
            neighbors.push(next);
        }
    }
    return neighbors;
}

/**
 * A* search returning array of tile-states from start → goal.
 * Returns null if unsolvable or exceeds maxNodes limit.
 */
export function solvePuzzle(startTiles, size, maxNodes = 80000) {
    if (isGoal(startTiles, size)) return [startTiles];

    // Simple min-heap via sorted array (acceptable for 3x3, feasible for 4x4)
    const open = [];
    const gScore = new Map();
    const closed = new Set();

    const startH = heuristic(startTiles, size);
    const startKey = stateKey(startTiles);
    gScore.set(startKey, 0);
    open.push({ tiles: startTiles, g: 0, f: startH, path: [startTiles] });

    let explored = 0;

    while (open.length > 0 && explored < maxNodes) {
        // Pop node with smallest f (with g as tiebreaker)
        open.sort((a, b) => a.f - b.f || b.g - a.g);
        const current = open.shift();
        explored++;

        const key = stateKey(current.tiles);
        if (closed.has(key)) continue;
        closed.add(key);

        if (isGoal(current.tiles, size)) {
            return current.path;
        }

        for (const neighbor of getNeighbors(current.tiles, size)) {
            const nKey = stateKey(neighbor);
            if (closed.has(nKey)) continue;

            const g = current.g + 1;
            const prevG = gScore.get(nKey) ?? Infinity;
            if (g >= prevG) continue;

            gScore.set(nKey, g);
            const h = heuristic(neighbor, size);
            open.push({
                tiles: neighbor,
                g,
                f: g + h,
                path: [...current.path, neighbor],
            });
        }
    }

    return null; // No solution within node limit
}
