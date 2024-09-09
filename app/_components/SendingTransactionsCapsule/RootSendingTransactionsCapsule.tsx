import cn from "classnames";
import { LoadingSpinner } from "../LoadingSpinner";
import { pluralize } from "@/app/_utils";
import { Icon } from "../Icon";

import * as S from "./sendingTransactionsCapsule.css";

export type RootSendingTransactionsCapsuleProps = {
  className?: string;
  onButtonClick: () => void;
  transactionsCount: number;
  isAllCompleted: boolean;
};

export const RootSendingTransactionsCapsule = ({
  className,
  onButtonClick,
  transactionsCount,
  isAllCompleted,
}: RootSendingTransactionsCapsuleProps) => {
  return (
    <button className={cn(S.sendingTransactionsCapsule, className)} onClick={onButtonClick}>
      {isAllCompleted ? (
        <span className={S.checkIcon}>
          <Icon name="circleCheck" size={32} />
        </span>
      ) : (
        <span className={S.count}>{transactionsCount}</span>
      )}
      <div className={S.content}>
        <div className={S.title}>
          <span>
            {isAllCompleted
              ? "All transactions sent!"
              : `Sending ${pluralize({ value: transactionsCount, unit: "transaction" })}`}
          </span>
          {!isAllCompleted && (
            <span className={S.loadingIcon}>
              <LoadingSpinner size={14} />
            </span>
          )}
        </div>
        <span className={S.description}>Click to see details</span>
      </div>
    </button>
  );
};
