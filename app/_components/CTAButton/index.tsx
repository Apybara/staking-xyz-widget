import type { ButtonHTMLAttributes } from "react";
import type { ButtonVariants } from "./ctaButton.css";
import cn from "classnames";
import { button } from "./ctaButton.css";
import { LoadingSpinner } from "../LoadingSpinner";

export type CTAButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants & {};

export const CTAButton = ({ variant, state, className, children, ...props }: CTAButtonProps) => {
  return (
    <button className={cn(button({ variant, state }), className)} {...props}>
      {children}
    </button>
  );
};

export const Loader = LoadingSpinner;
