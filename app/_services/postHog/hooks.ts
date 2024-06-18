import { useEffect } from "react";
import type { TxType } from "@/app/types";
import { TxProcedure } from "../txProcedure/types";
import type * as T from "./types";
import { usePostHog } from "posthog-js/react";

export function usePostHogEvent<E extends T.Event>(event: E): T.EventFunctionTypes[E] {
  const posthog = usePostHog();

  switch (event) {
    case "wallet_connect_succeeded":
    case "wallet_connect_failed":
    case "wallet_disconnect_succeeded":
      return (({ wallet, address }: T.WalletConnectivityProps) => {
        posthog.capture(event, { wallet });
        if (event === "wallet_connect_succeeded") {
          posthog.identify(address, { wallet });
        } else if (event === "wallet_disconnect_succeeded") {
          posthog.reset();
        }
      }) as T.EventFunctionTypes[E];
    case "stake_tx_flow_started":
      return (({ amount, hasAuthApproval }: T.StakeTxFlowStartProps) => {
        posthog.capture(event, { amount, hasAuthApproval });
      }) as T.EventFunctionTypes[E];
    case "unstake_tx_flow_started":
      return (({ amount }: T.UnstakeTxFlowStartProps) => {
        posthog.capture(event, { amount });
      }) as T.EventFunctionTypes[E];
    case "redelegate_tx_flow_started":
      return (({ amount, hasAuthApproval }: T.RedelegateTxFlowStartProps) => {
        posthog.capture(event, { amount, hasAuthApproval });
      }) as T.EventFunctionTypes[E];
    case "stake_tx_flow_auth_succeeded":
    case "stake_tx_flow_auth_failed":
    case "stake_tx_flow_delegate_succeeded":
    case "stake_tx_flow_delegate_failed":
    case "unstake_tx_flow_undelegate_succeeded":
    case "unstake_tx_flow_undelegate_failed":
    case "redelegate_tx_flow_auth_succeeded":
    case "redelegate_tx_flow_auth_failed":
    case "redelegate_tx_flow_redelegate_succeeded":
    case "redelegate_tx_flow_redelegate_failed":
    case "claim_tx_flow_started":
    case "claim_tx_flow_succeeded":
    case "claim_tx_flow_failed":
      return (() => {
        posthog.capture(event);
      }) as T.EventFunctionTypes[E];
    default:
      throw new Error(`Unhandled event type: ${event}`);
  }
}

export const useTxPostHogEvents = ({
  type,
  open,
  amount,
  procedures,
  uncheckedProcedures,
}: {
  type: TxType;
  open: boolean;
  amount: string;
  procedures?: Array<TxProcedure>;
  uncheckedProcedures: Array<TxProcedure>;
}) => {
  const hasAuthApproval = uncheckedProcedures?.[0]?.step === "sign";

  // still figuring out how to conditionally determine the events
  const captureFlowStart = usePostHogEvent("stake_tx_flow_started");
  const captureAuthSuccess = usePostHogEvent("stake_tx_flow_auth_succeeded");
  const captureAuthFailed = usePostHogEvent("stake_tx_flow_auth_failed");
  const captureSignSuccess = usePostHogEvent("stake_tx_flow_delegate_succeeded");
  const captureSignFailed = usePostHogEvent("stake_tx_flow_delegate_failed");

  const authProcedure = procedures?.find((procedure) => procedure.step === "auth");
  const signProcedure = procedures?.find((procedure) => procedure.step === "sign");

  useEffect(() => {
    if (open) {
      captureFlowStart({ amount, hasAuthApproval });
    }
  }, [open]);

  useEffect(() => {
    if (!hasAuthApproval) {
      if (authProcedure?.state === "success") {
        captureAuthSuccess();
      } else if (authProcedure?.state === "error") {
        captureAuthFailed();
      }
    }
    if (signProcedure?.state === "success") {
      captureSignSuccess();
    } else if (signProcedure?.state === "error") {
      captureSignFailed();
    }
  }, [hasAuthApproval, authProcedure?.step, signProcedure?.state]);
};
