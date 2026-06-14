'use client';

import { useState } from 'react';
import { initialParticipants } from '@/services/collaboration/collaborationService';
import { createParticipant } from '@/services/collaboration/userService';

export function useCollaboration() {
  const [participants, setParticipants] = useState(initialParticipants);

  const addParticipant = (displayName: string) => {
    if (!displayName.trim()) return;
    setParticipants((current) => [...current, createParticipant(displayName)]);
  };

  return { participants, addParticipant };
}
