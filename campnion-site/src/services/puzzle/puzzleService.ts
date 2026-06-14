import { Puzzle } from '@/utils/types';

export const featuredPuzzle: Puzzle = {
  id: 'coastal-camp',
  imageUrl: '',
  difficulty: 'medium',
  pieceCount: 12,
  createdAt: 1718323200000,
  createdBy: 'puzzly',
};

export const puzzleService = {
  getFeaturedPuzzle: () => featuredPuzzle,
};
