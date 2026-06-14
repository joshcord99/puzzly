import { Participant, Puzzle, PuzzleState, Session, UserProfile } from '../utils/types';
import { createInitialPuzzleState } from './puzzle/puzzleState';
import { generatePuzzle } from '../utils/puzzleGenerator';

type Listener<T> = (value: T) => void;

const now = Date.now();
const demoUser: UserProfile = {
  id: 'demo-user',
  displayName: 'Demo Player',
  email: 'demo@puzzly.local',
  uniqueId: 'PUZZLY-DEMO',
  createdAt: now,
  puzzlesCompleted: 0,
  activeSessions: 0,
};

const demoPuzzle: Puzzle = {
  id: 'demo-puzzle',
  imageUrl: '',
  difficulty: 'easy',
  pieceCount: 9,
  createdAt: now,
  createdBy: demoUser.id,
};

const users = new Map<string, UserProfile>([[demoUser.id, demoUser]]);
const puzzles = new Map<string, Puzzle>([[demoPuzzle.id, demoPuzzle]]);
const sessions = new Map<string, Session>();
const sessionListeners = new Map<string, Set<Listener<Session | null>>>();
const puzzleListeners = new Map<string, Set<Listener<PuzzleState | null>>>();
let currentUser: UserProfile | null = demoUser;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const emitSession = (sessionId: string) => {
  const session = sessions.get(sessionId) || null;
  sessionListeners.get(sessionId)?.forEach(listener => listener(session ? clone(session) : null));
  puzzleListeners.get(sessionId)?.forEach(listener => listener(session?.puzzleState ? clone(session.puzzleState) : null));
};

export const localStore = {
  getCurrentUser: () => (currentUser ? clone(currentUser) : null),
  setCurrentUser: (user: UserProfile | null) => {
    currentUser = user;
  },
  getUser: (userId: string) => {
    const user = users.get(userId);
    return user ? clone(user) : null;
  },
  listUsers: () => Array.from(users.values()).map(clone),
  saveUser: (user: UserProfile) => {
    users.set(user.id, clone(user));
    return clone(user);
  },
  getPuzzle: (puzzleId: string) => {
    const puzzle = puzzles.get(puzzleId);
    return puzzle ? clone(puzzle) : null;
  },
  listPuzzles: () => Array.from(puzzles.values()).map(clone),
  savePuzzle: (puzzle: Puzzle) => {
    puzzles.set(puzzle.id, clone(puzzle));
    return clone(puzzle);
  },
  getSession: (sessionId: string) => {
    const session = sessions.get(sessionId.toUpperCase());
    return session ? clone(session) : null;
  },
  listSessions: () => Array.from(sessions.values()).map(clone),
  saveSession: (session: Session) => {
    sessions.set(session.id.toUpperCase(), clone(session));
    emitSession(session.id.toUpperCase());
    return clone(session);
  },
  createDemoSession: (hostId: string, puzzleId = demoPuzzle.id) => {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    const user = users.get(hostId) || demoUser;
    const participant: Participant = {
      userId: user.id,
      displayName: user.displayName,
      joinedAt: Date.now(),
      isOnline: true,
      isActive: true,
    };
    const session: Session = {
      id,
      hostId: user.id,
      puzzleId,
      participants: [participant],
      status: 'active',
      createdAt: Date.now(),
      puzzleState: createInitialPuzzleState(generatePuzzle('easy')),
    };
    return localStore.saveSession(session);
  },
  subscribeSession: (sessionId: string, listener: Listener<Session | null>) => {
    const id = sessionId.toUpperCase();
    const listeners = sessionListeners.get(id) || new Set();
    listeners.add(listener);
    sessionListeners.set(id, listeners);
    listener(localStore.getSession(id));
    return () => {
      listeners.delete(listener);
    };
  },
  subscribePuzzle: (sessionId: string, listener: Listener<PuzzleState | null>) => {
    const id = sessionId.toUpperCase();
    const listeners = puzzleListeners.get(id) || new Set();
    listeners.add(listener);
    puzzleListeners.set(id, listeners);
    listener(localStore.getSession(id)?.puzzleState || null);
    return () => {
      listeners.delete(listener);
    };
  },
};
