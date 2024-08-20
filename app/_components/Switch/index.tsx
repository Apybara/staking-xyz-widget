import cn from "classnames";
import * as RS from "@radix-ui/react-switch";

import * as S from "./switch.css";

export type SwitchProps = {
  className?: string;
  onChange?: (checked: boolean) => void;
};

const Switch = ({ className, onChange }: SwitchProps) => {
  return (
    <RS.Root className={cn(S.root, className)} onCheckedChange={onChange}>
      <RS.Thumb className={cn(S.thumb)} />
    </RS.Root>
  );
};

export default Switch;
