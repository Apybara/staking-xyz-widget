import type { ReactNode } from "react";
import { forwardRef } from "react";
import cn from "classnames";
import * as S from "./infoCard.css";

export const Card = forwardRef<HTMLDivElement, Props>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn(S.card, className)}>
      {children}
    </div>
  );
});

export const Stack = ({ className, children }: Props) => {
  return <ul className={cn(S.stack, className)}>{children}</ul>;
};

export const StackItem = ({ className, children }: Props) => {
  return <li className={cn(S.stackItem, className)}>{children}</li>;
};

export const Title = ({ className, children }: Props) => {
  return <h4 className={cn(S.title, className)}>{children}</h4>;
};

export const TitleBox = ({ className, children }: Props) => {
  return <div className={cn(S.titleBox, className)}>{children}</div>;
};

export const TitleIcon = ({ className, children }: Props) => {
  return <span className={cn(S.titleIcon, className)}>{children}</span>;
};

export const Content = ({ className, children }: Props) => {
  return <span className={cn(S.content, className)}>{children}</span>;
};

type Props = {
  className?: string;
  children: ReactNode;
};
