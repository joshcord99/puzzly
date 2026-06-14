import { UserProfile as UserProfileType } from '@/utils/types';

interface UserProfileProps {
  user: UserProfileType;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function UserProfile({ user, onEdit, onDelete }: UserProfileProps) {
  return (
    <article className="participant">
      <span className="avatar avatar-4">{user.displayName.slice(0, 2).toUpperCase()}</span>
      <span>
        <strong>{user.displayName}</strong>
        <small>{user.puzzlesCompleted} puzzles completed · {user.activeSessions} active</small>
      </span>
      {onEdit && <button type="button" onClick={onEdit}>Edit</button>}
      {onDelete && <button type="button" onClick={onDelete}>Delete</button>}
    </article>
  )
}
