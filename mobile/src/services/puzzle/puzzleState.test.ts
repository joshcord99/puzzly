import { generatePuzzle } from '../../utils/puzzleGenerator';
import {
  calculateProgress,
  createInitialPuzzleState,
  updatePiecePosition,
  validatePiecePlacement,
} from './puzzleState';

describe('puzzle state', () => {
  it('creates a playable state for each difficulty', () => {
    expect(generatePuzzle('easy')).toHaveLength(9);
    expect(generatePuzzle('medium')).toHaveLength(16);
    expect(generatePuzzle('hard')).toHaveLength(25);
  });

  it('snaps a nearby piece into place and updates progress', () => {
    const state = createInitialPuzzleState(generatePuzzle('easy'));
    const piece = state.pieces['piece-1'];
    const updated = updatePiecePosition(state, piece.id, piece.targetPosition);

    expect(updated.pieces[piece.id].isPlaced).toBe(true);
    expect(updated.completedPieces).toContain(piece.id);
    expect(calculateProgress(updated)).toBe(11);
  });

  it('rejects positions outside the placement threshold', () => {
    const piece = generatePuzzle('easy')[0];
    expect(validatePiecePlacement({ ...piece, position: { x: 999, y: 999 } })).toBe(false);
  });
});
