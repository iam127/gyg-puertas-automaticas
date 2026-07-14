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
  getMyProfile: async (userId?: number): Promise<Tecnico> => {
    const response = await api.get<Tecnico>('/tecnicos/mi_perfil/');
    return response.data;
  },
};

export default TecnicoService;
