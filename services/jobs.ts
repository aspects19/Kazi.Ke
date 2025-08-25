// services/jobs.ts
// import { db, jobsCol, ID, Query } from './appwrite';

// const DB = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

// export async function listJobs(q?: { q?: string }) {
//   const queries = [ Query.orderDesc('createdAt') ];
//   if (q?.q) queries.push(Query.search('title', q.q));
//   const res = await db.listDocuments(DB, jobsCol, queries);
//   return res.documents;
// }

// export async function getJobById(id: string) {
//   return db.getDocument(DB, jobsCol, id);
// }

// export async function createJob(input: any) {
//   return db.createDocument(DB, jobsCol, ID.unique(), { ...input, createdAt: new Date().toISOString(), status: 'open' });
// }

// export async function applyToJob(jobId: string) {
//   // implemented in services/applications.ts in a real app; simplified here
//   // create applications document and link to current user
// }

// services/jobs.ts
import { db, jobsCol, ID, Query } from './appwrite';
import { getCurrentUser } from './auth';
import { apply } from './applications';

const DB = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

export async function listJobs(q?: { q?: string; location?: string; minPay?: number }) {
  const queries: any[] = [ Query.orderDesc('createdAt'), Query.equal('status', 'open') ];
  if (q?.q) queries.push(Query.search('title', q.q));
  if (q?.location) queries.push(Query.equal('location', q.location));
  if (typeof q?.minPay === 'number') queries.push(Query.greaterEqual('pay', q.minPay));
  const res = await db.listDocuments(DB, jobsCol, queries);
  return res.documents;
}

export async function getJobById(id: string) {
  return db.getDocument(DB, jobsCol, id);
}

export async function createJob(input: any) {
  const me = await getCurrentUser();
  if (!me) throw new Error('Not signed in');
  return db.createDocument(DB, jobsCol, ID.unique(), {
    ...input,
    postedBy: me.id,
    createdAt: new Date().toISOString(),
    status: 'open',
  });
}

export async function listMyJobs() {
  const me = await getCurrentUser();
  if (!me) return [];
  const res = await db.listDocuments(DB, jobsCol, [
    Query.equal('postedBy', me.id),
    Query.orderDesc('createdAt'),
  ]);
  return res.documents;
}

export async function closeJob(jobId: string) {
  return db.updateDocument(DB, jobsCol, jobId, { status: 'closed' });
}

export async function applyToJob(jobId: string, coverNote?: string) {
  return apply(jobId, coverNote);
}
