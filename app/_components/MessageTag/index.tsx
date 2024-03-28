import type { ReactNode } from "react";
import type { TagVariants } from "./messageTag.css";
import cn from "classnames";
import { tag } from "./messageTag.css";

export type MessageTagProps = TagVariants & {
  children: ReactNode;
};

export const MessageTag = ({ variant, children }: MessageTagProps) => {
  return <p className={cn(tag({ variant }))}>{children}</p>;
};
