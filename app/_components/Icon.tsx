export type IconProps = {
  name: "chevron";
  width?: number;
  height?: number;
};

export const Icon = ({ name, width, height }: IconProps) => {
  return (
    <svg width={width || 14} height={height || 14} style={{ color: "inherit" }}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};
