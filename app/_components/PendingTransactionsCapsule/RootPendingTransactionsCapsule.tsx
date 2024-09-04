import type { WalletInfo } from "../../types";
import cn from "classnames";
import { LoadingSpinner } from "../LoadingSpinner";

import * as S from "./pendingTransactionsCapsule.css";
import { pluralize } from "@/app/_utils";

export type RootPendingTransactionsCapsuleProps = {
  className?: string;
  state: "disconnected" | "connecting" | "connected";
  wallet?: {
    info: WalletInfo;
    address: string;
  };
  onButtonClick: () => void;
  transactionsCount: number;
};

export const RootPendingTransactionsCapsule = ({
  state,
  wallet,
  className,
  onButtonClick,
  transactionsCount,
}: RootPendingTransactionsCapsuleProps) => {
  return (
    <button
      className={cn(S.pendingTransactionsCapsule, className)}
      disabled={state === "connecting" || state === "disconnected"}
      onClick={onButtonClick}
    >
      <MainContent state={state} wallet={wallet} transactionsCount={transactionsCount} />
    </button>
  );
};

const MainContent = ({
  state,
  wallet,
  transactionsCount,
}: Pick<RootPendingTransactionsCapsuleProps, "state" | "wallet" | "transactionsCount">) => {
  if (wallet && state === "connected") {
    return (
      <>
        <span className={S.count}>{transactionsCount}</span>
        <div>
          <div className={S.title}>
            <span>Waiting {pluralize(transactionsCount, "transaction")}</span>
            <LoadingSpinner className={S.loadingIcon} size={12} />
          </div>
          <span className={S.description}>To see the status, click this box.</span>
        </div>
      </>
    );
  }

  return null;
};
