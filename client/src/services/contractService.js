import axios from "axios";

const API_URL = "localhost:8000/api/contracts/";

export const createContract = async (contractData) => {
  try {
    const response = await axios.post(API_URL, contractData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getContracts = async () => {
  try {
    return;
  } catch (error) {
    return;
  }
};

export const getContractDetail = async (id) => {
  try {
    return;
  } catch (error) {
    return;
  }
};
