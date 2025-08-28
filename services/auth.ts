
//services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account, db, usersCol, ID, client } from './appwrite';
import { Permission, Role } from 'appwrite';
import { useAuth } from '../store/authStore';

const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const JWT_KEY = 'user_jwt';
const EMAIL_KEY = 'user_email';
const PASS_KEY = 'user_password';

/**
 * Save JWT in storage and set client
 */
async function storeJWT(jwt: string) {
  await AsyncStorage.setItem(JWT_KEY, jwt);
  client.setJWT(jwt);
}

/**
 * Issue JWT and store it locally
 */
async function issueAndStoreJWT() {
  const { jwt } = await account.createJWT();
  await storeJWT(jwt);
}

/**
 * Refresh JWT by re-logging in using stored credentials
 */
async function refreshJWT() {
  try {
    const email = await AsyncStorage.getItem(EMAIL_KEY);
    const password = await AsyncStorage.getItem(PASS_KEY);

    if (!email || !password) {
      throw new Error('Missing credentials for refresh');
    }

    client.setJWT(''); // switch back to session mode
    await account.createEmailPasswordSession(email, password);
    const { jwt } = await account.createJWT();
    await storeJWT(jwt);

    console.log('✅ JWT refreshed via re-login');
    return jwt;
  } catch (error) {
    console.error('❌ Failed to refresh JWT:', error);
    await signOut();
    return null;
  }
}

/**
 * Sign up a new user and create profile document
 */
export async function signUp(
  name: string,
  phone: string,
  role: 'worker' | 'employer',
  email: string,
  password: string
) {
  try {
    await account.deleteSessions().catch(() => {}); // clean sessions
    const user = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    await issueAndStoreJWT();

    await AsyncStorage.setItem(EMAIL_KEY, email);
    await AsyncStorage.setItem(PASS_KEY, password);

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

/**
 * Sign in user and issue JWT
 */
export async function signIn(email: string, password: string) {
  try {
    await account.deleteSessions().catch(() => {});
    await account.createEmailPasswordSession(email, password);
    await issueAndStoreJWT();

    await AsyncStorage.setItem(EMAIL_KEY, email);
    await AsyncStorage.setItem(PASS_KEY, password);

    return getCurrentUser();
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw error;
  }
}

/**
 * Get current user with retry if JWT expired
 */
export async function getCurrentUser() {
  try {
    const user = await account.get();
    let doc;

    try {
      doc = await db.getDocument(DB_ID, usersCol, user.$id);
    } catch (err) {
      console.warn('User document missing, creating new one...');
      doc = await db.createDocument(
        DB_ID,
        usersCol,
        user.$id,
        { name: user.name, phone: '', role: 'worker', verified: false, rating: 0, ratingsCount: 0 },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );
    }

    return {
      id: user.$id,
      name: user.name,
      role: doc.role,
      phone: doc.phone,
      verified: doc.verified,
      rating: doc.rating,
      ratingsCount: doc.ratingsCount,
    };
  } catch (error: any) {
    if (error?.code === 401) {
      console.warn('JWT expired, refreshing...');
      const newJwt = await refreshJWT();
      if (newJwt) {
        return getCurrentUser(); // retry once
      }
    }
    console.error('getCurrentUser error:', error);
    return null;
  }
}

/**
 * Sign out user and clear JWT
 */
export async function signOut() {
  try {
    await account.deleteSessions().catch(() => {});
    await AsyncStorage.removeItem(JWT_KEY);
    await AsyncStorage.removeItem(EMAIL_KEY);
    await AsyncStorage.removeItem(PASS_KEY);
    client.setJWT('');
    //useAuth.getState().setUser(null);
    
  } catch (error) {
    console.error('Sign-out failed:', error);
  }
}

/**
 * Restore JWT on app startup
 */
export async function restoreAuth() {
  const jwt = await AsyncStorage.getItem(JWT_KEY);
  if (jwt) {
    client.setJWT(jwt);
    console.log('✅ JWT restored');
  }
}

