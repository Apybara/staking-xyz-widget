import type { ReactNode, Ref } from "react";
import { forwardRef } from "react";
import cn from "classnames";
import { Icon } from "../Icon";
import * as Accordion from "@radix-ui/react-accordion";
import * as InfoCard from "../InfoCard";
import * as S from "./accordionInfoCard.css";

export const Root = ({
  className,
  children,
  defaultValue,
  ...props
}: Props & Omit<Accordion.AccordionSingleProps, "type">) => {
  return (
    <Accordion.Root type="single" defaultValue={defaultValue} collapsible asChild {...props}>
      <InfoCard.Card className={cn(S.infoCard, className)}>{children}</InfoCard.Card>
    </Accordion.Root>
  );
};

export const Item = ({ className, children, ...props }: Props & Accordion.AccordionItemProps) => {
  return (
    <Accordion.Item className={cn(S.item, className)} {...props}>
      {children}
    </Accordion.Item>
  );
};

export const Trigger = forwardRef(
  (
    { children, className, ...props }: Props & Accordion.AccordionTriggerProps,
    forwardedRef: Ref<HTMLButtonElement>,
  ) => (
    <Accordion.Header className={cn(S.itemHeader, "accordionInfoCardHeader")}>
      <Accordion.Trigger className={cn(S.trigger, className)} {...props} ref={forwardedRef}>
        {children}
        {!props.disabled && <Icon name="chevron" size={14} className={cn(S.triggerIcon)} aria-hidden />}
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

export const Content = forwardRef(
  ({ children, className, ...props }: Props & Accordion.AccordionContentProps, forwardedRef: Ref<HTMLDivElement>) => (
    <Accordion.Content className={cn(S.content, className)} {...props} ref={forwardedRef}>
      {children}
    </Accordion.Content>
  ),
);

export const Stack = InfoCard.Stack;

export const StackItem = InfoCard.StackItem;

type Props = {
  className?: string;
  children: ReactNode;
};
