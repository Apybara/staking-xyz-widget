import numbro from "numbro";

export const getPercentagedNumber = (val: number, formatOptions?: numbro.Format) => {
  return numbro(val).format({
    output: "percent",
    mantissa: 2,
    ...formatOptions,
  });
};
