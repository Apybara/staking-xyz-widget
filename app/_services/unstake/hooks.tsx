import type { SigningStargateClient } from "@cosmjs/stargate";
import type { Network } from "../../types";
import type { UnstakeProcedure, UnstakeProcedureState } from "./types";
import { useEffect, useState } from "react";
import { useCosmosUnstakingProcedures } from "../cosmos/hooks";

export const useUnstakingProcedures = ({
  address,
  amount,
  network,
  cosmosSigningClient,
}: {
  address: string | null;
  amount: string;
  network: Network;
  cosmosSigningClient?: SigningStargateClient;
}) => {
  const [procedures, setProcedures] = useState<Array<UnstakeProcedure> | undefined>(undefined);
  const authState = useProcedureStates();
  const undelegateState = useProcedureStates();

  const {
    baseProcedures: cosmosBaseProcedures,
    isAuthApproved,
    authTxHash,
    refetchAuthCheck,
  } = useCosmosUnstakingProcedures({
    amount,
    network,
    address,
    cosmosSigningClient,
    authStep: {
      onLoading: () => {
        authState.setState("loading");
        authState.setTxHash(undefined);
        authState.setError(null);
      },
      onSuccess: (txHash) => {
        authState.setState("success");
        authState.setTxHash(txHash);
        undelegateState.setState("active");
      },
      onError: (e) => {
        console.error(e);
        authState.setState("error");
        authState.setError(e);
      },
    },
    undelegateStep: {
      onLoading: () => {
        undelegateState.setState("loading");
        undelegateState.setTxHash(undefined);
        undelegateState.setError(null);
      },
      onSuccess: (txHash) => {
        undelegateState.setState("success");
        undelegateState.setTxHash(txHash);
      },
      onError: (e) => {
        console.error(e);
        undelegateState.setState("error");
        undelegateState.setError(e);
      },
    },
  }) || {};

  const updateStates = () => {
    if (cosmosBaseProcedures?.length) {
      authState.setState(isAuthApproved ? "success" : "active");
      authState.setTxHash(isAuthApproved && authTxHash ? authTxHash : undefined);
      authState.setError(null);
      undelegateState.setState(!isAuthApproved ? "idle" : "active");
      undelegateState.setTxHash(undefined);
      undelegateState.setError(null);
    }
  };

  useEffect(() => {
    if (!address) {
      setProcedures(undefined);
      authState.setState(null);
      authState.setTxHash(undefined);
      authState.setError(null);
      undelegateState.setState(null);
      undelegateState.setTxHash(undefined);
      undelegateState.setError(null);
    }
  }, [address]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length && authState.state === null && undelegateState.state === null) {
      updateStates();
    }
  }, [cosmosBaseProcedures?.length]);

  useEffect(() => {
    updateStates();
  }, [isAuthApproved, authTxHash]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length) {
      const proceduresArray = cosmosBaseProcedures
        .map((procedure) => {
          if (procedure.step === "auth") {
            return {
              ...procedure,
              state: authState.state,
              txHash: authState.txHash,
              error: authState.error,
              setState: authState.setState,
            };
          } else if (procedure.step === "undelegate") {
            return {
              ...procedure,
              state: undelegateState.state,
              txHash: undelegateState.txHash,
              error: undelegateState.error,
              setState: undelegateState.setState,
            } as UnstakeProcedure;
          }
        })
        .filter((procedure) => procedure !== undefined);

      setProcedures(proceduresArray as Array<UnstakeProcedure>);
    }
  }, [
    cosmosBaseProcedures?.length,
    authState.state,
    authState.txHash,
    authState.error,
    undelegateState.state,
    undelegateState.txHash,
    undelegateState.error,
  ]);

  return {
    procedures,
    resetStates: async () => {
      if (cosmosBaseProcedures?.length) {
        updateStates();
        await refetchAuthCheck?.();
      }
    },
  };
};

const useProcedureStates = () => {
  const [state, setState] = useState<UnstakeProcedureState | null>(null);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  return {
    state,
    txHash,
    error,
    setState,
    setTxHash,
    setError,
  };
};
