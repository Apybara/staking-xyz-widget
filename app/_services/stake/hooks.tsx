import type { SigningStargateClient } from "@cosmjs/stargate";
import type { Network } from "../../types";
import type { StakeProcedure, StakeProcedureState } from "./types";
import { useEffect, useState } from "react";
import { useCosmosStakingProcedures } from "../cosmos/hooks";
import { useShell } from "@/app/_contexts/ShellContext";
import { defaultNetwork, requiredBalanceStakingByNetwork } from "@/app/consts";
import { getFeeCollectingAmount } from ".";
import BigNumber from "bignumber.js";

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
    isAuthApproved,
    authTxHash,
    refetchAuthCheck,
  } = useCosmosStakingProcedures({
    amount,
    network,
    address,
    cosmosSigningClient,
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
        delegateState.setState("active");
      },
      onError: (e, txHash) => {
        console.error(e);
        authState.setState("error");
        authState.setTxHash(txHash);
        authState.setError(e);
      },
    },
    delegateStep: {
      onPreparing: () => {
        delegateState.setState("preparing");
        delegateState.setTxHash(undefined);
        delegateState.setError(null);
      },
      onLoading: () => {
        delegateState.setState("loading");
        delegateState.setTxHash(undefined);
        delegateState.setError(null);
      },
      onBroadcasting: () => {
        delegateState.setState("broadcasting");
        delegateState.setTxHash(undefined);
        delegateState.setError(null);
      },
      onSuccess: (txHash) => {
        delegateState.setState("success");
        delegateState.setTxHash(txHash);
      },
      onError: (e, txHash) => {
        console.error(e);
        delegateState.setState("error");
        delegateState.setTxHash(txHash);
        delegateState.setError(e);
      },
    },
  }) || {};

  const updateStates = () => {
    if (cosmosBaseProcedures?.length) {
      authState.setState(isAuthApproved ? "success" : "active");
      authState.setTxHash(isAuthApproved && authTxHash ? authTxHash : undefined);
      authState.setError(null);
      delegateState.setState(!isAuthApproved ? "idle" : "active");
      delegateState.setTxHash(undefined);
      delegateState.setError(null);
    }
  };

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
        updateStates();
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

export const useStakeMaxAmountBuffer = ({ amount }: { amount: string }) => {
  const { network } = useShell();
  const castedNetwork = network || defaultNetwork;

  const requiredBalance = requiredBalanceStakingByNetwork[castedNetwork];
  const collectedFee = getFeeCollectingAmount({ amount, network: castedNetwork });

  return BigNumber(requiredBalance).plus(collectedFee).toString();
};
