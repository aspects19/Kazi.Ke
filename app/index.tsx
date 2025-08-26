// app/index.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../store/authStore';
import { theme } from '../theme/rne';
import { getCurrentUser } from '../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setAuthToken } from '../services/appwrite';
import { signIn } from '../services/auth';

export default function Root() {
  const { user, setUser, loading, setLoading } = useAuth();
useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      const email = await AsyncStorage.getItem('user_email');
      const password = await AsyncStorage.getItem('user_password');

      let user = null;
      try {
        // Check if a session already exists
        user = await getCurrentUser();
      } catch (err) {
        console.log('No active session, attempting to restore:', err);
      }

      if (!user && email && password) {
        console.log('Restoring session for', email);
        await signIn(email, password);
        user = await getCurrentUser();
      } else if (!user) {
        console.log('No stored credentials or active session');
      }

      setUser(user);
    } catch (err) {
      console.log('Auth restore error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  })();
}, []);
 



  if (loading) return null;

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </ThemeProvider>
  );
}


