import { keyframes, style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const defaultTop = style({
  display: "flex",
  justifyContent: "space-between",
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
export const redelegateButton = style({
  borderRadius: pxToRem(4),
  paddingInline: pxToRem(8),
  blockSize: pxToRem(26),
  backgroundColor: colors.green100,
  color: colors.green900,
  fontSize: pxToRem(14),
  fontWeight: weights.bold,
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  gap: pxToRem(5),
});

export const buttonContainer = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(12),
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
        animation: `${rotate} 1.5s linear infinite`,
      },
    },
  },
});

export const link = style({
  display: "flex",
});
