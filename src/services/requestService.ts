import api from './api';
import type { Request } from '../types';

export const requestService = {
  // Get requests for the logged-in user
  getMyRequests: async (): Promise<Request[]> => {
    const response = await api.get('/requests/my');
    return response.data;
  },

  // Admin: Get all requests
  getAllRequests: async (): Promise<Request[]> => {
    const response = await api.get('/requests');
    return response.data;
  },

  createRequest: async (requestData: Partial<Request>): Promise<Request> => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  updateRequestStatus: async (id: number, status: string): Promise<Request> => {
    const response = await api.patch(`/requests/${id}/status`, { status });
    return response.data;
  }
};
