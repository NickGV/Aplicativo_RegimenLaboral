import { useContext } from "react";
import { ContractContext } from "../context/ContractsProvider";

const useContracts = () => {
  return useContext(ContractContext);
};

export default useContracts;