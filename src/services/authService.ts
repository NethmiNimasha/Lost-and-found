import api from './api';
import type { AuthResponse } from '../types';

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  register: async (userData: any): Promise<any> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  }
};
