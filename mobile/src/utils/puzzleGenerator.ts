import { PuzzlePiece } from './types';

const counts = { easy: 9, medium: 16, hard: 25 };

export const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard'): PuzzlePiece[] => {
  const count = counts[difficulty];
  const columns = Math.sqrt(count);

  return Array.from({ length: count }, (_, index) => {
    const targetPosition = {
      x: (index % columns) * 72 + 16,
      y: Math.floor(index / columns) * 72 + 80,
    };
    return {
      id: `piece-${index + 1}`,
      position: {
        x: (index % columns) * 72 + 16,
        y: Math.floor(index / columns) * 72 + 360,
      },
      targetPosition,
      rotation: 0,
      isPlaced: false,
    };
  });
};
