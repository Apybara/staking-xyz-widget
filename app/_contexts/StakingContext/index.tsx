import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useStakingProcedures } from "../../_services/stake/hooks";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { useInputStates } from "../../_components/AmountInputPad/hooks";
import { useStakeAmountInputValidation, useStakeFees } from "./hooks";

const StakingContext = createContext({} as T.StakingContext);

export const useStaking = () => useContext(StakingContext);

export const StakingProvider = ({ children }: T.StakingProviderProps) => {
  const [states, setStates] = useReducer<T.UseStakingReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const { amountValidation, ctaValidation } = useStakeAmountInputValidation({ inputAmount: states.coinAmountInput });
  const stakeFees = useStakeFees({ inputAmount: states.coinAmountInput });
  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: network || "celestia",
    wallet: activeWallet,
  });
  const { procedures, resetStates } = useStakingProcedures({
    address,
    cosmosSigningClient,
    network: network || "celestia",
    amount: states.coinAmountInput,
  });
  const amountInputPad = useInputStates();

  return (
    <StakingContext.Provider
      value={{
        ...states,
        inputState: amountValidation,
        ctaState: ctaValidation,
        stakeFees,
        procedures,
        amountInputPad,
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
  coinAmountInput: "",
  stakeFees: undefined,
  inputState: "empty",
  ctaState: "empty",
  procedures: undefined,
  cosmosSigningClient: null,
  amountInputPad: {
    primaryValue: "",
    secondaryValue: "",
    primaryCurrency: "USD",
    secondaryCurrency: "TIA",
    setPrimaryValue: () => {},
    onSwap: () => {},
    onMax: () => {},
  },
  resetProceduresStates: () => {},
  setStates: () => {},
};
