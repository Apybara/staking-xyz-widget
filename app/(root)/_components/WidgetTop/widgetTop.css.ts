import { keyframes, style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const defaultTop = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: pxToRem(16),
});

export const pageTop = style({
  display: "flex",
  alignItems: "center",
  padding: pxToRem(16),
  zIndex: 2,
  borderBottom: `1px solid transparent`,
  transition: "background-color 0.3s",
});

export const pageTopFixed = style({
  backgroundColor: colors.black750,
  borderColor: colors.black700,
  boxShadow: "0px 0px 50px 0px #00000080",
});

export const title = style({
  fontSize: pxToRem(20),
  fontWeight: weights.semibold,
  lineHeight: pxToRem(27),
  textAlign: "center",
  flexGrow: 1,
  marginInlineEnd: 20,
});

export const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const redelegateButton = recipe({
  base: {
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
  },
  variants: {
    state: {
      default: {},
      disabled: {
        opacity: 0.5,
        pointerEvents: "none",
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const buttonContainer = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(12),
  blockSize: pxToRem(28),
});

export const button = recipe({
  base: {
    lineHeight: 0,
    color: colors.black600,
    transition: "color .3s",

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
