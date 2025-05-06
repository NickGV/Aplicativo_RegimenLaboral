import { useContext } from "react";
import { ContributionContext } from "./ContributionProvider";

const useContribution = () => {
  return useContext(ContributionContext);
};

export default useContribution;
