import axios from "axios";

const API_URL = "http://localhost:8000/api/contracts/";

// Obtener token de localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createContract = async (contractData) => {
  try {
    const response = await axios.post(
      `${API_URL}create/`,
      contractData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getContracts = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getContractDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateContract = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}${id}/update/`,
      updatedData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const terminateContract = async (id, terminationDate) => {
  try {
    const response = await axios.delete(
      `${API_URL}${id}/terminate/`,
      {
        ...getAuthHeaders(),
        data: { termination_date: terminationDate },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
