import { PuzzlePiece } from './types';

export function generatePuzzlePieces(columns = 4, rows = 3): PuzzlePiece[] {
  return Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const targetPosition = {
      x: (column / columns) * 100,
      y: (row / rows) * 100,
    };

    return {
      id: `piece-${index + 1}`,
      position: {
        x: ((index * 37) % 84) + 2,
        y: ((index * 23) % 72) + 4,
      },
      targetPosition,
      rotation: [0, 90, 180, 270][index % 4],
      isPlaced: false,
    };
  });
}

export const puzzleGenerator = { generatePuzzlePieces };
