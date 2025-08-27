
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
import { client } from '../services/appwrite';

export default function Root() {
  const { user, setUser, loading, setLoading } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) Restore JWT if present
        const jwt = await AsyncStorage.getItem('user_jwt');
        if (jwt) {
          client.setJWT(jwt);
          console.log('JWT restored');
        } else {
          client.setJWT(''); // ensure no stale token
        }

        // 2) Try to fetch current user (works only if JWT valid)
        const u = await getCurrentUser();
        setUser(u);
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
