import Button from '@/components/common/Button';

interface CanvasControlsProps {
  complete: boolean;
  onPlace: () => void;
  onReset: () => void;
}

export default function CanvasControls({ complete, onPlace, onReset }: CanvasControlsProps) {
  return (
    <div className="canvas-controls">
      <Button onClick={onPlace} disabled={complete}>{complete ? 'Puzzle complete' : 'Place next piece'}</Button>
      <Button variant="ghost" onClick={onReset}>Reset</Button>
    </div>
  );
}
