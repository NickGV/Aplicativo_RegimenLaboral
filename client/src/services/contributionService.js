import axios from "axios";

const API_URL = "localhost:8000/api/contributions/";

export const createContribution = async (contributionData) => {
  try {
    const response = await axios.post(API_URL, contributionData);
    return response.data; // Devuelve la contribución creada
  } catch (error) {
    throw error.response.data; // Maneja el error
  }
};

export const getContributions = async () => {
  try {
    return;
  } catch (error) {
    return;
  }
};

export const getContributionDetail = async (id) => {
  try {
    return;
  } catch (error) {
    return;
  }
};
