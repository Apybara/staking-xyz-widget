import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useTxProcedure } from "@/app/_services/txProcedure/hooks";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { useInputStates } from "../../_components/AmountInputPad/hooks";
import { defaultGlobalCurrency, defaultNetwork } from "../../consts";
import { useStakeAmountInputValidation, useStakeInputErrorMessage } from "./hooks";
import { useSearchParams } from "next/navigation";
import { useDelegatedValidator, useValidatorDetails } from "@/app/_services/stakingOperator/hooks";

const StakingContext = createContext({} as T.StakingContext);

export const useStaking = () => useContext(StakingContext);

export const StakingProvider = ({ children }: T.StakingProviderProps) => {
  const [states, setStates] = useReducer<T.UseStakingReducer>((prev, next) => ({ ...prev, ...next }), initialStates);
  const { network } = useShell();
  const searchParams = useSearchParams();
  const { activeWallet, address } = useWallet();

  const validator = searchParams.get("validator");

  const { data: delegatedValidator } = useDelegatedValidator(address as string) || {};
  const { data: validatorDetails, isLoading: isLoadingValidatorDetails } =
    useValidatorDetails(validator as string) || {};

  const { amountValidation, ctaValidation } = useStakeAmountInputValidation({
    inputAmount: states.coinAmountInput,
    delegatedValidator,
    validatorDetails,
  });
  const inputErrorMessage = useStakeInputErrorMessage({ amountValidation });
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
        inputErrorMessage,
        procedures,
        amountInputPad,
        cosmosSigningClient: cosmosSigningClient || null,
        isLoadingValidatorDetails,
        validatorDetails,
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
  inputErrorMessage: undefined,
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
  isLoadingValidatorDetails: undefined,
  validatorDetails: null,
};
