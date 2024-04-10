import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { useUnstakingProcedures, useStakedBalance, useUnbondingDelegations } from "../../_services/unstake/hooks";
import { useInputStates } from "../../_components/AmountInputPad/hooks";
import { useUnstakeAmountInputValidation } from "./hooks";

const UnstakingContext = createContext({} as T.UnstakingContext);

export const useUnstaking = () => useContext(UnstakingContext);

export const UnstakingProvider = ({ children }: T.UnstakingProviderProps) => {
  const [states, setStates] = useReducer<T.UseUnstakingReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const stakedBalance = useStakedBalance();
  const unbondingDelegations = useUnbondingDelegations();
  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: network || "celestia",
    wallet: activeWallet,
  });
  const { amountValidation, ctaValidation } = useUnstakeAmountInputValidation({
    inputAmount: states.coinAmountInput,
    stakedBalance: stakedBalance?.stakedBalance,
  });
  const { procedures, resetStates } = useUnstakingProcedures({
    address,
    cosmosSigningClient,
    network: network || "celestia",
    amount: states.coinAmountInput,
  });
  const amountInputPad = useInputStates();

  return (
    <UnstakingContext.Provider
      value={{
        ...states,
        inputState: amountValidation,
        ctaState: ctaValidation,
        procedures,
        amountInputPad,
        stakedBalance: {
          data: stakedBalance?.stakedBalance,
          isLoading: stakedBalance?.isLoading || false,
          error: stakedBalance?.error || null,
        },
        unbondingDelegations: {
          data: unbondingDelegations?.formatted,
          isLoading: unbondingDelegations?.isLoading || false,
          error: unbondingDelegations?.error || null,
        },
        cosmosSigningClient: cosmosSigningClient || null,
        resetProceduresStates: resetStates,
        setStates,
      }}
    >
      {children}
    </UnstakingContext.Provider>
  );
};

const initialStates: T.UnstakingContext = {
  coinAmountInput: "",
  inputState: "empty",
  ctaState: "empty",
  procedures: undefined,
  stakedBalance: {
    data: undefined,
    isLoading: false,
    error: null,
  },
  unbondingDelegations: {
    data: undefined,
    isLoading: false,
    error: null,
  },
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
