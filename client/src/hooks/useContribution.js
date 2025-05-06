import { useContext } from "react";
import { ContributionContext } from "../context/ContributionProvider";

const useContribution = () => {
  return useContext(ContributionContext);
};

export default useContribution;
