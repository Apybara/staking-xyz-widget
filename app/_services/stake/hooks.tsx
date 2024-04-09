import type { SigningStargateClient } from "@cosmjs/stargate";
import type { Network } from "../../types";
import type { StakeProcedure, StakeProcedureState } from "./types";
import { useEffect, useState } from "react";
import { useCosmosStakingProcedures } from "../cosmos/hooks";

export const useStakingProcedures = ({
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
  const [procedures, setProcedures] = useState<Array<StakeProcedure> | undefined>(undefined);
  const authState = useProcedureStates();
  const delegateState = useProcedureStates();

  const {
    baseProcedures: cosmosBaseProcedures,
    firstStep,
    refetchAuthCheck,
  } = useCosmosStakingProcedures({
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
        delegateState.setState("active");
      },
      onError: (e) => {
        console.error(e);
        authState.setState("error");
        authState.setError(e);
      },
    },
    delegateStep: {
      onLoading: () => {
        delegateState.setState("loading");
        delegateState.setTxHash(undefined);
        delegateState.setError(null);
      },
      onSuccess: (txHash) => {
        delegateState.setState("success");
        delegateState.setTxHash(txHash);
      },
      onError: (e) => {
        console.error(e);
        delegateState.setState("error");
        delegateState.setError(e);
      },
    },
  }) || {};

  useEffect(() => {
    if (!address) {
      setProcedures(undefined);
      authState.setState(null);
      authState.setTxHash(undefined);
      authState.setError(null);
      delegateState.setState(null);
      delegateState.setTxHash(undefined);
      delegateState.setError(null);
    }
  }, [address]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length && authState.state === null && delegateState.state === null) {
      if (firstStep === "auth") {
        authState.setState("active");
        delegateState.setState("idle");
      } else if (firstStep === "delegate") {
        delegateState.setState("active");
      }
    }
  }, [cosmosBaseProcedures?.length]);

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
          } else if (procedure.step === "delegate") {
            return {
              ...procedure,
              state: delegateState.state,
              txHash: delegateState.txHash,
              error: delegateState.error,
              setState: delegateState.setState,
            };
          }
        })
        .filter((procedure) => procedure !== undefined);

      setProcedures(proceduresArray as Array<StakeProcedure>);
    }
  }, [
    cosmosBaseProcedures?.length,
    authState.state,
    authState.txHash,
    authState.error,
    delegateState.state,
    delegateState.txHash,
    delegateState.error,
  ]);

  return {
    procedures,
    resetStates: async () => {
      if (cosmosBaseProcedures?.length) {
        authState.setState(firstStep === "auth" ? "active" : null);
        authState.setTxHash(undefined);
        authState.setError(null);
        delegateState.setState(firstStep === "delegate" ? "active" : "idle");
        delegateState.setTxHash(undefined);
        delegateState.setError(null);
        await refetchAuthCheck?.();
      }
    },
  };
};

const useProcedureStates = () => {
  const [state, setState] = useState<StakeProcedureState | null>(null);
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
