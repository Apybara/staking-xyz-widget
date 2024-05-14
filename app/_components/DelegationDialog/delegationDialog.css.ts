import { recipe } from "@vanilla-extract/recipes";
import { style, globalStyle } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const shell = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(20),
  inlineSize: `clamp(240px, calc(100vw - 20px), 340px)`,
});

export const topBox = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: pxToRem(12),
});

export const icons = style({
  marginInline: "auto",
  color: colors.black300,
});
globalStyle(`${icons} > *:first-child`, {
  marginInlineEnd: pxToRem(-5),
  position: "relative",
  zIndex: 1,
});
globalStyle(`${icons} > *:last-child`, {
  marginInlineStart: pxToRem(-5),
});

export const title = style({
  fontSize: pxToRem(18),
  lineHeight: 1,
  fontWeight: weights.semibold,
  textAlign: "center",
  color: colors.black000,
});

export const item = style({
  blockSize: pxToRem(20),
});

export const itemIcon = recipe({
  base: {
    lineHeight: 0,
  },
  variants: {
    checked: {
      true: {
        color: colors.black000,
      },
      false: {
        color: colors.black600,
      },
    },
  },
  defaultVariants: {
    checked: false,
  },
});

export const itemText = recipe({
  base: {
    fontSize: pxToRem(14),
    fontWeight: weights.semibold,
    lineHeight: 1,
    color: colors.black600,
  },
  variants: {
    highlighted: {
      true: {
        color: colors.black000,
      },
      false: {
        color: colors.black600,
      },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});

export const resultButtons = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(16),
});

export const itemEndBox = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(6),
});

export const cancelButton = style({
  cursor: "pointer",
  color: colors.black300,
  lineHeight: 0,

  selectors: {
    "&:hover": {
      color: colors.black000,
    },
  },
});

export const successTag = style({
  paddingInlineEnd: pxToRem(4),
});
export const successTagIcon = style({
  selectors: {
    [`${successTag}:hover &`]: {
      transition: "transform 0.2s",
      transform: "translate3d(1px, -1px, 0)",
    },
  },
});
