import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:8000/api/users/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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
    const response = await api.post(`${API_URL}login/`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error durante el login:", error.response?.data || error.message);
    throw error.response?.data || { detail: "Error de conexión con el servidor" };
  }
};



export const listUsers = async () => {
  try {
    const response = await api.get(`${API_URL}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const userDetail = async (id) => {
  try {
    const response = await api.get(`${API_URL}users/${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`${API_URL}users/${id}/`, userData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`${API_URL}users/${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
