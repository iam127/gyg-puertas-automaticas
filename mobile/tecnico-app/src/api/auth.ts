import api from './config';
import { AuthResponse } from '../types/auth.types';

export const AuthService = {
  /**
   * Cleversly verifies the invitation code by attempting a registration dry-run.
   * - If the code is invalid or used, Django returns a 400 error containing 'codigo_invitacion'.
   * - If the code is valid and unused, Django returns 400 errors for OTHER required fields but NOT for 'codigo_invitacion'.
   */
  verifyInvitationCode: async (code: string): Promise<{ valido: boolean; registrado: boolean; mensaje: string }> => {
    try {
      // Send a registration attempt with only the invitation code to trigger validation
      await api.post('/tecnicos/registro/', { codigo_invitacion: code });
      
      // If by any chance it returns 201 (which shouldn't happen without credentials), it's valid
      return { valido: true, registrado: false, mensaje: 'Código de invitación válido.' };
    } catch (error: any) {
      const errorData = error.response?.data;
      
      if (errorData && typeof errorData === 'object') {
        // If there is an explicit validation error for the invitation code
        if (errorData.codigo_invitacion) {
          const errorMsg = errorData.codigo_invitacion[0] || '';
          if (errorMsg.includes('ya fue usado') || errorMsg.includes('invalido')) {
            return { 
              valido: false, 
              registrado: true, // Mark as registered since it might have been consumed
              mensaje: 'El código de invitación ya fue utilizado o es inválido. Si ya tiene una cuenta, inicie sesión.' 
            };
          }
        }
        
        // If other fields are missing (e.g. username is required) but NO error on code, it is valid!
        if (errorData.username || errorData.password || errorData.email) {
          return { valido: true, registrado: false, mensaje: 'Código de invitación válido.' };
        }
      }
      
      return { 
        valido: false, 
        registrado: false, 
        mensaje: 'No se pudo verificar el código de invitación. Intente nuevamente.' 
      };
    }
  },

  /**
   * Registers a brand new technician in Django
   */
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

  /**
   * Obtains JWT tokens using standard user login credentials
   */
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/token/', {
      username: credentials.username,
      password: credentials.password,
    });
    return response.data;
  },
};

export default AuthService;
