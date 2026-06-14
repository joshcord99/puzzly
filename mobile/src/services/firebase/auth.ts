import { localStore } from '../localStore';
import { UserProfile } from '../../utils/types';

export const signUp = async (email: string, password: string) => {
  return signIn(email, password);
};

export const signIn = async (email: string, password: string) => {
  if (!email || !password) {throw new Error('Email and password are required');}
  return localStore.getCurrentUser();
};

export const signOut = async () => {
  localStore.setCurrentUser(null);
};

export const getCurrentUser = () => {
  return localStore.getCurrentUser();
};

export const resetPassword = async (email: string) => {
  return Boolean(email);
};

export const updateProfile = async (displayName?: string, photoURL?: string) => {
  const user = localStore.getCurrentUser();
  if (!user) {throw new Error('No signed-in user');}
  const updated = localStore.saveUser({ ...user, displayName: displayName || user.displayName, avatar: photoURL });
  localStore.setCurrentUser(updated);
  return updated;
};

export const onAuthStateChanged = (callback: (user: UserProfile | null) => void) => {
  callback(localStore.getCurrentUser());
  return () => undefined;
};
