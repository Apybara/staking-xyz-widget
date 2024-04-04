import type { Network } from "../../types";
import type { StakeProcedure, StakeProcedureState } from "./types";
import { useEffect, useState } from "react";
import { useWallet } from "../../_contexts/WalletContext";
import { getIsCosmosNetwork } from "../cosmos/utils";
import { useCosmosBroadcastAuthzTx } from "../cosmos/hooks";
import { SigningStargateClient } from "@cosmjs/stargate";

export const useStakingProcedures = ({
  cosmosSigningClient,
  network,
}: {
  network: Network;
  cosmosSigningClient?: SigningStargateClient;
}) => {
  const [procedures, setProcedures] = useState<Array<StakeProcedure> | undefined>(undefined);
  const authState = useProcedureStates();
  const delegateState = useProcedureStates();

  const { address } = useWallet();
  const isCosmosNetwork = getIsCosmosNetwork(network);
  const cosmosAuthTx = useCosmosBroadcastAuthzTx({
    client: cosmosSigningClient || null,
    network: isCosmosNetwork ? network : undefined,
    address: address || undefined,
    onLoading: () => {
      authState.setState("loading");
      authState.setTxHash(undefined);
      authState.setError(null);
    },
    onSuccess: (txHash) => {
      authState.setState("success");
      authState.setTxHash(txHash);
    },
    onError: (e) => {
      console.error(e);
      authState.setState("error");
      authState.setError(e);
    },
  });

  useEffect(() => {
    if (isCosmosNetwork) {
      if (authState.state === null) {
        authState.setState("active");
      }
      if (delegateState.state === null) {
        delegateState.setState("idle");
      }
    }
  }, [isCosmosNetwork]);

  useEffect(() => {
    if (isCosmosNetwork) {
      setProcedures([
        {
          step: "auth",
          stepName: "Approval in wallet",
          state: authState.state,
          txHash: authState.txHash,
          error: authState.error,
          send: cosmosAuthTx.send,
        },
        {
          step: "delegate",
          stepName: "Sign in wallet",
          state: delegateState.state,
          txHash: delegateState.txHash,
          error: delegateState.error,
          send: () => {},
        },
      ]);
    }
  }, [
    isCosmosNetwork,
    authState.state,
    authState.txHash,
    authState.error,
    delegateState.state,
    delegateState.txHash,
    delegateState.error,
  ]);

  return {
    procedures,
    resetStates: () => {
      if (isCosmosNetwork) {
        authState.setState("active");
        authState.setTxHash(undefined);
        authState.setError(null);
        delegateState.setState("idle");
        delegateState.setTxHash(undefined);
        delegateState.setError(null);
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
