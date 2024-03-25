import { style, keyframes } from "@vanilla-extract/css";
import { colors } from "../../../theme/theme.css";

const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const spinner = style({
  transformOrigin: "center",
  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      animation: `${rotate} 1s cubic-bezier(0, 0, 0, 1) infinite`,
    },
  },
});

export const main = style({
  color: colors.black000,
});
