import type { ButtonHTMLAttributes } from "react";
import cn from "classnames";
import { type TabButtonVariants, tabButton } from "./tabButton.css";

export type TabButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & TabButtonVariants & {};

export const TabButton = ({ state, className, children, ...props }: TabButtonProps) => {
  return (
    <button className={cn(tabButton({ state }), className)} {...props}>
      {children}
    </button>
  );
};
