import type { ReactNode, Ref } from "react";
import type { DialogContentProps } from "@radix-ui/react-dialog";
import { forwardRef } from "react";
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

export const Content = forwardRef(({ children, className, ...props }: ContentProps, ref: Ref<HTMLDivElement>) => {
  return (
    <DialogPrimitive.Content
      className={cn(S.content, className)}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  );
});

type ContentProps = { children: ReactNode } & DialogContentProps;
