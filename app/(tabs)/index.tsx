import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import CalendarPage from '../../screens/CalendarPage';
import MainPage from '../../screens/MainPage';

const Tab = createMaterialTopTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: true }}
      tabBar={() => null} // Hides the top tab bar
    >
      <Tab.Screen name="Home" component={MainPage} />
      <Tab.Screen name="Calendar" component={CalendarPage} />
      {/* Add more pages here */}
    </Tab.Navigator>
  );
}