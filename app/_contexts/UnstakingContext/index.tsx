import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { useTxProcedure } from "@/app/_services/txProcedure/hooks";
import { getIsAleoNetwork } from "../../_services/aleo/utils";
import { usePAleoBalanceByAddress } from "../../_services/aleo/hooks";
import { useStakedBalance } from "../../_services/stakingOperator/hooks";
import { useInputStates } from "../../_components/AmountInputPad/hooks";
import { defaultGlobalCurrency, defaultNetwork } from "../../consts";
import { useUnstakeAmountInputValidation, useUnstakeInputErrorMessage } from "./hooks";

const UnstakingContext = createContext({} as T.UnstakingContext);

export const useUnstaking = () => useContext(UnstakingContext);

export const UnstakingProvider = ({ children }: T.UnstakingProviderProps) => {
  const [states, setStates] = useReducer<T.UseUnstakingReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  const { network, stakingType } = useShell();
  const { activeWallet, address } = useWallet();

  const defaultStakedBalance = useStakedBalance();
  const pAleoBalance = usePAleoBalanceByAddress({
    address: address || undefined,
    network: network,
  });
  const isAleoNetwork = network && getIsAleoNetwork(network);
  const stakedBalance = isAleoNetwork && stakingType === "liquid" ? pAleoBalance : defaultStakedBalance;

  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: network || defaultNetwork,
    wallet: activeWallet,
  });
  const { amountValidation, ctaValidation } = useUnstakeAmountInputValidation({
    inputAmount: states.coinAmountInput,
    stakedBalance: stakedBalance?.stakedBalance,
  });
  const inputErrorMessage = useUnstakeInputErrorMessage({ amountValidation, inputAmount: states.coinAmountInput });
  const { procedures, resetStates } = useTxProcedure({
    address,
    network: network || defaultNetwork,
    wallet: activeWallet,
    amount: states.coinAmountInput || "",
    type: states.instantWithdrawal ? "instant_undelegate" : "undelegate",
    instantWithdrawal: states.instantWithdrawal,
  });
  const amountInputPad = useInputStates();

  return (
    <UnstakingContext.Provider
      value={{
        ...states,
        inputState: amountValidation,
        ctaState: ctaValidation,
        inputErrorMessage,
        procedures,
        amountInputPad,
        stakedBalance: {
          data: stakedBalance?.stakedBalance,
          isLoading: stakedBalance?.isLoading || false,
          error: stakedBalance?.error || null,
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
  instantWithdrawal: false,
  coinAmountInput: "",
  inputState: "empty",
  ctaState: "empty",
  inputErrorMessage: undefined,
  procedures: undefined,
  stakedBalance: {
    data: undefined,
    isLoading: false,
    error: null,
  },
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
