import { keyframes, style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const defaultTop = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: pxToRem(12),
  marginInlineEnd: pxToRem(2),
  paddingBlock: pxToRem(4),
});

export const pageTop = style({
  display: "flex",
  alignItems: "center",
  blockSize: pxToRem(28),
});

export const title = style({
  fontSize: pxToRem(20),
  fontWeight: weights.semibold,
  lineHeight: 1,
  textAlign: "center",
  flexGrow: 1,
  marginInlineEnd: 20,
});

export const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const button = recipe({
  base: {
    lineHeight: 0,
    color: colors.black600,

    selectors: {
      "&:hover": {
        color: colors.black000,
      },
    },
  },
  variants: {
    state: {
      default: {},
      fetching: {
        color: colors.black000,
        transformOrigin: "center",
        animation: `${rotate} 1s cubic-bezier(0, 0, 0, 1) infinite`,
      },
    },
  },
});

export const link = style({
  display: "flex",
});
