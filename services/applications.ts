// services/applications.ts
import { db, appsCol, ID, Query } from './appwrite';
import { getCurrentUser } from './auth';

const DB = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

export async function apply(jobId: string, coverNote?: string) {
  const me = await getCurrentUser();
  if (!me) throw new Error('Not signed in');
  return db.createDocument(DB, appsCol, ID.unique(), {
    jobId,
    workerId: me.id,
    coverNote: coverNote ?? '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}

export async function listMyApplications() {
  const me = await getCurrentUser();
  if (!me) return [];
  const res = await db.listDocuments(DB, appsCol, [
    Query.equal('workerId', me.id),
    Query.orderDesc('createdAt'),
  ]);
  return res.documents;
}

export async function listApplicationsForJob(jobId: string) {
  const res = await db.listDocuments(DB, appsCol, [
    Query.equal('jobId', jobId),
    Query.orderDesc('createdAt'),
  ]);
  return res.documents;
}

export async function updateApplicationStatus(appId: string, status: 'accepted'|'rejected') {
  return db.updateDocument(DB, appsCol, appId, { status });
}

export async function withdrawApplication(appId: string) {
  return db.deleteDocument(DB, appsCol, appId);
}
