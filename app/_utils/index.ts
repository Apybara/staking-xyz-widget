export const removeLeadingAndTrailingZeros = (val: string) => {
  // Remove leading zeros except in cases like "0.01"
  const noLeadingZeros = val.replace(/^0+(?!\.)/, "");

  // Split the string into integer and decimal parts
  const [integerString, decimalString] = noLeadingZeros.split(".");

  if (!decimalString) {
    // If there's no decimal part, return the integer string directly
    return integerString;
  }

  // Remove trailing zeros in the decimal part, if any
  const trimmedDecimalString = decimalString.replace(/0+$/, "");

  // If the decimal part becomes empty after trimming, return just the integer part
  if (trimmedDecimalString === "") {
    return integerString;
  }

  // Otherwise, recombine the integer and non-empty decimal part
  return `${integerString}.${trimmedDecimalString}`;
};
