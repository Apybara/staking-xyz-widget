import numbro from "numbro";

export const getPercentagedNumber = (val: number, formatOptions?: numbro.Format) => {
  return numbro(val).format({
    output: "percent",
    mantissa: 2,
    ...formatOptions,
  });
};

export const getDoesNumberHasDecimals = (val: number) => {
  if (isNaN(val)) return false;
  return val % 1 !== 0;
};

export const getDecimalCounts = (val: number) => {
  if (!getDoesNumberHasDecimals(val)) return 0;
  return val.toString().split(".")[1].length;
};

export const getFormattedMantissa = ({ val, maxMantissa }: { val?: number | string; maxMantissa?: number }) => {
  if (!val || val === "0" || isNaN(Number(val))) return 0;

  const count = getDecimalCounts(Number(val));
  if (!maxMantissa) return count;
  return count > maxMantissa ? maxMantissa : count;
};
