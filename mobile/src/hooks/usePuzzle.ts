import { useState, useEffect } from 'react';
import { loadPuzzle, calculatePuzzleProgress } from '../services/puzzle/puzzleService';
import { getPuzzleState, updatePuzzleState } from '../services/firebase/database';
import { PuzzleState, updatePiecePosition } from '../services/puzzle/puzzleState';
import { Puzzle } from '../utils/types';

export const usePuzzle = (puzzleId: string, sessionId?: string) => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [puzzleState, setPuzzleState] = useState<PuzzleState | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!puzzleId) {return;}

    setIsLoading(true);
    setError(null);
    loadPuzzle(puzzleId)
      .then(setPuzzle)
      .catch(errorValue => setError(errorValue instanceof Error ? errorValue.message : 'Unable to load puzzle'))
      .finally(() => setIsLoading(false));
  }, [puzzleId]);

  useEffect(() => {
    if (!sessionId) {return;}

    getPuzzleState(sessionId).then((state) => {
      setPuzzleState(state);
      setProgress(calculatePuzzleProgress(state));
    }).catch(errorValue => setError(errorValue instanceof Error ? errorValue.message : 'Unable to load session'));
  }, [sessionId]);

  const movePiece = async (pieceId: string, position: { x: number; y: number }) => {
    if (!puzzleState) {return;}

    const updatedState = updatePiecePosition(puzzleState, pieceId, position);
    setPuzzleState(updatedState);
    setProgress(calculatePuzzleProgress(updatedState));

    if (sessionId) {await updatePuzzleState(sessionId, updatedState);}
  };

  const placePiece = async (pieceId: string, position: { x: number; y: number }) => {
    if (!puzzleState) {return;}

    await movePiece(pieceId, position);
  };

  return {
    puzzle,
    puzzleState,
    progress,
    isLoading,
    error,
    movePiece,
    placePiece,
  };
};
