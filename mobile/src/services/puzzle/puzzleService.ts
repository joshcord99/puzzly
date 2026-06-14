import { generatePuzzle } from '../../utils/puzzleGenerator';
import { Puzzle, PuzzleState } from '../../utils/types';
import { localStore } from '../localStore';

export const createPuzzle = async (imageUri: string, difficulty: 'easy' | 'medium' | 'hard') => {
  const pieces = generatePuzzle(difficulty);
  const puzzle: Puzzle = {
    id: `puzzle-${Date.now()}`,
    imageUrl: imageUri,
    difficulty,
    pieceCount: pieces.length,
    createdAt: Date.now(),
    createdBy: localStore.getCurrentUser()?.id || 'demo-user',
  };
  return localStore.savePuzzle(puzzle);
};

export const loadPuzzle = async (puzzleId: string) => {
  const puzzle = localStore.getPuzzle(puzzleId);
  if (!puzzle) {throw new Error('Puzzle not found');}
  return puzzle;
};

export const getPuzzleList = async () => {
  return localStore.listPuzzles();
};

export const updatePuzzleProgress = async (puzzleId: string, progress: number) => {
  return { puzzleId, progress };
};

export const markPuzzleComplete = async (puzzleId: string, sessionId: string) => {
  return { puzzleId, sessionId, completedAt: Date.now() };
};

export const calculatePuzzleProgress = (puzzleState: PuzzleState | null) => {
  return puzzleState?.progress || 0;
};
