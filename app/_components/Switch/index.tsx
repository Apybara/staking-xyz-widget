import cn from "classnames";
import * as RS from "@radix-ui/react-switch";

import * as S from "./switch.css";

export type SwitchProps = {
  className?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const Switch = ({ className, onChange, disabled }: SwitchProps) => {
  return (
    <RS.Root className={cn(S.root({ state: disabled ? "disabled" : "default" }), className)} onCheckedChange={onChange}>
      <RS.Thumb className={cn(S.thumb)} />
    </RS.Root>
  );
};

export default Switch;
