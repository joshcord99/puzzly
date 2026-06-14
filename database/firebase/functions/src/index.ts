import {initializeApp} from "firebase-admin/app";
import {getDatabase, ServerValue} from "firebase-admin/database";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onValueWritten} from "firebase-functions/v2/database";
import {auth} from "firebase-functions/v1";

initializeApp();

const REGION = "us-central1";
const DIFFICULTIES = new Set(["easy", "medium", "hard"]);
const MAX_DISPLAY_NAME_LENGTH = 80;
const MAX_PIECES = 2000;

type ObjectValue = Record<string, unknown>;

function database() {
  return getDatabase();
}

function requireAuth(auth: {uid: string} | undefined): string {
  if (!auth) {
    throw new HttpsError("unauthenticated", "Authentication is required.");
  }
  return auth.uid;
}

function requireObject(value: unknown, name: string): ObjectValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpsError("invalid-argument", `${name} must be an object.`);
  }
  return value as ObjectValue;
}

function requireString(
  value: unknown,
  name: string,
  maxLength = 128,
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpsError("invalid-argument", `${name} must be a non-empty string.`);
  }
  const result = value.trim();
  if (result.length > maxLength) {
    throw new HttpsError("invalid-argument", `${name} is too long.`);
  }
  return result;
}

function participant(uid: string, displayName: string): ObjectValue {
  return {
    userId: uid,
    displayName,
    joinedAt: ServerValue.TIMESTAMP,
    isOnline: true,
    isActive: true,
  };
}

export const upsertProfile = onCall({region: REGION}, async (request) => {
  const uid = requireAuth(request.auth);
  const data = requireObject(request.data, "profile");
  const displayName = requireString(
    data.displayName,
    "displayName",
    MAX_DISPLAY_NAME_LENGTH,
  );
  const email = request.auth?.token.email;

  if (typeof email !== "string" || email.length === 0) {
    throw new HttpsError("failed-precondition", "The account must have an email.");
  }

  const profileRef = database().ref(`users/${uid}`);
  const existing = (await profileRef.get()).val() as ObjectValue | null;
  await profileRef.update({
    displayName,
    email,
    uniqueId: uid,
    createdAt: existing?.createdAt ?? ServerValue.TIMESTAMP,
    updatedAt: ServerValue.TIMESTAMP,
  });

  return {userId: uid};
});

export const createPuzzle = onCall({region: REGION}, async (request) => {
  const uid = requireAuth(request.auth);
  const data = requireObject(request.data, "puzzle");
  const imageUrl = requireString(data.imageUrl, "imageUrl", 2048);
  const difficulty = requireString(data.difficulty, "difficulty", 16);
  const pieceCount = data.pieceCount;

  if (!DIFFICULTIES.has(difficulty)) {
    throw new HttpsError("invalid-argument", "difficulty is invalid.");
  }
  if (!Number.isInteger(pieceCount) || Number(pieceCount) < 4 || Number(pieceCount) > MAX_PIECES) {
    throw new HttpsError("invalid-argument", `pieceCount must be between 4 and ${MAX_PIECES}.`);
  }

  const puzzleRef = database().ref("puzzles").push();
  await puzzleRef.set({
    imageUrl,
    difficulty,
    pieceCount,
    createdBy: uid,
    createdAt: ServerValue.TIMESTAMP,
  });
  return {puzzleId: puzzleRef.key};
});

export const createSession = onCall({region: REGION}, async (request) => {
  const uid = requireAuth(request.auth);
  const data = requireObject(request.data, "session");
  const puzzleId = requireString(data.puzzleId, "puzzleId");
  const displayName = requireString(
    data.displayName,
    "displayName",
    MAX_DISPLAY_NAME_LENGTH,
  );

  if (!(await database().ref(`puzzles/${puzzleId}`).get()).exists()) {
    throw new HttpsError("not-found", "Puzzle does not exist.");
  }

  const sessionRef = database().ref("sessions").push();
  await sessionRef.set({
    hostId: uid,
    puzzleId,
    status: "active",
    createdAt: ServerValue.TIMESTAMP,
    updatedAt: ServerValue.TIMESTAMP,
    participants: {[uid]: participant(uid, displayName)},
    puzzleState: {
      pieces: {},
      completedPieces: {},
      progress: 0,
      lastUpdated: ServerValue.TIMESTAMP,
    },
  });
  return {sessionId: sessionRef.key};
});

export const joinSession = onCall({region: REGION}, async (request) => {
  const uid = requireAuth(request.auth);
  const data = requireObject(request.data, "request");
  const sessionId = requireString(data.sessionId, "sessionId");
  const displayName = requireString(
    data.displayName,
    "displayName",
    MAX_DISPLAY_NAME_LENGTH,
  );
  const sessionRef = database().ref(`sessions/${sessionId}`);

  await sessionRef.transaction((session) => {
    if (!session) return;
    if (session.status !== "active") return;
    session.participants = session.participants ?? {};
    session.participants[uid] = participant(uid, displayName);
    session.updatedAt = ServerValue.TIMESTAMP;
    return session;
  });

  const session = await sessionRef.get();
  if (!session.exists()) {
    throw new HttpsError("not-found", "Session does not exist.");
  }
  if (session.child("status").val() !== "active") {
    throw new HttpsError("failed-precondition", "Session is not active.");
  }
  return {sessionId};
});

export const leaveSession = onCall({region: REGION}, async (request) => {
  const uid = requireAuth(request.auth);
  const data = requireObject(request.data, "request");
  const sessionId = requireString(data.sessionId, "sessionId");
  const sessionRef = database().ref(`sessions/${sessionId}`);
  const session = await sessionRef.get();

  if (!session.exists()) {
    throw new HttpsError("not-found", "Session does not exist.");
  }
  if (!session.child(`participants/${uid}`).exists()) {
    throw new HttpsError("permission-denied", "You are not in this session.");
  }

  if (session.child("hostId").val() === uid) {
    await sessionRef.update({
      status: "ended",
      endedAt: ServerValue.TIMESTAMP,
      updatedAt: ServerValue.TIMESTAMP,
      [`participants/${uid}/isOnline`]: false,
      [`participants/${uid}/isActive`]: false,
    });
  } else {
    await sessionRef.child(`participants/${uid}`).remove();
    await sessionRef.child("updatedAt").set(ServerValue.TIMESTAMP);
  }
  return {sessionId};
});

export const endSession = onCall({region: REGION}, async (request) => {
  const uid = requireAuth(request.auth);
  const data = requireObject(request.data, "request");
  const sessionId = requireString(data.sessionId, "sessionId");
  const sessionRef = database().ref(`sessions/${sessionId}`);
  const session = await sessionRef.get();

  if (!session.exists()) {
    throw new HttpsError("not-found", "Session does not exist.");
  }
  if (session.child("hostId").val() !== uid) {
    throw new HttpsError("permission-denied", "Only the host can end the session.");
  }

  await sessionRef.update({
    status: "ended",
    endedAt: ServerValue.TIMESTAMP,
    updatedAt: ServerValue.TIMESTAMP,
  });
  return {sessionId};
});

export const recordCompletedPuzzle = onValueWritten(
  {
    ref: "/sessions/{sessionId}/puzzleState/progress",
    region: REGION,
  },
  async (event) => {
    if (event.data.before.val() === 100 || event.data.after.val() !== 100) {
      return;
    }

    const sessionRef = event.data.after.ref.parent?.parent?.parent;
    if (!sessionRef) return;
    const session = await sessionRef.get();
    const completedAtRef = sessionRef.child("completedAt");
    let claimedCompletion = false;
    const completion = await completedAtRef.transaction((completedAt) => {
      claimedCompletion = completedAt == null;
      return claimedCompletion ? ServerValue.TIMESTAMP : undefined;
    });
    if (!completion.committed || !claimedCompletion) {
      return;
    }
    if (session.child("completedAt").exists()) {
      return;
    }

    const participants = session.child("participants").val() as ObjectValue | null;
    const sessionId = event.params.sessionId;
    const updates: ObjectValue = {
      [`sessions/${sessionId}/updatedAt`]: ServerValue.TIMESTAMP,
    };

    for (const uid of Object.keys(participants ?? {})) {
      updates[`users/${uid}/puzzlesCompleted`] = ServerValue.increment(1);
    }
    await database().ref().update(updates);
  },
);

export const cleanupDeletedUser = auth.user().onDelete(async (user) => {
  const sessions = await database()
    .ref("sessions")
    .orderByChild(`participants/${user.uid}/userId`)
    .equalTo(user.uid)
    .get();
  const updates: ObjectValue = {[`users/${user.uid}`]: null};

  sessions.forEach((session) => {
    updates[`sessions/${session.key}/participants/${user.uid}`] = null;
  });
  await database().ref().update(updates);
});
