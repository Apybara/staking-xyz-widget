import type { SigningStargateClient } from "@cosmjs/stargate";
import type { Network } from "../../types";
import type { TxProcedure, TxProcedureState } from "../txProcedure/types";
import { useEffect, useState } from "react";
import { useCosmosWithdrawRewardsProcedures } from "../cosmos/hooksV2";
import { usePostHogEvent } from "../postHog/hooks";
import { ClaimingStates } from "./types";

export const useClaimingProcedures = ({
  address,
  network,
  cosmosSigningClient,
}: {
  address: string | null;
  network: Network;
  cosmosSigningClient?: SigningStargateClient;
}): ClaimingStates => {
  const [procedures, setProcedures] = useState<Array<TxProcedure> | undefined>(undefined);
  const claimState = useProcedureStates();

  const { baseProcedures: cosmosBaseProcedures } =
    useCosmosWithdrawRewardsProcedures({
      network,
      address,
      cosmosSigningClient,
      withdrawRewardsStep: {
        onPreparing: () => {
          claimState.setState("preparing");
          claimState.setTxHash(undefined);
          claimState.setError(null);
        },
        onLoading: () => {
          claimState.setState("loading");
          claimState.setTxHash(undefined);
          claimState.setError(null);
        },
        onBroadcasting: () => {
          claimState.setState("broadcasting");
          claimState.setTxHash(undefined);
          claimState.setError(null);
        },
        onSuccess: (txHash) => {
          claimState.setState("success");
          claimState.setTxHash(txHash);
        },
        onError: (e, txHash) => {
          console.error(e);
          claimState.setState("error");
          claimState.setTxHash(txHash);
          claimState.setError(e);
        },
      },
    }) || {};

  const updateStates = () => {
    if (cosmosBaseProcedures?.length) {
      claimState.setState("active");
      claimState.setTxHash(undefined);
      claimState.setError(null);
    }
  };

  useEffect(() => {
    if (!address) {
      setProcedures(undefined);
      claimState.setState(null);
      claimState.setTxHash(undefined);
      claimState.setError(null);
    }
  }, [address]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length && claimState.state === null) {
      updateStates();
    }
  }, [cosmosBaseProcedures?.length]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length) {
      const proceduresArray = cosmosBaseProcedures
        .map((procedure) => {
          if (procedure.step === "sign") {
            return {
              ...procedure,
              state: claimState.state,
              txHash: claimState.txHash,
              error: claimState.error,
              setState: claimState.setState,
            };
          }
        })
        .filter((procedure) => procedure !== undefined);

      setProcedures(proceduresArray as Array<TxProcedure>);
    }
  }, [cosmosBaseProcedures?.length, claimState.state, claimState.txHash, claimState.error]);

  return {
    procedures,
    resetProceduresStates: async () => {
      if (cosmosBaseProcedures?.length) {
        updateStates();
      }
    },
  };
};

const useProcedureStates = () => {
  const [state, setState] = useState<TxProcedureState | null>(null);
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
