import React, { createContext, useState, useEffect } from "react";
import {
  createContract,
  getContracts,
  getContractDetail,
  updateContract,
  terminateContract,
} from "../services/contractsService";
import useAuth from "../hooks/useAuth";
import useContribution from "../hooks/useContribution"; // <-- hook para crear contribuciones

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const { user } = useAuth();
  const { handleCreateContribution } = useContribution(); // <-- método para crear una contribución
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Genera una o varias contribuciones a partir del salario del contrato.
   * Ajusta esta función para calcular los valores que necesites (p.ej. salud, pensión, etc.).
   * Aquí como ejemplo simple: crea una única contribución equivalente al 10% del salario.
   */
  const generateContributionsFromSalary = (contract) => {
    const salary = contract.salary;
    if (!salary) return [];

    // Ejemplo: 10% del salario como contribución única
    const baseAmount = salary * 0.1;
    return [
      {
        contractId: contract.id,
        amount: baseAmount,
        // suponiendo que la contribución se crea en la fecha actual
        date: new Date().toISOString().split("T")[0],
        // puedes agregar otros campos necesarios, por ejemplo:
        // type: "Pensión", ...
      },
    ];
  };

  const handleGetContracts = async () => {
    setLoading(true);
    try {
      const data = await getContracts();
      setContracts(data);
      setError(null);
      // Si quisieras generar contribuciones para cada contrato al traer la lista,
      // podrías iterar aquí sobre data. Por ejemplo:
      //
      // for (const contract of data) {
      //   const contributions = generateContributionsFromSalary(contract);
      //   for (const contrib of contributions) {
      //     await handleCreateContribution(contrib);
      //   }
      // }
      //
      // Pero en este ejemplo dejaremos la generación al obtener el detalle o al crear.
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

      // Una vez creado el contrato, generar contribuciones en base al salario
      const contributions = generateContributionsFromSalary(newContract);
      for (const contrib of contributions) {
        await handleCreateContribution(contrib);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleGetContractDetail = async (id) => {
    try {
      const detail = await getContractDetail(id);
      setSelectedContract(detail);
      setError(null);

      // Al obtener el detalle, generar contribuciones basadas en el salario
      const contributions = generateContributionsFromSalary(detail);
      for (const contrib of contributions) {
        await handleCreateContribution(contrib);
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

      // Si el salario cambió, podrías volver a generar las contribuciones.
      // Por ejemplo, si updatedData.salary existe y es distinto:
      if (updatedData.salary) {
        // Primero, podrías eliminar o marcar como inválidas las contribuciones anteriores
        // asociadas a este contrato, dependiendo de tu lógica de negocio.
        // Luego, vuelves a generarlas:
        const contributions = generateContributionsFromSalary(updated);
        for (const contrib of contributions) {
          await handleCreateContribution(contrib);
        }
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleTerminateContract = async (id, terminationDate) => {
    try {
      await terminateContract(id, terminationDate);
      setContracts((prev) => prev.filter((contract) => contract.id !== id));
      setError(null);
      // Aquí podrías, si hace falta, marcar las contribuciones pendientes o relacionadas como "finalizadas"
      // o bien no hacer nada si tu backend ya se encarga de eso.
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
