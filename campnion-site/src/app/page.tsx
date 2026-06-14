'use client';

import AddUserModal from '@/components/User/AddUserModal';
import UserList from '@/components/User/UserList';
import CanvasControls from '@/components/Canvas/CanvasControls';
import CollaborativeCanvas from '@/components/Canvas/CollaborativeCanvas';
import { useCollaboration } from '@/hooks/useCollaboration';
import { usePuzzle } from '@/hooks/usePuzzle';
import { puzzleService } from '@/services/puzzle/puzzleService';

export default function HomePage() {
  const puzzle = puzzleService.getFeaturedPuzzle();
  const { state, placeNextPiece, reset } = usePuzzle();
  const { participants, addParticipant } = useCollaboration();
  const placedCount = state.completedPieces.length;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Puzzly home">
          <span className="brand-mark">P</span>
          <span>Puzzly</span>
        </a>
        <nav aria-label="Primary navigation">
          <a className="active" href="#puzzle">Puzzle</a>
          <a href="#team">Team</a>
          <a href="#activity">Activity</a>
        </nav>
        <div className="profile-chip">
          <span className="avatar avatar-4">JC</span>
          <span><strong>Josh</strong><small>Host</small></span>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">Live camp · Room 4D8K</span>
          <h1>Build something<br /><em>together.</em></h1>
          <p>A shared puzzle space for slow moments, quick ideas, and everyone around the campfire.</p>
        </div>
        <div className="hero-stat">
          <span>Session progress</span>
          <strong>{state.progress}%</strong>
          <div className="progress-track"><i style={{ width: `${state.progress}%` }} /></div>
          <small>{placedCount} of {puzzle.pieceCount} pieces placed</small>
        </div>
      </section>

      <section className="workspace" id="puzzle">
        <div className="board-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Today&apos;s puzzle</span>
              <h2>Golden Hour Camp</h2>
            </div>
            <span className="difficulty">{puzzle.difficulty} · {puzzle.pieceCount} pieces</span>
          </div>
          <CollaborativeCanvas state={state} />
          <CanvasControls complete={state.progress === 100} onPlace={placeNextPiece} onReset={reset} />
        </div>

        <aside className="sidebar" id="team">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Camp crew</span>
              <h2>{participants.length} collaborators</h2>
            </div>
            <span className="live-badge">Live</span>
          </div>
          <UserList participants={participants} />
          <AddUserModal onAdd={addParticipant} />

          <div className="activity-card" id="activity">
            <span className="eyebrow">Recent activity</span>
            <p><strong>Maya</strong> placed a corner piece.</p>
            <p><strong>Theo</strong> rotated three pieces.</p>
            <p><strong>You</strong> started this session.</p>
          </div>
        </aside>
      </section>

      <footer>
        <span>Made for shared moments.</span>
        <span>Puzzly companion · MVP</span>
      </footer>
    </main>
  );
}
