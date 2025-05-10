import axios from "axios";

const API_URL = "localhost:8000/api/contributions/";

export const createContribution = async (contributionData) => {
  try {
    const response = await axios.post(`${API_URL}create/`, contributionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const listcontribution = async (contributionData) => {
  try {
    const response = await axios.post(`${API_URL}list/`, contributionData);
    return response.data;
  } catch (error){
    throw error.response.data;
  }
};

export const getContribution = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateContribution = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteContribution = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


