import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  InvitationCode: undefined;
  Register: { codigo: string };
};

export type AssignmentsStackParamList = {
  Assignments: undefined;
  AssignmentDetail: { id: number; type: 'mantenimiento' | 'cotizacion' };
  UpdateStatus: { 
    id: number; 
    type: 'mantenimiento' | 'cotizacion'; 
    currentStatus: string; 
    visitaId: number 
  };
};

export type AppTabParamList = {
  HomeTab: undefined;
  AssignmentsTab: NavigatorScreenParams<AssignmentsStackParamList>;
  HistoryTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};
