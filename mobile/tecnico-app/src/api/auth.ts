import api from './config';
import { AuthResponse } from '../types/auth.types';

export const AuthService = {
  verifyInvitationCode: async (code: string): Promise<{ valido: boolean; registrado: boolean; mensaje: string }> => {
    try {
      const response = await api.post('/tecnicos/verificar_codigo/', { codigo_invitacion: code });
      return { valido: true, registrado: false, mensaje: response.data.mensaje };
    } catch (error: any) {
      const statusCode = error.response?.status;
      return {
        valido: false,
        registrado: statusCode === 409,
        mensaje: error.response?.data?.mensaje || 'Código inválido o ya utilizado'
      };
    }
  },

  registerTechnician: async (data: any): Promise<void> => {
    await api.post('/tecnicos/registro/', {
      username: data.username,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      telefono: data.telefono,
      codigo_invitacion: data.codigo,
    });
  },

  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/token/', {
      username: credentials.username,
      password: credentials.password,
    });
    return response.data;
  },
};

export default AuthService;