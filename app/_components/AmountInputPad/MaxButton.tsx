import type { ReactNode } from "react";
import cn from "classnames";
import { maxButton, maxButtonContainer } from "./amountInputPad.css";

export type MaxButtonProps = {
  onClick: () => void;
  tooltip?: ReactNode;
  disabled?: boolean;
};

export const MaxButton = ({ onClick, tooltip, disabled }: MaxButtonProps) => {
  return (
    <div className={maxButtonContainer}>
      <button className={cn(maxButton({ state: disabled ? "disabled" : "default" }))} onClick={onClick}>
        MAX
      </button>
      {!!tooltip && tooltip}
    </div>
  );
};
