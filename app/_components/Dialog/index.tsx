import type { ReactNode } from "react";
import type { DialogContentProps } from "@radix-ui/react-dialog";
import cn from "classnames";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as S from "./dialog.css";

export const Root = DialogPrimitive.Root;
export const Trigger = DialogPrimitive.Trigger;
export const Close = DialogPrimitive.Close;
export const Title = DialogPrimitive.Title;
export const Description = DialogPrimitive.Description;

export const Main = ({ children }: { children: ReactNode }) => {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={cn(S.overlay)} />
      {children}
    </DialogPrimitive.Portal>
  );
};

export const Content = ({ children, className, ...props }: { children: ReactNode } & DialogContentProps) => {
  return (
    <DialogPrimitive.Content className={cn(S.content, className)} {...props}>
      {children}
    </DialogPrimitive.Content>
  );
};
