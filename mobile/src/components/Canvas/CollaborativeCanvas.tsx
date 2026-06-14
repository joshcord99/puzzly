import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PuzzlePiece } from './PuzzlePiece';
import { PuzzleState } from '../../services/puzzle/puzzleState';

interface CollaborativeCanvasProps {
  puzzleState: PuzzleState | null;
  onPieceMove?: (pieceId: string, position: { x: number; y: number }) => void;
}

export const CollaborativeCanvas: React.FC<CollaborativeCanvasProps> = ({
  puzzleState,
  onPieceMove,
}) => {
  if (!puzzleState) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Preparing puzzle board...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <Text style={styles.boardLabel}>Match pieces to the outlined board</Text>
      </View>

      {Object.values(puzzleState.pieces).map((piece) => (
        <PuzzlePiece
          key={piece.id}
          piece={piece}
          onMove={(position) => onPieceMove?.(piece.id, position)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  boardLabel: {
    textAlign: 'center',
    paddingTop: 16,
    color: '#004a99',
  },
  emptyText: {
    margin: 24,
    textAlign: 'center',
    color: '#666',
  },
});
