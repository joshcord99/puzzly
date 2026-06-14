import { useState, useEffect } from 'react';
import { subscribeToPuzzleState, subscribeToParticipants } from '../services/firebase/realtime';
import { PuzzleState } from '../services/puzzle/puzzleState';
import { Participant } from '../utils/types';

export const useRealtimeSync = (sessionId: string) => {
  const [puzzleState, setPuzzleState] = useState<PuzzleState | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!sessionId) {return;}

    const unsubscribeState = subscribeToPuzzleState(sessionId, (state) => {
      setPuzzleState(state);
    });

    const unsubscribeParticipants = subscribeToParticipants(sessionId, (participantsList) => {
      setParticipants(participantsList);
    });

    setIsConnected(true);

    return () => {
      unsubscribeState();
      unsubscribeParticipants();
      setIsConnected(false);
    };
  }, [sessionId]);

  const handleRemoteUpdate = (remoteState: PuzzleState) => {
    setPuzzleState(remoteState);
  };

  return {
    puzzleState,
    participants,
    isConnected,
    handleRemoteUpdate,
  };
};
