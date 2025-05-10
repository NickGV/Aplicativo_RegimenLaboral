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
    console.log(credentials);
    const response = await axios.post(`${API_URL}login/`, credentials);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
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
