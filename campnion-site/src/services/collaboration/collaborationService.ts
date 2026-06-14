import { Participant } from '@/utils/types';

export const initialParticipants: Participant[] = [
  {
    userId: 'maya',
    displayName: 'Maya Chen',
    joinedAt: Date.now() - 28 * 60_000,
    isOnline: true,
    isActive: true,
  },
  {
    userId: 'theo',
    displayName: 'Theo Brooks',
    joinedAt: Date.now() - 16 * 60_000,
    isOnline: true,
    isActive: false,
  },
  {
    userId: 'ines',
    displayName: 'Ines Silva',
    joinedAt: Date.now() - 8 * 60_000,
    isOnline: false,
    isActive: false,
  },
];

export const collaborationService = { initialParticipants };
