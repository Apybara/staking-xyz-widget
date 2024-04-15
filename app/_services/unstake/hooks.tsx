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
  const undelegateState = useProcedureStates();

  const { baseProcedures: cosmosBaseProcedures } =
    useCosmosUnstakingProcedures({
      amount,
      network,
      address,
      cosmosSigningClient,
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

  useEffect(() => {
    if (!address) {
      setProcedures(undefined);
      undelegateState.setState(null);
      undelegateState.setTxHash(undefined);
      undelegateState.setError(null);
    }
  }, [address]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length && undelegateState.state === null) {
      undelegateState.setState("active");
    }
  }, [cosmosBaseProcedures?.length]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length) {
      const proceduresArray = cosmosBaseProcedures
        .map((procedure) => {
          if (procedure.step === "undelegate") {
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
  }, [cosmosBaseProcedures?.length, undelegateState.state, undelegateState.txHash, undelegateState.error]);

  return {
    procedures,
    resetStates: async () => {
      if (cosmosBaseProcedures?.length) {
        undelegateState.setState("active");
        undelegateState.setTxHash(undefined);
        undelegateState.setError(null);
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
