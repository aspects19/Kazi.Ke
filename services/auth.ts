// services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account, db, usersCol, ID, client } from './appwrite';
import { Permission, Role } from 'appwrite';
import { useAuth } from '../store/authStore';

const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

async function issueAndStoreJWT() {
  const { jwt } = await account.createJWT();
  await AsyncStorage.setItem('user_jwt', jwt);
  client.setJWT(jwt);
}

export async function signUp(
  name: string,
  phone: string,
  role: 'worker' | 'employer',
  email: string,
  password: string
) {
  try {
    // ensure clean state
    await account.deleteSessions().catch(() => {});

    const user = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    await issueAndStoreJWT();

    // create profile doc with user-only permissions
    try {
      await db.createDocument(
        DB_ID,
        usersCol,
        user.$id,
        { name, phone, role, verified: false, rating: 0, ratingsCount: 0 },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );
    } catch (err) {
      console.error('Failed to create user document:', err);
    }

    return getCurrentUser();
  } catch (error) {
    console.error('Sign-up failed:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    await account.deleteSessions().catch(() => {});
    await account.createEmailPasswordSession(email, password);
    await issueAndStoreJWT();
    return getCurrentUser();
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const a = await account.get(); // requires jwt set
    let doc;
    try {
      doc = await db.getDocument(DB_ID, usersCol, a.$id);
    } catch {
      // Create a default profile if missing
      doc = await db.createDocument(
        DB_ID,
        usersCol,
        a.$id,
        { name: a.name, phone: '', role: 'worker', verified: false, rating: 0, ratingsCount: 0 },
        [
          Permission.read(Role.user(a.$id)),
          Permission.update(Role.user(a.$id)),
          Permission.delete(Role.user(a.$id)),
        ]
      );
    }
    return {
      id: a.$id,
      name: a.name,
      role: doc.role,
      phone: doc.phone,
      verified: doc.verified,
      rating: doc.rating,
      ratingsCount: doc.ratingsCount,
    };
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return null;
  }
}

export async function signOut() {
  await account.deleteSessions().catch(() => {});
  await AsyncStorage.removeItem('user_jwt');
  // Clear any JWT on the client so future calls don't use a stale token
  client.setJWT('');
  useAuth.getState().setUser(null);
}
