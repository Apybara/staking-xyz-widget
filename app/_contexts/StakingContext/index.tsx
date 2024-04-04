import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useStakingProcedures } from "../../_services/stake/hooks";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { useStakeAmountInputValidation, useDenomStakeFees } from "./hooks";

const StakingContext = createContext({} as T.StakingContext);

export const useStaking = () => useContext(StakingContext);

export const StakingProvider = ({ children }: T.StakingProviderProps) => {
  const [states, setStates] = useReducer<T.UseStakingReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  const { network } = useShell();
  const { amountValidation, ctaValidation } = useStakeAmountInputValidation({ inputAmount: states.denomAmountInput });
  const denomStakeFees = useDenomStakeFees({ inputAmount: states.denomAmountInput });
  const { data: cosmosSigningClient } = useCosmosSigningClient({ network: network || "celestia" });
  const { procedures, resetStates } = useStakingProcedures({ cosmosSigningClient, network: network || "celestia" });

  return (
    <StakingContext.Provider
      value={{
        ...states,
        inputState: amountValidation,
        ctaState: ctaValidation,
        denomStakeFees,
        procedures,
        cosmosSigningClient: cosmosSigningClient || null,
        resetProceduresStates: resetStates,
        setStates,
      }}
    >
      {children}
    </StakingContext.Provider>
  );
};

const initialStates: T.StakingContext = {
  denomAmountInput: "",
  denomStakeFees: undefined,
  inputState: "empty",
  ctaState: "empty",
  procedures: undefined,
  cosmosSigningClient: null,
  resetProceduresStates: () => {},
  setStates: () => {},
};
