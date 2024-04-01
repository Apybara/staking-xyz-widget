export type IconProps = {
  name: "chevron" | "copy" | "check" | "external-link" | "cross" | "refresh" | "menu";
  size?: number;
  transform?: string;
};

export const Icon = ({ name, size = 14, transform }: IconProps) => {
  return (
    <svg width={size} height={size} transform={transform} style={{ color: "inherit" }}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};
