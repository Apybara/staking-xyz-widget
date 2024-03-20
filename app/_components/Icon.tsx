export type IconProps = {
  name: "chevron" | "copy" | "check";
  size?: number;
};

export const Icon = ({ name, size = 14 }: IconProps) => {
  return (
    <svg width={size} height={size} style={{ color: "inherit" }}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};
