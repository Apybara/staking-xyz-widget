import cn from "classnames";
import { maxButton } from "./amountInputPad.css";

export type MaxButtonProps = {
  onClick: () => void;
};

export const MaxButton = ({ onClick }: MaxButtonProps) => {
  return (
    <button className={cn(maxButton)} onClick={onClick}>
      MAX
    </button>
  );
};
