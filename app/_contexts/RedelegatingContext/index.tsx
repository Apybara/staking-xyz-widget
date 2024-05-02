import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useRedelegatingProcedures } from "../../_services/redelegate/hooks";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { defaultNetwork } from "../../consts";
import { useRedelegateValidation, useStakeFees } from "./hooks";

const RedelegatingContext = createContext({} as T.RedelegatingContext);

export const useRedelegating = () => useContext(RedelegatingContext);

export const RedelegatingProvider = ({ children }: T.RedelegatingProviderProps) => {
  const [states, setStates] = useReducer<T.UseRedelegatingReducer>(
    (prev, next) => ({ ...prev, ...next }),
    initialStates,
  );

  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const { ctaValidation } = useRedelegateValidation({
    isAgreementChecked: states.isAgreementChecked,
    amount: states.redelegateAmount,
  });
  const stakeFees = useStakeFees({ inputAmount: states.redelegateAmount });
  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: network || defaultNetwork,
    wallet: activeWallet,
  });
  const { procedures, resetStates } = useRedelegatingProcedures({
    address,
    cosmosSigningClient,
    network: network || defaultNetwork,
    amount: states.redelegateAmount,
  });

  return (
    <RedelegatingContext.Provider
      value={{
        ...states,
        ctaState: ctaValidation,
        stakeFees,
        procedures,
        cosmosSigningClient: cosmosSigningClient || null,
        resetProceduresStates: resetStates,
        setStates,
      }}
    >
      {children}
    </RedelegatingContext.Provider>
  );
};

const initialStates: T.RedelegatingContext = {
  isAgreementChecked: false,
  redelegateAmount: "1000",
  stakeFees: undefined,
  ctaState: "invalid",
  procedures: undefined,
  cosmosSigningClient: null,
  resetProceduresStates: () => {},
  setStates: () => {},
};
