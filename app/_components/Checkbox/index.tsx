import type { InputHTMLAttributes, ReactNode } from "react";
import cn from "classnames";
import { Icon } from "../Icon";

import * as S from "./checkbox.css";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export const Checkbox = ({ label, checked, ...props }: CheckboxProps) => {
  return (
    <label className={cn(S.checkbox({ state: checked ? "checked" : "default" }))}>
      <input type="checkbox" className={S.input} {...props} />

      <Icon name="check" />

      <div className={S.label}>{label}</div>
    </label>
  );
};
