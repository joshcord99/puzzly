import { PuzzlePiece as PuzzlePieceType } from '@/utils/types';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  index: number;
}

export default function PuzzlePiece({ piece, index }: PuzzlePieceProps) {
  return (
    <span
      className={`puzzle-piece ${piece.isPlaced ? 'placed' : ''}`}
      style={{
        left: `${piece.isPlaced ? piece.targetPosition.x : piece.position.x}%`,
        top: `${piece.isPlaced ? piece.targetPosition.y : piece.position.y}%`,
        transform: `rotate(${piece.rotation}deg)`,
        backgroundPosition: `${(index % 4) * 33}% ${Math.floor(index / 4) * 50}%`,
      }}
      title={piece.isPlaced ? 'Piece placed' : 'Waiting to be placed'}
    />
  );
}
