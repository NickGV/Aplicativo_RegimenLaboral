import axios from "axios";

const API_URL = "https://localhost:8000/api/contributions/";

export const createContribution = async (contributionData) => {
  try {
    const response = await axios.post(API_URL, contributionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getContributions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getContributionDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}`);
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

export const deleteContribution = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};