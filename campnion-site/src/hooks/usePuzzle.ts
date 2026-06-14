'use client';

import { useMemo, useState } from 'react';
import { createPuzzleState, updatePiece } from '@/services/puzzle/puzzleState';
import { generatePuzzlePieces } from '@/utils/puzzleGenerator';

export function usePuzzle() {
  const initialState = useMemo(() => createPuzzleState(generatePuzzlePieces()), []);
  const [state, setState] = useState(initialState);

  const placeNextPiece = () => {
    const nextPiece = Object.values(state.pieces).find((piece) => !piece.isPlaced);
    if (!nextPiece) return;
    setState((current) =>
      updatePiece(current, nextPiece.id, {
        isPlaced: true,
        rotation: 0,
        position: nextPiece.targetPosition,
        placedBy: 'maya',
        placedAt: Date.now(),
      }),
    );
  };

  const reset = () => setState(initialState);

  return { state, placeNextPiece, reset };
}
