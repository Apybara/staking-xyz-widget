import type { Ref, ReactNode } from "react";
import type * as T from "@radix-ui/react-select";
import { forwardRef } from "react";
import cn from "classnames";
import * as RootSelect from "@radix-ui/react-select";
import { Icon } from "../Icon";
import * as S from "./select.css";

export type SelectProps = T.SelectProps & {
  label?: string;
  triggerContent?: ReactNode;
  items: ReactNode;
};

export const Main = ({ label, triggerContent, items, defaultValue, onValueChange, ...props }: SelectProps) => (
  <RootSelect.Root defaultValue={defaultValue} onValueChange={onValueChange} {...props}>
    {triggerContent ?? TriggerSet({ label: label || "Select" })}
    <RootSelect.Portal>
      <RootSelect.Content position="popper" className={cn(S.content)}>
        <RootSelect.Viewport className={cn(S.viewport)}>{items}</RootSelect.Viewport>
      </RootSelect.Content>
    </RootSelect.Portal>
  </RootSelect.Root>
);

export const Value = RootSelect.Value;

export const Trigger = ({ label, className, children }: { label: string; className?: string; children: ReactNode }) => {
  return (
    <RootSelect.Trigger className={cn(S.trigger, className)} aria-label={label}>
      {children}
    </RootSelect.Trigger>
  );
};

export const TriggerSet = ({ label, className }: { label: string; className?: string }) => {
  return (
    <Trigger label={label} className={cn(className)}>
      <Value />
      <TriggerIcon />
    </Trigger>
  );
};

export const TriggerIcon = () => {
  return (
    <RootSelect.Icon className={cn(S.triggerIcon)}>
      <Icon name="chevron" />
    </RootSelect.Icon>
  );
};

export const ItemText = RootSelect.ItemText;

export const Item = forwardRef(
  ({ children, className, ...props }: T.SelectItemProps, forwardedRef: Ref<HTMLDivElement>) => {
    return (
      <RootSelect.Item className={cn(S.item, className)} {...props} ref={forwardedRef}>
        {children}
      </RootSelect.Item>
    );
  },
);
