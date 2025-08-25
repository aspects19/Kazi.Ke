// services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account, db, usersCol, ID , setAuthToken} from './appwrite';
import { useAuth } from '../store/authStore';

export async function signUp(name: string, phone: string, role: 'worker'|'employer', email: string, password: string) {
  const user = await account.create(ID.unique(), email, password, name);
  await account.createEmailPasswordSession(email, password);
  await db.createDocument(process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, usersCol, user.$id, {
    name, phone, role, verified: false, rating: 0, ratingsCount: 0
  });
  await AsyncStorage.setItem('user_email', email);
  await AsyncStorage.setItem('user_password', password);
  return getCurrentUser();
}

export async function signIn(email: string, password: string) {
  await account.createEmailPasswordSession(email, password);
  await AsyncStorage.setItem('user_email', email);
  await AsyncStorage.setItem('user_password', password);
  return getCurrentUser();
}

export async function getCurrentUser() {
  try {
    const a = await account.get();
    const doc = await db.getDocument(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, usersCol, a.$id
    );
    return { id: a.$id, name: a.name, role: doc.role, phone: doc.phone, verified: doc.verified, rating: doc.rating, ratingsCount: doc.ratingsCount };
  } catch {
    return null;
  }
}

export async function signOut() {
  await account.deleteSessions();
  await AsyncStorage.removeItem('user_email');
  await AsyncStorage.removeItem('user_password');
  useAuth.getState().setUser(null);
}
