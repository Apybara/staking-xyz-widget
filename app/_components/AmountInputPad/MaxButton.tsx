import type { ReactNode } from "react";
import cn from "classnames";
import { maxButton, maxButtonContainer } from "./amountInputPad.css";

export type MaxButtonProps = {
  onClick: () => void;
  tooltip?: ReactNode;
};

export const MaxButton = ({ onClick, tooltip }: MaxButtonProps) => {
  return (
    <div className={maxButtonContainer}>
      <button className={cn(maxButton)} onClick={onClick}>
        MAX
      </button>
      {!!tooltip && tooltip}
    </div>
  );
};
