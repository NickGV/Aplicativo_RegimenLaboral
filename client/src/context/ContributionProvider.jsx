import React, { createContext, useState } from "react";
import {
  createContribution,
  listContribution,
  getContribution,
  updateContribution,
  deleteContribution,
} from "../services/contributionService";

export const ContributionContext = createContext();

export const ContributionProvider = ({ children }) => {
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateContribution = async (contributionData) => {
    try {
      setLoading(true);
      const newContribution = await createContribution(contributionData);
      setContributions((prevContributions) => [...prevContributions, newContribution]);
      setError(null);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleGetContributions = async () => {
    try {
      setLoading(true);
      const contributionsData = await listContribution();
      setContributions(contributionsData);
      setError(null);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleGetContributionDetail = async (id) => {
    try {
      setLoading(true);
      const contributionData = await getContribution(id);
      return contributionData;
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContribution = async (id, contributionData) => {
    try {
      setLoading(true);
      const updatedContribution = await updateContribution(id, contributionData);
      setContributions((prevContributions) =>
        prevContributions.map((contribution) =>
          contribution.id === id ? updatedContribution : contribution
        )
      );
      setError(null);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContribution = async (id) => {
    try {
      setLoading(true);
      await deleteContribution(id);
      setContributions((prevContributions) =>
        prevContributions.filter((contribution) => contribution.id !== id)
      );
      setError(null);
    } catch (error) {
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContributionContext.Provider
      value={{
        contributions,
        error,
        loading,
        handleCreateContribution,
        handleGetContributions,
        handleGetContributionDetail,
        handleUpdateContribution,
        handleDeleteContribution,
      }}
    >
      {children}
    </ContributionContext.Provider>
  );
};