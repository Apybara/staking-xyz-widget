import type { ReactNode } from "react";
import cn from "classnames";
import * as T from "@radix-ui/react-tooltip";

import { useTooltipMobile } from "@/app/_utils/hooks";

import * as S from "./tooltip.css";

export type TooltipProps = {
  className?: string;
  variant?: "paragraph" | "multilines";
  trigger: ReactNode;
  title?: ReactNode;
  content: ReactNode;
};

const Tooltip = ({ className, variant = "paragraph", trigger, title, content }: TooltipProps) => {
  const { rootProps, triggerProps } = useTooltipMobile();

  return (
    <T.Provider delayDuration={100}>
      <T.Root {...rootProps}>
        <T.Trigger asChild {...triggerProps}>
          <button className={S.trigger}>{trigger}</button>
        </T.Trigger>
        <T.Portal>
          <T.Content className={cn(className, S.tooltip({ state: variant }))} sideOffset={5}>
            {!!title && variant === "multilines" && <h4 className={S.title}>{title}</h4>}
            {content}
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
};

export default Tooltip;
