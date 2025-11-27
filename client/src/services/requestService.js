// src/services/requestService.js
import api from './api';

export const getRequests = async () => {
  try {
    const response = await api.get('/solicitudes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw new Error(`Error ${error.response?.status}: ${error.response?.statusText}`);
  }
};

export const createRequest = async (requestData) => {
  try {
    const response = await api.post('/solicitudes/', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating request:', error);
    console.log('Server response:', error.response?.data);
    throw new Error(`Error al crear solicitud: Error ${error.response?.status}: ${error.response?.statusText}`);
  }
};

export const updateRequest = async (id, data) => {
  try {
    const response = await api.put(`/solicitudes/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};

export const deleteRequest = async (id) => {
  try {
    const response = await api.delete(`/solicitudes/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
};