import { createGlobalTheme } from "@vanilla-extract/css";
import { tonalPalette } from "./colors";

export const vars = createGlobalTheme(":root", {
  color: {
    ...tonalPalette,
  },
  typography: {
    fonts: {
      primary:
        '"Pretendard Std", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    },
    weights: {
      regular: "400",
      semibold: "500",
      bold: "600",
    },
    features: {
      monospaced: '"tnum", "zero"',
    },
  },
});

export const colors = vars.color;
export const typography = vars.typography;
export const weights = vars.typography.weights;
export const monospaced = vars.typography.features.monospaced;
