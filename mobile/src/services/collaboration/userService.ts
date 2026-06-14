import { getUser, joinSession, leaveSession, updateUser } from '../firebase/database';
import { localStore } from '../localStore';
import { UserProfile } from '../../utils/types';

export const getUserByUniqueId = async (uniqueId: string) => {
  return localStore.listUsers().find(user => user.uniqueId.toLowerCase() === uniqueId.toLowerCase()) || null;
};

export const searchUsers = async (query: string) => {
  const normalized = query.trim().toLowerCase();
  return localStore.listUsers().filter(
    user => user.displayName.toLowerCase().includes(normalized) || user.uniqueId.toLowerCase().includes(normalized),
  );
};

export const addCollaborator = async (sessionId: string, userId: string) => {
  return joinSession(sessionId, userId);
};

export const removeCollaborator = async (sessionId: string, userId: string) => {
  return leaveSession(sessionId, userId);
};

export const getUserProfile = async (userId: string) => {
  return getUser(userId);
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  return updateUser(userId, profileData);
};
