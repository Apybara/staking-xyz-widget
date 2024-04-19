import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import type { LinkProps } from "next/link";
import type { ButtonVariants } from "./ctaButton.css";
import Link from "next/link";
import cn from "classnames";
import { button } from "./ctaButton.css";
import { LoadingSpinner } from "../LoadingSpinner";

export type CTAButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants;

export const CTAButton = ({ variant, state, className, children, ...props }: CTAButtonProps) => {
  return (
    <button className={cn(button({ variant, state }), className)} {...props}>
      {children}
    </button>
  );
};

export type LinkCTAButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonVariants & LinkProps;

export const LinkCTAButton = ({ variant, state, className, children, href, ...props }: LinkCTAButtonProps) => {
  return (
    <Link href={href} className={cn(button({ variant, state }), className)} {...props}>
      {children}
    </Link>
  );
};

export const Loader = LoadingSpinner;
