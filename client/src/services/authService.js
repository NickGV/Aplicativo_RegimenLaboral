import axios from "axios";

const API_URL = "localhost:8000/api/users/auth/";

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
    return;
  } catch (error) {
    return;
  }
};

export const listUsers = async () => {
  try {
    return;
  } catch (error) {
    return;
  }
};

export const userDetail = async (id) => {
  try {
    return;
  } catch (error) {
    return;
  }
};
