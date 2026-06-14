import { Participant, PuzzleState, Session, UserProfile } from '../../utils/types';
import { localStore } from '../localStore';

export const createUser = async (userId: string, userData: Omit<UserProfile, 'id'>) => {
  return localStore.saveUser({ ...userData, id: userId });
};

export const getUser = async (userId: string) => {
  return localStore.getUser(userId);
};

export const updateUser = async (userId: string, updates: Partial<UserProfile>) => {
  const user = localStore.getUser(userId);
  if (!user) {throw new Error('User not found');}
  return localStore.saveUser({ ...user, ...updates, id: userId });
};

export const createSession = async (sessionId: string, sessionData: Session) => {
  return localStore.saveSession({ ...sessionData, id: sessionId.toUpperCase() });
};

export const getSession = async (sessionId: string) => {
  return localStore.getSession(sessionId);
};

export const joinSession = async (sessionId: string, userId: string) => {
  const session = localStore.getSession(sessionId);
  const user = localStore.getUser(userId);
  if (!session) {throw new Error('Session not found');}
  if (!user) {throw new Error('User not found');}
  if (!session.participants.some(participant => participant.userId === userId)) {
    const participant: Participant = {
      userId,
      displayName: user.displayName,
      joinedAt: Date.now(),
      isOnline: true,
      isActive: true,
    };
    session.participants.push(participant);
  }
  return localStore.saveSession(session);
};

export const leaveSession = async (sessionId: string, userId: string) => {
  const session = localStore.getSession(sessionId);
  if (!session) {throw new Error('Session not found');}
  session.participants = session.participants.filter(participant => participant.userId !== userId);
  return localStore.saveSession(session);
};

export const updatePuzzleState = async (sessionId: string, puzzleState: PuzzleState) => {
  const session = localStore.getSession(sessionId);
  if (!session) {throw new Error('Session not found');}
  session.puzzleState = puzzleState;
  return localStore.saveSession(session).puzzleState;
};

export const getPuzzleState = async (sessionId: string) => {
  return localStore.getSession(sessionId)?.puzzleState || null;
};
