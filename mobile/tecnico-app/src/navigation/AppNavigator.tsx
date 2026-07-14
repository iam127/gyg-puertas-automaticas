import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AppTabParamList, AssignmentsStackParamList } from '../types/navigation.types';
import COLORS from '../constants/colors';

import HomeScreen from '../screens/home/HomeScreen';
import AssignmentsScreen from '../screens/assignments/AssignmentsScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import UpdateStatusScreen from '../screens/assignments/UpdateStatusScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createStackNavigator<AssignmentsStackParamList>();

const AssignmentsStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: COLORS.BG_BASE } }}>
    <Stack.Screen name="Assignments" component={AssignmentsScreen} />
    <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} />
    <Stack.Screen name="UpdateStatus" component={UpdateStatusScreen} />
  </Stack.Navigator>
);

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const TAB_ICONS: Record<string, IconName> = {
  HomeTab:        'home',
  AssignmentsTab: 'assignment',
  HistoryTab:     'history',
  ProfileTab:     'person',
};

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor:   COLORS.PRIMARY_GOLD_DARK,
        tabBarInactiveTintColor: COLORS.TEXT_TERTIARY,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused, size }) => {
          const iconName = TAB_ICONS[route.name] ?? 'circle';
          return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <MaterialIcons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab"        component={HomeScreen}               options={{ title: 'Inicio' }} />
      <Tab.Screen name="AssignmentsTab" component={AssignmentsStackNavigator} options={{ title: 'Asignaciones' }} />
      <Tab.Screen name="HistoryTab"     component={HistoryScreen}            options={{ title: 'Historial' }} />
      <Tab.Screen name="ProfileTab"     component={ProfileScreen}            options={{ title: 'Mi Perfil' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.BG_SURFACE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SUBTLE,
    height: 68,
    paddingBottom: 10,
    paddingTop: 6,
    // Sombra sutil hacia arriba
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrap: {
    width: 40,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: COLORS.PRIMARY_GOLD_MUTED,
  },
});

export default AppNavigator;