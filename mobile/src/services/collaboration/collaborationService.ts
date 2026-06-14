import { createSession, joinSession, leaveSession, getSession } from '../firebase/database';
import { localStore } from '../localStore';

export const createCollaborationSession = async (hostId: string, puzzleId: string) => {
  return localStore.createDemoSession(hostId, puzzleId);
};

export const joinCollaborationSession = async (sessionId: string, userId: string) => {
  return joinSession(sessionId, userId);
};

export const leaveCollaborationSession = async (sessionId: string, userId: string) => {
  return leaveSession(sessionId, userId);
};

export const endCollaborationSession = async (sessionId: string, hostId: string) => {
  const session = await getSession(sessionId);
  if (!session || session.hostId !== hostId) {throw new Error('Only the host can end this session');}
  return createSession(sessionId, { ...session, status: 'ended' });
};

export const getActiveSessions = async (userId: string) => {
  return localStore.listSessions().filter(
    session => session.status === 'active' && session.participants.some(participant => participant.userId === userId),
  );
};
