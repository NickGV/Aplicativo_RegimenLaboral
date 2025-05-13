import React, { createContext, useState, useEffect } from "react";
import {
  createContract,
  getContracts,
  getContractDetail,
  updateContract,
  terminateContract,
} from "../services/contractsService";
import useAuth from "../hooks/useAuth";

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetContracts = async () => {
    setLoading(true);
    try {
      const data = await getContracts();
      setContracts(data);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async (contractData) => {
    try {
      const newContract = await createContract(contractData);
      setContracts((prev) => [...prev, newContract]);
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  const handleGetContractDetail = async (id) => {
    try {
      const detail = await getContractDetail(id);
      setSelectedContract(detail);
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdateContract = async (id, updatedData) => {
    try {
      const updated = await updateContract(id, updatedData);
      setContracts((prev) =>
        prev.map((contract) => (contract.id === id ? updated : contract))
      );
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  const handleTerminateContract = async (id, terminationDate) => {
    try {
      await terminateContract(id, terminationDate);
      setContracts((prev) => prev.filter((contract) => contract.id !== id));
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Token found, fetching contracts...");
      handleGetContracts();
    }
  }, [user]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        selectedContract,
        loading,
        error,
        handleGetContracts,
        handleCreateContract,
        handleGetContractDetail,
        handleUpdateContract,
        handleTerminateContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
