import api from './config';
import { Tecnico } from '../types/auth.types';

export const TecnicoService = {
  /**
   * Fetches all technicians from the Django database
   */
  getTecnicos: async (): Promise<Tecnico[]> => {
    const response = await api.get<Tecnico[]>('/tecnicos/');
    return response.data;
  },

  /**
   * Helper to locate the logged-in technician profile based on the decoded JWT user ID
   */
  getMyProfile: async (userId: number): Promise<Tecnico> => {
    const tecnicos = await TecnicoService.getTecnicos();
    const myProfile = tecnicos.find((t) => t.usuario.id === userId);
    if (!myProfile) {
      throw new Error('No se encontró el perfil de técnico asociado con este usuario.');
    }
    return myProfile;
  },
};

export default TecnicoService;
