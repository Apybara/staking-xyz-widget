import * as T from "./types";
import { createContext, useContext, useReducer } from "react";
import { useShell } from "../ShellContext";
import { useWallet } from "../WalletContext";
import { useRedelegatingProcedures } from "../../_services/redelegate/hooks";
import { useCosmosSigningClient } from "../../_services/cosmos/hooks";
import { defaultNetwork } from "../../consts";
import { useRedelegateValidation } from "./hooks";
import { useExternalDelegations } from "@/app/_services/stakingOperator/hooks";

const RedelegatingContext = createContext({} as T.RedelegatingContext);

export const useRedelegating = () => useContext(RedelegatingContext);

export const RedelegatingProvider = ({ children }: T.RedelegatingProviderProps) => {
  const [states, setStates] = useReducer<T.UseRedelegatingReducer>(
    (prev, next) => ({ ...prev, ...next }),
    initialStates,
  );

  const { network } = useShell();
  const { activeWallet, address } = useWallet();
  const externalDelegations = useExternalDelegations();
  const { redelegationAmount } = externalDelegations?.data || {};
  const amount = redelegationAmount || "0";
  const { ctaValidation } = useRedelegateValidation({
    isAgreementChecked: states.isAgreementChecked,
  });
  const { data: cosmosSigningClient } = useCosmosSigningClient({
    network: network || defaultNetwork,
    wallet: activeWallet,
  });
  const { procedures, resetStates } = useRedelegatingProcedures({
    address,
    cosmosSigningClient,
    network: network || defaultNetwork,
    amount,
  });

  return (
    <RedelegatingContext.Provider
      value={{
        ...states,
        ctaState: ctaValidation,
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
  ctaState: "invalid",
  procedures: undefined,
  cosmosSigningClient: null,
  resetProceduresStates: () => {},
  setStates: () => {},
};
