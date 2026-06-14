import PuzzlePiece from './PuzzlePiece';
import { PuzzleState } from '@/utils/types';

interface CollaborativeCanvasProps {
  state: PuzzleState;
}

export default function CollaborativeCanvas({ state }: CollaborativeCanvasProps) {
  return (
    <div className="canvas-shell">
      <div className="canvas-grid" aria-label="Collaborative puzzle board">
        <div className="scene">
          <div className="sun" />
          <div className="mountain mountain-back" />
          <div className="mountain mountain-front" />
          <div className="tent" />
          <div className="water" />
        </div>
        {Object.values(state.pieces).map((piece, index) => (
          <PuzzlePiece key={piece.id} piece={piece} index={index} />
        ))}
      </div>
    </div>
  );
}
