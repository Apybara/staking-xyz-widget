"use client";

import type { ButtonHTMLAttributes } from "react";
import cn from "classnames";
import { useClipboard } from "use-clipboard-copy";
import { Icon } from "../Icon";
import * as S from "./copyButton.css";

export type CopyButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  size?: number;
  content: string | number;
};

export const CopyButton = ({ size, content, className, onClick, ...props }: CopyButtonProps) => {
  const copyClipboard = useClipboard({ copiedTimeout: 1000 });

  return (
    <button
      className={cn(S.button, className)}
      onClick={(e) => {
        onClick && onClick(e);
        copyClipboard.copy(content);
      }}
      data-copied={copyClipboard.copied}
      {...props}
    >
      <Icon name={copyClipboard.copied ? "check" : "copy"} />
    </button>
  );
};
