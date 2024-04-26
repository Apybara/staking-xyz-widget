import type { ReactNode } from "react";
import type { TagVariants } from "./messageTag.css";
import cn from "classnames";
import { tag } from "./messageTag.css";

export type MessageTagProps = TagVariants & {
  className?: string;
  children: ReactNode;
};

export const MessageTag = ({ variant, className, children }: MessageTagProps) => {
  return <p className={cn(tag({ variant }), className)}>{children}</p>;
};
