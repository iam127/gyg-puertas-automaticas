import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppTabParamList, AssignmentsStackParamList } from '../types/navigation.types';
import COLORS from '../constants/colors';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import AssignmentsScreen from '../screens/assignments/AssignmentsScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import UpdateStatusScreen from '../screens/assignments/UpdateStatusScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createStackNavigator<AssignmentsStackParamList>();

// Nested stack navigator for assignments flow
const AssignmentsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.BG_DARK },
      }}
    >
      <Stack.Screen name="Assignments" component={AssignmentsScreen} />
      <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} />
      <Stack.Screen name="UpdateStatus" component={UpdateStatusScreen} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.CARD_DARK,
          borderTopColor: COLORS.BORDER_DARK,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.PRIMARY_GOLD,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ color, focused }) => {
          let iconText = '';
          if (route.name === 'HomeTab') {
            iconText = '🏠';
          } else if (route.name === 'AssignmentsTab') {
            iconText = '📋';
          } else if (route.name === 'HistoryTab') {
            iconText = '📜';
          } else if (route.name === 'ProfileTab') {
            iconText = '👤';
          }
          return (
            <Text style={[styles.iconText, { color, opacity: focused ? 1 : 0.6 }]}>
              {iconText}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Inicio' }} 
      />
      <Tab.Screen 
        name="AssignmentsTab" 
        component={AssignmentsStackNavigator} 
        options={{ title: 'Asignaciones' }} 
      />
      <Tab.Screen 
        name="HistoryTab" 
        component={HistoryScreen} 
        options={{ title: 'Historial' }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ title: 'Mi Perfil' }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconText: {
    fontSize: 20,
  },
});

export default AppNavigator;
