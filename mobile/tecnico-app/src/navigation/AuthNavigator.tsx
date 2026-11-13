import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation.types';
import InvitationCodeScreen from '../screens/auth/InvitationCodeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import COLORS from '../constants/colors';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.BG_DARK },
      }}
    >
      <Stack.Screen name="InvitationCode" component={InvitationCodeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
