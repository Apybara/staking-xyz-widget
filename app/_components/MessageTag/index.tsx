import type { TagVariants } from "./messageTag.css";
import cn from "classnames";
import { tag } from "./messageTag.css";

export type MessageTagProps = TagVariants & {
  message: string;
};

export const MessageTag = ({ message, variant }: MessageTagProps) => {
  return <p className={cn(tag({ variant }))}>{message}</p>;
};
