// app/EmployerTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EmployeesScreen from '../screens/employer/EmployeesScreen';
import AddJobScreen from '../screens/employer/AddJobScreen';
import JobsPostedScreen from '../screens/employer/JobsPostedScreen';
import EmployerProfileScreen from '../screens/employer/EmployerProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
export default function EmployerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Employees" component={EmployeesScreen}
        options={{ tabBarIcon: () => <Icon name="account-group" size={24} /> }} />
      <Tab.Screen name="AddJob" component={AddJobScreen}
        options={{ tabBarIcon: () => <Icon name="plus-box" size={24} /> }} />
      <Tab.Screen name="JobsPosted" component={JobsPostedScreen}
        options={{ tabBarIcon: () => <Icon name="briefcase" size={24} /> }} />
      <Tab.Screen name="Profile" component={EmployerProfileScreen}
        options={{ tabBarIcon: () => <Icon name="account" size={24} /> }} />
    </Tab.Navigator>
  );
}
