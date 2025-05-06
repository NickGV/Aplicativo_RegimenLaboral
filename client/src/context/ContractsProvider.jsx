import React, { createContext, useState } from "react";
import {
  createContract,
  getContracts,
  getContractDetail,
} from "../services/contractsService";

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);

  const handleCreateContract = async (contractData) => {
    try {
      const newContract = await createContract(contractData);
      setContracts((prevContracts) => [...prevContracts, newContract]);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleGetContracts = async () => {
    try {
      return;
    } catch (err) {
      return;
    }
  };

  const handleGetContractDetail = async (id) => {
    try {
      return;
    } catch (err) {
      return;
    }
  };

  return (
    <ContractContext.Provider
      value={{
        contracts,
        error,
        handleCreateContract,
        handleGetContracts,
        handleGetContractDetail,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
