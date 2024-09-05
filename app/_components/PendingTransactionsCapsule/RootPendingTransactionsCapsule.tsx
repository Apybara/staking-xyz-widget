import cn from "classnames";
import { LoadingSpinner } from "../LoadingSpinner";
import { pluralize } from "@/app/_utils";
import { Icon } from "../Icon";

import * as S from "./pendingTransactionsCapsule.css";

export type RootPendingTransactionsCapsuleProps = {
  className?: string;
  onButtonClick: () => void;
  transactionsCount: number;
  isAllCompleted: boolean;
};

export const RootPendingTransactionsCapsule = ({
  className,
  onButtonClick,
  transactionsCount,
  isAllCompleted,
}: RootPendingTransactionsCapsuleProps) => {
  return (
    <button className={cn(S.pendingTransactionsCapsule, className)} onClick={onButtonClick}>
      {isAllCompleted ? (
        <span className={S.checkIcon}>
          <Icon name="circleCheck" size={32} />
        </span>
      ) : (
        <span className={S.count}>{transactionsCount}</span>
      )}
      <div>
        <div className={S.title}>
          <span>
            {isAllCompleted ? "All transactions confirmed!" : `Pending ${pluralize(transactionsCount, "transaction")}`}
          </span>
          {!isAllCompleted && (
            <span className={S.loadingIcon}>
              <LoadingSpinner size={12} />
            </span>
          )}
        </div>
        <span className={S.description}>Click to see details.</span>
      </div>
    </button>
  );
};
