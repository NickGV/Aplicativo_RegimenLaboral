import React, { createContext, useState, useEffect } from "react";
import {
  createContribution,
  listContributions,
  getContribution,
  updateContribution,
  deleteContribution,
} from "../services/contributionService";
import useAuth from "../hooks/useAuth";

export const ContributionContext = createContext();

export const ContributionProvider = ({ children }) => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateContribution = async (contributionData) => {
    try {
      setLoading(true);
      const newContribution = await createContribution(contributionData);
      setContributions((prevContributions) => [...prevContributions, newContribution]);
      setError(null);
      return newContribution;
    } catch (error) {
      setError(error.response?.data || error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGetContributions = async () => {
    try {
      setLoading(true);
      const data = await listContributions();
      setContributions(data);
      setError(null);
      return data;
    } catch (error) {
      setError(error.response?.data || error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      handleGetContributions();
    }
  }, [user]);

  const handleGetContributionDetail = async (id) => {
    try {
      setLoading(true);
      const contributionData = await getContribution(id);
      return contributionData;
    } catch (error) {
      setError(error.response?.data || error);
      return null;
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
      return updatedContribution;
    } catch (error) {
      setError(error.response?.data || error);
      return null;
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
      return true;
    } catch (error) {
      setError(error.response?.data || error);
      return false;
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
