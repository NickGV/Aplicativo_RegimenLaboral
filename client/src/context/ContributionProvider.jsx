import React, { createContext, useState } from "react";
import {
  createContribution,
  getContributions,
  getContributionDetail,
} from "../services/contributionService";

export const ContributionContext = createContext();

export const ContributionProvider = ({ children }) => {
  const [contributions, setContributions] = useState([]);
  const [error, setError] = useState(null);

  const handleCreateContribution = async (contributionData) => {
    try {
      const newContribution = await createContribution(contributionData);
      setContributions((prevContributions) => [
        ...prevContributions,
        newContribution,
      ]);
      setError(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleGetContributions = async () => {
    try {
      return;
    } catch (err) {
      return;
    }
  };

  const handleGetContributionDetail = async (id) => {
    try {
      return;
    } catch (err) {
      return;
    }
  };

  return (
    <ContributionContext.Provider
      value={{
        contributions,
        error,
        handleCreateContribution,
        handleGetContributions,
        handleGetContributionDetail,
      }}
    >
      {children}
    </ContributionContext.Provider>
  );
};
