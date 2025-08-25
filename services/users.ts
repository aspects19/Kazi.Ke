// services/users.ts
import { db, usersCol, reviewsCol, Query } from './appwrite';
import { getCurrentUser } from './auth';

const DB = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

export async function listWorkers() {
  const res = await db.listDocuments(DB, usersCol, [
    Query.equal('role', 'worker'),
    Query.orderDesc('rating'),
  ]);
  return res.documents;
}

export async function getMyProfile() {
  const me = await getCurrentUser();
  if (!me) return null;
  // Merge latest doc fields (rating may change):
  const doc = await db.getDocument(DB, usersCol, me.id);
  return { ...me, ...doc, id: me.id };
}

export async function updateMyProfile(fields: Partial<{ name: string; phone: string; availability: string }>) {
  const me = await getCurrentUser();
  if (!me) throw new Error('Not signed in');
  await db.updateDocument(DB, usersCol, me.id, fields);
}

export async function listVerifiedReviewsForWorker(workerId: string) {
  const res = await db.listDocuments(DB, reviewsCol, [
    Query.equal('workerId', workerId),
    Query.equal('verified', true),
    Query.orderDesc('createdAt'),
  ]);
  return res.documents;
}
