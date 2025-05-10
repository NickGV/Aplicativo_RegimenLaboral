import axios from "axios";

const API_URL = "https://localhost:8000/api/contributions/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createContribution = async (contributionData) => {
  try {
    const response = await axios.post(`${API_URL}create/`, contributionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const listContribution = async (contributionData) => {
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


export const deleteContribution = async (id) => {
  try {

    const response = await axios.get(`${API_URL}${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const updateContribution = async (id, contributionData) => {
  try {
    const response = await axios.put(`${API_URL}${id}`, contributionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



