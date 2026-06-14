export interface PuzzlePiece {
  id: string;
  position: { x: number; y: number };
  targetPosition: { x: number; y: number };
  rotation: number;
  isPlaced: boolean;
  placedBy?: string;
  placedAt?: number;
}

export interface PuzzleState {
  pieces: Record<string, PuzzlePiece>;
  completedPieces: string[];
  progress: number;
  lastUpdated: number;
}

export const createInitialPuzzleState = (pieces: PuzzlePiece[]): PuzzleState => {
  return {
    pieces: Object.fromEntries(pieces.map(piece => [piece.id, piece])),
    completedPieces: [],
    progress: 0,
    lastUpdated: Date.now(),
  };
};

export const updatePiecePosition = (state: PuzzleState, pieceId: string, position: { x: number; y: number }): PuzzleState => {
  const piece = state.pieces[pieceId];
  if (!piece) {return state;}
  const isPlaced = validatePiecePlacement({ ...piece, position });
  const completedPieces = isPlaced
    ? Array.from(new Set([...state.completedPieces, pieceId]))
    : state.completedPieces.filter(id => id !== pieceId);
  const next = {
    ...state,
    pieces: {
      ...state.pieces,
      [pieceId]: { ...piece, position: isPlaced ? piece.targetPosition : position, isPlaced },
    },
    completedPieces,
    lastUpdated: Date.now(),
  };
  return { ...next, progress: calculateProgress(next) };
};

export const validatePiecePlacement = (piece: PuzzlePiece, threshold: number = 10): boolean => {
  return Math.hypot(
    piece.position.x - piece.targetPosition.x,
    piece.position.y - piece.targetPosition.y,
  ) <= threshold;
};

export const calculateProgress = (state: PuzzleState): number => {
  const total = Object.keys(state.pieces).length;
  return total === 0 ? 0 : Math.round((state.completedPieces.length / total) * 100);
};
