import { useState, useEffect } from 'react';
import { createCollaborationSession, joinCollaborationSession, leaveCollaborationSession } from '../services/collaboration/collaborationService';
import { subscribeToSession } from '../services/firebase/realtime';
import { Session } from '../utils/types';

export const useCollaboration = (sessionId?: string) => {
  const [session, setSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState<Session['participants']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {return;}

    const unsubscribe = subscribeToSession(sessionId, (sessionData) => {
      setSession(sessionData);
      setParticipants(sessionData?.participants || []);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const createSession = async (puzzleId: string, hostId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await createCollaborationSession(hostId, puzzleId);
      setSession(created);
      setParticipants(created.participants);
      return created;
    } catch (errorValue) {
      setError(errorValue instanceof Error ? errorValue.message : 'Unable to create session');
      throw errorValue;
    } finally {
      setIsLoading(false);
    }
  };

  const joinSession = async (id: string, userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const joined = await joinCollaborationSession(id, userId);
      setSession(joined);
      setParticipants(joined.participants);
      return joined;
    } catch (errorValue) {
      setError(errorValue instanceof Error ? errorValue.message : 'Unable to join session');
      throw errorValue;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveSession = async (id: string, userId: string) => {
    return leaveCollaborationSession(id, userId);
  };

  return {
    session,
    participants,
    isLoading,
    error,
    createSession,
    joinSession,
    leaveSession,
  };
};
