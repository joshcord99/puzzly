import { Participant } from '@/utils/types';

export function getInitials(displayName: string) {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function createParticipant(displayName: string): Participant {
  return {
    userId: `guest-${Date.now()}`,
    displayName: displayName.trim(),
    joinedAt: Date.now(),
    isOnline: true,
    isActive: true,
  };
}

export const userService = { createParticipant, getInitials };
