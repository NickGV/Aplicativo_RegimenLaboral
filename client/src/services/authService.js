import axios from "axios";

const API_URL = "http://localhost:8000/api/users/";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}login/`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Obtener el token de localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const listUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const userDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}users/${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}users/${id}/`, userData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}users/${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
