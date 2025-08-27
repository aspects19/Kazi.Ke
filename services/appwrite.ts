
// services/appwrite.ts
import { Client, Account, Databases, ID, Query } from 'appwrite';

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
export const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const usersCol = process.env.EXPO_PUBLIC_USERS_COLLECTION_ID!;
export const jobsCol = process.env.EXPO_PUBLIC_JOBS_COLLECTION_ID!;
export const appsCol = process.env.EXPO_PUBLIC_APPLICATIONS_COLLECTION_ID!;
export const reviewsCol = process.env.EXPO_PUBLIC_REVIEWS_COLLECTION_ID!;

export const client = new Client().setEndpoint(endpoint).setProject(project);

export const account = new Account(client);
export const db = new Databases(client);

export { ID, Query };

