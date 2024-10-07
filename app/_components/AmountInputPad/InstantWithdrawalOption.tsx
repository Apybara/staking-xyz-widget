import cn from "classnames";

import { Icon } from "../Icon";
import Tooltip from "../Tooltip";
import Switch from "../Switch";
import { useUnstaking } from "@/app/_contexts/UnstakingContext";

import * as S from "./amountInputPad.css";

export const InstantWithdrawalOption = () => {
  const { setStates } = useUnstaking();

  return (
    <div className={cn(S.instantWithdrawal)}>
      <div className={S.instantWithdrawalLabel}>
        <p>Instant withdrawal</p>
        <Tooltip
          className={S.instantWithdrawalTooltip}
          trigger={<Icon name="question" />}
          content="Instant withdrawals have a fee of 0.25%. They will be processed immediately without any waiting period."
        />
      </div>

      <Switch onChange={(checked) => setStates({ instantWithdrawal: checked })} />
    </div>
  );
};
