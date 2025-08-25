// app/AppNavigator.tsx
// import React from 'react';
// import WorkerTabs from './WorkerTabs';
// import EmployerTabs from './EmployerTabs';
// import { useAuth } from '../store/authStore';

// export default function AppNavigator() {
//   const { user } = useAuth();
//   if (!user) return null;
//   return user.role === 'worker' ? <WorkerTabs /> : <EmployerTabs />;
// }


// app/AppNavigator.tsx (example root stack with details route)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkerTabs from './WorkerTabs';
import EmployerTabs from './EmployerTabs';
import JobDetailsScreen from '../screens/shared/JobDetailsScreen';
import { useAuth } from '../store/authStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();
  const Tabs = user?.role === 'worker' ? WorkerTabs : EmployerTabs;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ headerShown: true, title: 'Job Details' }} />
    </Stack.Navigator>
  );
}

