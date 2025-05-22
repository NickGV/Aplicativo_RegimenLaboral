import React, { createContext, useState, useEffect } from "react";
import {
  createContract,
  getContracts,
  getContractDetail,
  updateContract,
  terminateContract,
} from "../services/contractsService";
import useAuth from "../hooks/useAuth";
// Importamos directamente el servicio en lugar del hook
import { createContribution } from "../services/contributionService";

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const { user } = useAuth();
  // Ya no usamos el hook de contribución, ahora usamos directamente el servicio
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);   const generateContributionsFromSalary = (contract) => {
    const salary = parseFloat(contract.salario || 0);
    if (!salary) return [];
      const eps = parseFloat((salary * 0.085).toFixed(2))
      const arl = parseFloat((salary * 0.00522).toFixed(2))
      const pension = parseFloat((salary * 0.12).toFixed(2))
      const cesantias = parseFloat((salary * 0.0833).toFixed(2))
      const total = parseFloat((salary * (0.085 + 0.00522 + 0.12 + 0.0833)).toFixed(2))

    return [
      {
        contrato: contract.id,
        salario_base: parseFloat(salary.toFixed(2)),
        eps: eps,
        arl: arl,
        pension: pension,
        cesantias: cesantias,
        total: total
      }
    ];
  };

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
    console.log("Creating contract with data:", contractData);
    if (!contractData) {
      console.error("No contract data provided");
      return;
    }
    try {
      const newContract = await createContract(contractData);
      setContracts((prev) => [...prev, newContract]);
      setError(null);     
      
      const contributions = generateContributionsFromSalary(newContract);
      for (const contrib of contributions) {
        try {
          await createContribution(contrib);
        } catch (contribError) {
          console.error("Error creating contribution:", contribError);
        }
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleGetContractDetail = async (id) => {
    try {
      const detail = await getContractDetail(id);
      setSelectedContract(detail);
      setError(null);      // Al obtener el detalle, generar contribuciones basadas en el salario
      const contributions = generateContributionsFromSalary(detail);
      for (const contrib of contributions) {
        try {
          await createContribution(contrib);
        } catch (contribError) {
          console.error("Error creating contribution:", contribError);
        }
      }
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

      if (updatedData.salary) {
        const contributions = generateContributionsFromSalary(updated);
        for (const contrib of contributions) {
          try {
            await createContribution(contrib);
          } catch (contribError) {
            console.error("Error creating contribution:", contribError);
          }
        }
      }
    } catch (error) {
      setError(error);
    }
  };

 const handleTerminateContract = async (id, terminationDate) => {
  if (user.rol !== 'empleador') {
    console.error('No tienes permisos para realizar esta acción');
    return false;
  }
  try {
    await terminateContract(id, terminationDate);
    return true;
  } catch (error) {
    return false;
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
