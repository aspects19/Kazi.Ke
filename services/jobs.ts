
// services/jobs.ts

import { Permission, Role } from 'appwrite';
import { db, jobsCol, ID, Query } from './appwrite';
import { getCurrentUser } from './auth';
import { apply } from './applications';

const DB = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

// Helper to catch & log errors without breaking app
async function safeRequest<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err) {
    console.error('Appwrite error:', err);
    return null;
  }
}

export async function listJobs(q?: { q?: string; location?: string; minPay?: number }) {
  const queries: any[] = [
    Query.orderDesc('$createdAt'), // Use system timestamp instead of custom field
    Query.equal('status', 'open'),
  ];

  if (q?.q) queries.push(Query.search('title', q.q));
  if (q?.location) queries.push(Query.equal('location', q.location));
  if (typeof q?.minPay === 'number') queries.push(Query.greaterEqual('pay', q.minPay));

  const res = await safeRequest(() => db.listDocuments(DB, jobsCol, queries));
  return res?.documents || [];
}

export async function getJobById(id: string) {
  return safeRequest(() => db.getDocument(DB, jobsCol, id));
}

export async function createJob(input: any) {
  const me = await getCurrentUser();
  if (!me) throw new Error('Not signed in');

  return safeRequest(() =>
    db.createDocument(
      DB,
      jobsCol,
      ID.unique(),
      {
        ...input,
        postedBy: me.$id, // Use Appwrite's system ID
        status: 'open',
      },
      [
        Permission.read(Role.users()), // All authenticated users can read
        Permission.write(Role.user(me.$id)), // Only creator can write
        Permission.update(Role.user(me.$id)), // Only creator can update
        Permission.delete(Role.user(me.$id)), // Only creator can delete
      ]
    )
  );
}

export async function listMyJobs() {
  const me = await getCurrentUser();
  if (!me) return [];
  const res = await safeRequest(() =>
    db.listDocuments(DB, jobsCol, [
      Query.equal('postedBy', me.$id),
      Query.orderDesc('$createdAt'),
    ])
  );
  return res?.documents || [];
}

export async function closeJob(jobId: string) {
  const me = await getCurrentUser();
  if (!me) throw new Error('Not signed in');
  return safeRequest(() =>
    db.updateDocument(DB, jobsCol, jobId, { status: 'closed' })
  );
}

export async function applyToJob(jobId: string, coverNote?: string) {
  return apply(jobId, coverNote);
}
