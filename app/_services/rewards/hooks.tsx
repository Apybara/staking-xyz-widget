import type { Network, WalletType } from "../../types";
import type { TxProcedure, TxProcedureState, TxStepCallbacks } from "../txProcedure/types";
import { useEffect, useState } from "react";
import { useCosmosTxProcedures } from "../cosmos/hooks";
import { ClaimingStates } from "./types";
import { useAleoTxProcedures } from "../aleo/hooks";

export const useClaimingProcedures = ({
  address,
  network,
  wallet,
}: {
  address: string | null;
  network: Network;
  wallet: WalletType | null;
}): ClaimingStates => {
  const [procedures, setProcedures] = useState<Array<TxProcedure> | undefined>(undefined);
  const claimState = useProcedureStates();
  const { signState, signStep } = useTxProcedureStates();

  const { baseProcedures: cosmosBaseProcedures } =
    useCosmosTxProcedures({
      type: "claim",
      network,
      wallet,
      address,
      signStep,
    }) || {};

  const { baseProcedures: aleoBaseProcedures } =
    useAleoTxProcedures({
      network,
      wallet,
      address,
      type: "claim",
      signStep,
    }) || {};

  const updateStates = () => {
    if (cosmosBaseProcedures?.length) {
      claimState.setState("active");
      claimState.setTxHash(undefined);
      claimState.setError(null);
    }
    if (aleoBaseProcedures?.length) {
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
    if (aleoBaseProcedures?.length) {
      setProcedures([
        {
          ...aleoBaseProcedures[0],
          state: signState.state,
          txHash: signState.txHash,
          error: signState.error,
          setState: signState.setState,
        },
      ]);
    }
  }, [cosmosBaseProcedures?.length, aleoBaseProcedures?.length, claimState.state, claimState.txHash, claimState.error]);

  return {
    procedures,
    resetProceduresStates: async () => {
      if (cosmosBaseProcedures?.length) {
        updateStates();
      }
    },
  };
};

const useTxProcedureStates = () => {
  const authState = useProcedureStates();
  const signState = useProcedureStates();

  const authStep: TxStepCallbacks = {
    onPreparing: () => {
      authState.setState("preparing");
      authState.setTxHash(undefined);
      authState.setError(null);
    },
    onLoading: () => {
      authState.setState("loading");
      authState.setTxHash(undefined);
      authState.setError(null);
    },
    onBroadcasting: () => {
      authState.setState("broadcasting");
      authState.setTxHash(undefined);
      authState.setError(null);
    },
    onSuccess: (txHash) => {
      authState.setState("success");
      authState.setTxHash(txHash);
      signState.setState("active");
    },
    onError: (e, txHash) => {
      console.error(e);
      authState.setState("error");
      authState.setTxHash(txHash);
      authState.setError(e);
    },
  };

  const signStep: TxStepCallbacks = {
    onPreparing: () => {
      signState.setState("preparing");
      signState.setTxHash(undefined);
      signState.setError(null);
    },
    onLoading: () => {
      signState.setState("loading");
      signState.setTxHash(undefined);
      signState.setError(null);
    },
    onBroadcasting: () => {
      signState.setState("broadcasting");
      signState.setTxHash(undefined);
      signState.setError(null);
    },
    onSuccess: (txHash) => {
      signState.setState("success");
      signState.setTxHash(txHash);
    },
    onError: (e, txHash) => {
      console.error(e);
      signState.setState("error");
      signState.setTxHash(txHash);
      signState.setError(e);
    },
  };

  return {
    authState,
    signState,
    authStep,
    signStep,
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
