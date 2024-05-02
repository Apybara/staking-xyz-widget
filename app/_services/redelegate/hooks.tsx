import type { SigningStargateClient } from "@cosmjs/stargate";
import type { Network } from "../../types";
import type { RedelegateProcedure, RedelegateProcedureState } from "./types";
import { useEffect, useState } from "react";
import { useCosmosRedelegatingProcedures } from "../cosmos/hooks";

export const useRedelegatingProcedures = ({
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
  const [procedures, setProcedures] = useState<Array<RedelegateProcedure> | undefined>(undefined);
  const authState = useProcedureStates();
  const redelegateState = useProcedureStates();

  const {
    baseProcedures: cosmosBaseProcedures,
    isAuthApproved,
    authTxHash,
    refetchAuthCheck,
  } = useCosmosRedelegatingProcedures({
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
        redelegateState.setState("active");
      },
      onError: (e) => {
        console.error(e);
        authState.setState("error");
        authState.setError(e);
      },
    },
    redelegateStep: {
      onLoading: () => {
        redelegateState.setState("loading");
        redelegateState.setTxHash(undefined);
        redelegateState.setError(null);
      },
      onSuccess: (txHash) => {
        redelegateState.setState("success");
        redelegateState.setTxHash(txHash);
      },
      onError: (e) => {
        console.error(e);
        redelegateState.setState("error");
        redelegateState.setError(e);
      },
    },
  }) || {};

  useEffect(() => {
    if (!address) {
      setProcedures(undefined);
      authState.setState(null);
      authState.setTxHash(undefined);
      authState.setError(null);
      redelegateState.setState(null);
      redelegateState.setTxHash(undefined);
      redelegateState.setError(null);
    }
  }, [address]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length && authState.state === null && redelegateState.state === null) {
      if (!isAuthApproved) {
        authState.setState("active");
        redelegateState.setState("idle");
      } else {
        authState.setState("success");
        authState.setTxHash(authTxHash);
        redelegateState.setState("active");
      }
    }
  }, [cosmosBaseProcedures?.length, isAuthApproved, authTxHash]);

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
          } else if (procedure.step === "redelegate") {
            return {
              ...procedure,
              state: redelegateState.state,
              txHash: redelegateState.txHash,
              error: redelegateState.error,
              setState: redelegateState.setState,
            };
          }
        })
        .filter((procedure) => procedure !== undefined);

      setProcedures(proceduresArray as Array<RedelegateProcedure>);
    }
  }, [
    cosmosBaseProcedures?.length,
    authState.state,
    authState.txHash,
    authState.error,
    redelegateState.state,
    redelegateState.txHash,
    redelegateState.error,
  ]);

  return {
    procedures,
    resetStates: async () => {
      if (cosmosBaseProcedures?.length) {
        authState.setState(isAuthApproved ? "success" : "active");
        authState.setTxHash(isAuthApproved && authTxHash ? authTxHash : undefined);
        authState.setError(null);
        redelegateState.setState(!isAuthApproved ? "idle" : "active");
        redelegateState.setTxHash(undefined);
        redelegateState.setError(null);
        await refetchAuthCheck?.();
      }
    },
  };
};

const useProcedureStates = () => {
  const [state, setState] = useState<RedelegateProcedureState | null>(null);
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
