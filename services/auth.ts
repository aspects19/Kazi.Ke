// services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account, db, usersCol, ID } from './appwrite';
import { useAuth } from '../store/authStore';

const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

export async function signUp(name: string, phone: string, role: 'worker'|'employer', email: string, password: string) {
  try {
    await account.deleteSessions();

    const user = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);

    try {
      await db.createDocument(DB_ID, usersCol, user.$id, {
        name, phone, role, verified: false, rating: 0, ratingsCount: 0
      });
    } catch (err) {
      console.error('Failed to create user document:', err);
    }

    await AsyncStorage.setItem('user_email', email);
    await AsyncStorage.setItem('user_password', password);

    return getCurrentUser();
  } catch (error) {
    console.error('Sign-up failed:', error);
    throw error;
  }
}


export async function signIn(email: string, password: string) {
  try {

   // Delete any existing sessions to avoid conflicts
    await account.deleteSessions();
    
    await account.createEmailPasswordSession(email, password);
    await AsyncStorage.setItem('user_email', email);
    await AsyncStorage.setItem('user_password', password);
    return getCurrentUser();
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const a = await account.get();
    let doc;
    try {
      doc = await db.getDocument(DB_ID, usersCol, a.$id);
    } catch (error) {
      console.warn('No document found for user, creating default profile...');
      doc = await db.createDocument(DB_ID, usersCol, a.$id, {
        name: a.name, phone: '', role: 'worker', verified: false, rating: 0, ratingsCount: 0
      });
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
  await account.deleteSessions();
  await AsyncStorage.multiRemove(['user_email', 'user_password']);
  useAuth.getState().setUser(null);
}

