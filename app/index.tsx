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
      const email = await AsyncStorage.getItem('user_email');
      const password = await AsyncStorage.getItem('user_password');

      if (email && password) {
        console.log('Restoring session for', email);
        await signIn(email, password);
        } else {
        console.log('No stored credentials');
        }

      const user = await getCurrentUser();
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
