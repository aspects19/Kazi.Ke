// app/WorkerTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkerJobsScreen from '../screens/worker/WorkerJobsScreen';
import SavedJobsScreen from '../screens/worker/SavedJobsScreen';
import ApplicationsScreen from '../screens/worker/ApplicationsScreen';
import WorkerProfileScreen from '../screens/worker/WorkerProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
export default function WorkerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Jobs" component={WorkerJobsScreen}
        options={{ tabBarIcon: ({ focused }) => <Icon name="briefcase-search" size={24} /> }} />
      <Tab.Screen name="Saved" component={SavedJobsScreen}
        options={{ tabBarIcon: () => <Icon name="bookmark" size={24} /> }} />
      <Tab.Screen name="Applications" component={ApplicationsScreen}
        options={{ tabBarIcon: () => <Icon name="file-document" size={24} /> }} />
      <Tab.Screen name="Profile" component={WorkerProfileScreen}
        options={{ tabBarIcon: () => <Icon name="account" size={24} /> }} />
    </Tab.Navigator>
  );
}
