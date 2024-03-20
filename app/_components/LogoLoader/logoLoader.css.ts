import { style, keyframes } from "@vanilla-extract/css";

const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "5%, 25%": { transform: "rotate(90deg)" },
  "30%, 50%": { transform: "rotate(180deg)" },
  "55%, 75%": { transform: "rotate(270deg)" },
  "80%, 100%": { transform: "rotate(360deg)" },
});

export const main = style({
  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      animation: `${rotate} 10s cubic-bezier(0, 0, 0, 1) infinite`,
    },
  },
});
