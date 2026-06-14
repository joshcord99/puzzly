import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CollaborativeCanvas } from '../components/Canvas/CollaborativeCanvas';
import { UserList } from '../components/User/UserList';
import { usePuzzle } from '../hooks/usePuzzle';
import { useRealtimeSync } from '../hooks/useRealtimeSync';

interface PuzzleScreenProps {
  route: any;
}

export const PuzzleScreen: React.FC<PuzzleScreenProps> = ({ route }) => {
  const { puzzleId, sessionId } = route.params || {};
  const { puzzle, puzzleState: loadedState, progress, movePiece, isLoading, error } = usePuzzle(puzzleId, sessionId);
  const { participants } = useRealtimeSync(sessionId || '');
  const puzzleState = loadedState;

  if (!puzzle) {
    return (
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator /> : <Text>{error || 'Puzzle unavailable'}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>Progress: {progress}%</Text>
      </View>

      <View style={styles.canvasContainer}>
        <CollaborativeCanvas
          puzzleState={puzzleState}
          onPieceMove={movePiece}
        />
      </View>

      <View style={styles.sidebar}>
        <UserList users={participants} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  canvasContainer: {
    flex: 1,
    marginTop: 52,
  },
  sidebar: {
    maxHeight: 150,
    backgroundColor: '#f5f5f5',
  },
});
