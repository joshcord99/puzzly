import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { PuzzlePiece as PuzzlePieceType } from '../../services/puzzle/puzzleState';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  onMove?: (position: { x: number; y: number }) => void;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ piece, onMove }) => {
  const translateX = useSharedValue(piece.position.x);
  const translateY = useSharedValue(piece.position.y);
  const rotation = useSharedValue(piece.rotation);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX + piece.position.x;
      translateY.value = e.translationY + piece.position.y;
    })
    .onEnd((e) => {
      const newPosition = {
        x: e.translationX + piece.position.x,
        y: e.translationY + piece.position.y,
      };
      if (onMove) {runOnJS(onMove)(newPosition);}
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: piece.isPlaced ? 0.5 : 1,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.piece, animatedStyle]}>
        <View style={styles.pieceImage}>
          <Text style={styles.pieceText}>{piece.id.replace('piece-', '')}</Text>
        </View>
        {piece.isPlaced && <View style={styles.placedIndicator} />}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  pieceImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#76b7ff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceText: {
    color: '#003a73',
    fontWeight: 'bold',
  },
  placedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
});
