import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useStakeAmountInputValidation, useDenomStakeFees } from "./hooks";

const StakingContext = createContext({} as T.StakingContext);

export const useStaking = () => useContext(StakingContext);

export const StakingProvider = ({ children }: T.StakingProviderProps) => {
  const [states, setStates] = useReducer<T.UseStakingReducer>((prev, next) => ({ ...prev, ...next }), initialStates);

  const { amountValidation, ctaValidation } = useStakeAmountInputValidation({ inputAmount: states.denomAmountInput });
  const denomStakeFees = useDenomStakeFees({ inputAmount: states.denomAmountInput });

  return (
    <StakingContext.Provider
      value={{
        ...states,
        inputState: amountValidation,
        ctaState: ctaValidation,
        denomStakeFees,
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
  setStates: () => {},
};
