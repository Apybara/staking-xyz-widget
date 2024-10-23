import cn from "classnames";

export type IconProps = {
  name:
    | "chevron"
    | "copy"
    | "circleCheck"
    | "circleCross"
    | "externalLink"
    | "cross"
    | "refresh"
    | "menu"
    | "conversion"
    | "arrow"
    | "info"
    | "question"
    | "rotate"
    | "forward"
    | "arc"
    | "download"
    | "x"
    | "telegram"
    | "doc"
    | "sent"
    | "skip"
    | "warning";
  size?: number;
  className?: string;
};

export const Icon = ({ name, size = 14, className }: IconProps) => {
  return (
    <svg width={size} height={size} className={cn(className)} style={{ color: "inherit" }}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};
