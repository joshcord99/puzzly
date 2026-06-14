import { Participant } from '@/utils/types';
import { getInitials } from '@/services/collaboration/userService';

interface UserListProps {
  participants: Participant[];
}

export default function UserList({ participants }: UserListProps) {
  return (
    <div className="participant-list">
      {participants.map((participant, index) => (
        <div className="participant" key={participant.userId}>
          <span className={`avatar avatar-${(index % 4) + 1}`}>{getInitials(participant.displayName)}</span>
          <span>
            <strong>{participant.displayName}</strong>
            <small>{participant.isOnline ? (participant.isActive ? 'Placing pieces' : 'Online') : 'Away'}</small>
          </span>
          <i className={`status-dot ${participant.isOnline ? 'online' : ''}`} />
        </div>
      ))}
    </div>
  );
}
