import type { InputHTMLAttributes, ReactNode } from "react";
import cn from "classnames";
import { Icon } from "../Icon";

import * as S from "./checkbox.css";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
};

export const Checkbox = ({ label, checked, disabled, ...props }: CheckboxProps) => {
  return (
    <label className={cn(S.checkbox({ state: disabled ? "disabled" : checked ? "checked" : "default" }))}>
      <input type="checkbox" className={S.input} disabled={disabled} {...props} />
      <Icon name="circleCheck" />
      <div className={S.label}>{label}</div>
    </label>
  );
};
