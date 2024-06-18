import type { TxProcedure, TxProcedureState, TxProcedureType } from "./types";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useCosmosTxProcedures } from "../cosmos/hooksV2";
import { useShell } from "@/app/_contexts/ShellContext";
import { defaultNetwork, requiredBalanceStakingByNetwork } from "@/app/consts";
import type { CosmosTxParams } from "../cosmos/types";
// import { getStakeFees } from "@/app/_utils/transaction";

export const useTxProcedure = ({
  address,
  amount,
  network,
  client,
  type,
}: CosmosTxParams & {
  type: TxProcedureType;
}) => {
  const [procedures, setProcedures] = useState<Array<TxProcedure> | undefined>(undefined);
  const authState = useProcedureStates();
  const signState = useProcedureStates();

  const {
    baseProcedures: cosmosBaseProcedures,
    isAuthApproved,
    authTxHash,
    refetchAuthCheck,
  } = useCosmosTxProcedures({
    amount,
    network,
    address,
    client,
    type,
    authStep: {
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
    },
    signStep: {
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
    },
  }) || {};

  const updateStates = () => {
    if (cosmosBaseProcedures?.length) {
      authState.setState(isAuthApproved ? "success" : "active");
      authState.setTxHash(isAuthApproved && authTxHash ? authTxHash : undefined);
      authState.setError(null);
      signState.setState(!isAuthApproved ? "idle" : "active");
      signState.setTxHash(undefined);
      signState.setError(null);
    }
  };

  useEffect(() => {
    if (!address) {
      setProcedures(undefined);
      authState.setState(null);
      authState.setTxHash(undefined);
      authState.setError(null);
      signState.setState(null);
      signState.setTxHash(undefined);
      signState.setError(null);
    }
  }, [address]);

  useEffect(() => {
    if (cosmosBaseProcedures?.length && authState.state === null && signState.state === null) {
      updateStates();
    }
  }, [cosmosBaseProcedures?.length, isAuthApproved, authTxHash]);

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
          } else if (procedure.step === "sign") {
            return {
              ...procedure,
              state: signState.state,
              txHash: signState.txHash,
              error: signState.error,
              setState: signState.setState,
            };
          }
        })
        .filter((procedure) => procedure !== undefined);

      setProcedures(proceduresArray as Array<TxProcedure>);
    }
  }, [
    cosmosBaseProcedures?.length,
    authState.state,
    authState.txHash,
    authState.error,
    signState.state,
    signState.txHash,
    signState.error,
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

export const useStakeMaxAmountBuffer = ({ amount }: { amount: string }) => {
  const { network } = useShell();
  const castedNetwork = network || defaultNetwork;

  const requiredBalance = requiredBalanceStakingByNetwork[castedNetwork];
  // const collectedFee = getStakeFees({ amount, network: castedNetwork, floorResult: true });
  const collectedFee = 0;

  return BigNumber(requiredBalance)
    .plus(collectedFee || 0)
    .toString();
};
