import axios from "axios";

const API_URL = "http://localhost:8000/api/contributions/";

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
    const response = await axios.post(
      `${API_URL}create/`, 
      contributionData, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const listContributions = async () => {
  try {
    const response = await axios.get(
      API_URL, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error){
    throw error.response?.data || error;
  }
};

export const getContribution = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteContribution = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}${id}/delete/`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateContribution = async (id, contributionData) => {
  try {
    const response = await axios.put(
      `${API_URL}${id}/update/`, 
      contributionData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};



