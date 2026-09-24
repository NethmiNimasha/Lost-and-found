import api from './api';
import type { Item } from '../types';

export const itemService = {
  getAllItems: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data;
  },

  getItemById: async (id: number): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  createItem: async (itemData: any): Promise<Item> => {
    const payload = {
      title: itemData.name || itemData.title,
      name: itemData.name || itemData.title,
      description: itemData.description,
      location: itemData.location,
      contactInfo: itemData.contactInfo,
      status: itemData.status
    };
    const response = await api.post('/items', payload);
    return response.data;
  },

  updateItem: async (id: number, itemData: Partial<Item>): Promise<Item> => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
  }
};
