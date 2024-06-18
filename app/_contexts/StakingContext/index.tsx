import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useTxProcedure } from "@/app/_services/txProcedure/hooks";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { useInputStates } from "../../_components/AmountInputPad/hooks";
import { defaultGlobalCurrency, defaultNetwork } from "../../consts";
import { useStakeAmountInputValidation } from "./hooks";

const StakingContext = createContext({} as T.StakingContext);

export const useStaking = () => useContext(StakingContext);

export const StakingProvider = ({ children }: T.StakingProviderProps) => {
  const [states, setStates] = useReducer<T.UseStakingReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const { amountValidation, ctaValidation } = useStakeAmountInputValidation({ inputAmount: states.coinAmountInput });
  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: network || defaultNetwork,
    wallet: activeWallet,
  });
  const { procedures, resetStates } = useTxProcedure({
    address,
    network: network || defaultNetwork,
    wallet: activeWallet,
    amount: states.coinAmountInput || "",
    type: "delegate",
  });
  const amountInputPad = useInputStates();

  return (
    <StakingContext.Provider
      value={{
        ...states,
        inputState: amountValidation,
        ctaState: ctaValidation,
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
  inputState: "empty",
  ctaState: "empty",
  procedures: undefined,
  cosmosSigningClient: null,
  amountInputPad: {
    primaryValue: "",
    secondaryValue: "",
    primaryCurrency: defaultGlobalCurrency,
    secondaryCurrency: "USD",
    setPrimaryValue: () => {},
    onSwap: () => {},
    onMax: () => {},
  },
  resetProceduresStates: () => {},
  setStates: () => {},
};
