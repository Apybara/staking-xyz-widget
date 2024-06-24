import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import type { TxType } from "@/app/types";
import type { TxProcedure } from "../txProcedure/types";
import type * as T from "./types";
import { eventActionMap } from "./consts";

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
      return (({ amount, hasAuthApproval }: T.TxFlowStartProps) => {
        posthog.capture(event, { amount, hasAuthApproval });
      }) as T.EventFunctionTypes[E];
    case "unstake_tx_flow_started":
      return (({ amount }: T.TxFlowStartProps) => {
        posthog.capture(event, { amount });
      }) as T.EventFunctionTypes[E];
    case "redelegate_tx_flow_started":
      return (({ amount, hasAuthApproval }: T.TxFlowStartProps) => {
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
    case "claim_tx_flow_auth_succeeded":
    case "claim_tx_flow_auth_failed":
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
}: T.PostHogEventsProps<TxProcedure> & { type: TxType }) => {
  const action = eventActionMap[type];
  const hasAuthApproval = uncheckedProcedures?.[0]?.step === "sign";

  const captureFlowStart = usePostHogEvent(`${type}_tx_flow_started`);
  const captureAuthSuccess = usePostHogEvent(
    `${type === "unstake" ? "stake" : type}_tx_flow_auth_succeeded` as T.Event,
  );
  const captureAuthFailed = usePostHogEvent(`${type === "unstake" ? "stake" : type}_tx_flow_auth_failed` as T.Event);
  const captureSignSuccess = usePostHogEvent(`${type}_tx_flow${action}_succeeded` as T.Event);
  const captureSignFailed = usePostHogEvent(`${type}_tx_flow${action}_failed` as T.Event);

  const authProcedure = procedures?.find((procedure) => procedure.step === "auth");
  const signProcedure = procedures?.find((procedure) => procedure.step === "sign");

  useEffect(() => {
    if (open) {
      captureFlowStart({ amount, hasAuthApproval });
    }
  }, [open]);

  useEffect(() => {
    if (!hasAuthApproval && type !== "claim") {
      if (authProcedure?.state === "success") {
        captureAuthSuccess({});
      } else if (authProcedure?.state === "error") {
        captureAuthFailed({});
      }
    }
    if (signProcedure?.state === "success") {
      captureSignSuccess({});
    } else if (signProcedure?.state === "error") {
      captureSignFailed({});
    }
  }, [hasAuthApproval, type, authProcedure?.step, signProcedure?.state]);
};
