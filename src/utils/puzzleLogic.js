/**
 * Generalized NxN sliding puzzle logic.
 * `size` = number of rows/columns (e.g. 3 for 8-puzzle, 4 for 15-puzzle).
 */

/** Goal state for a given size: [1, 2, ..., size²-1, 0] */
export function goalState(size) {
    const n = size * size;
    const arr = [];
    for (let i = 1; i < n; i++) arr.push(i);
    arr.push(0);
    return arr;
}

/** Check if tiles match the goal */
export function isGoal(tiles, size) {
    const goal = goalState(size);
    return tiles.every((t, i) => t === goal[i]);
}

/** Convert flat index → { row, col } */
export function idxToPos(idx, size) {
    return { row: Math.floor(idx / size), col: idx % size };
}

/** Are two indices adjacent (up/down/left/right only) in an NxN grid? */
export function isAdjacent(a, b, size) {
    const pa = idxToPos(a, size);
    const pb = idxToPos(b, size);
    return (
        (Math.abs(pa.row - pb.row) === 1 && pa.col === pb.col) ||
        (Math.abs(pa.col - pb.col) === 1 && pa.row === pb.row)
    );
}

/** Return the index of the blank (0) tile */
export function getBlankIdx(tiles) {
    return tiles.indexOf(0);
}

/**
 * Attempt to move the tile at `tileIdx` into the blank.
 * Returns new tiles array or null if the move is invalid.
 */
export function moveTile(tiles, tileIdx, size) {
    const blankIdx = getBlankIdx(tiles);
    if (!isAdjacent(tileIdx, blankIdx, size)) return null;
    const next = [...tiles];
    [next[tileIdx], next[blankIdx]] = [next[blankIdx], next[tileIdx]];
    return next;
}

/** Count inversions (for solvability check) */
function countInversions(tiles) {
    const arr = tiles.filter((t) => t !== 0);
    let inv = 0;
    for (let i = 0; i < arr.length; i++)
        for (let j = i + 1; j < arr.length; j++)
            if (arr[i] > arr[j]) inv++;
    return inv;
}

/** Row of the blank from the bottom (1-indexed) */
function blankRowFromBottom(tiles, size) {
    const blankIdx = getBlankIdx(tiles);
    const row = Math.floor(blankIdx / size); // 0-indexed from top
    return size - row; // from bottom
}

/**
 * Solvability check for NxN sliding puzzle.
 * - Odd grid (3x3, 5x5): puzzle is solvable iff inversions is even.
 * - Even grid (4x4): solvable iff (inversions + blank-row-from-bottom) is odd.
 */
export function isSolvable(tiles, size) {
    const inv = countInversions(tiles);
    if (size % 2 === 1) {
        return inv % 2 === 0;
    } else {
        const bRow = blankRowFromBottom(tiles, size);
        return (inv + bRow) % 2 === 1;
    }
}

/**
 * Generate a solvable shuffled state using a random walk from the goal.
 * This guarantees solvability.
 */
export function generateShuffled(moves, size) {
    let tiles = goalState(size);
    let lastBlank = -1;

    for (let i = 0; i < moves; i++) {
        const blank = getBlankIdx(tiles);
        const { row, col } = idxToPos(blank, size);

        const candidates = [];
        if (row > 0) candidates.push(blank - size);
        if (row < size - 1) candidates.push(blank + size);
        if (col > 0) candidates.push(blank - 1);
        if (col < size - 1) candidates.push(blank + 1);

        const neighbors = candidates.filter((n) => n !== lastBlank);
        const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        lastBlank = blank;

        const next = [...tiles];
        [next[blank], next[pick]] = [next[pick], next[blank]];
        tiles = next;
    }

    // Make sure we didn't accidentally land back at goal
    if (isGoal(tiles, size)) {
        const blank = getBlankIdx(tiles);
        const swap = blank - size >= 0 ? blank - size : blank + size;
        [tiles[blank], tiles[swap]] = [tiles[swap], tiles[blank]];
    }

    return tiles;
}
