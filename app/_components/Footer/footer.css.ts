import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "../../../theme/utils";
import { colors } from "../../../theme/theme.css";

export const footer = style({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingInline: pxToRem(32),
  paddingBlock: pxToRem(21),
  fontSize: pxToRem(12),
  lineHeight: 1,

  "@media": {
    "screen and (max-width: 768px)": {
      paddingBlockStart: pxToRem(30),
      paddingBlockEnd: pxToRem(20),
      paddingInline: pxToRem(20),
      flexDirection: "column",
      alignItems: "flex-start",
      gap: pxToRem(16),
    },
  },
});

export const copy = style({
  color: colors.black600,
});

export const content = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(32),
  "@media": {
    "screen and (max-width: 768px)": {
      alignItems: "flex-start",
      flexDirection: "column-reverse",
      gap: pxToRem(16),
    },
  },
});

export const linksContainer = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(16),
});

export const link = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(8),
  opacity: 0.3,
  transition: "opacity 0.3s",

  selectors: {
    "&:hover": {
      opacity: 1,
    },
  },
});

export const blockHeight = recipe({
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: pxToRem(2),

    "@media": {
      "screen and (max-width: 768px)": {
        position: "absolute",
        top: pxToRem(27),
        right: pxToRem(20),
      },
    },
  },
  variants: {
    state: {
      idle: {
        color: colors.black600,
      },
      warning: {
        color: colors.yellow900,
      },
      error: {
        color: colors.red900,
      },
      default: {
        color: colors.green900,
      },
    },
  },
  defaultVariants: {
    state: "idle",
  },
});

export const blockHeightLoading = style({});

globalStyle(`${blockHeightLoading} > span`, {
  opacity: 0.5,
});

export const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

export const loaderContainer = style({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  blockSize: pxToRem(20),
  inlineSize: pxToRem(20),
});

export const loader = recipe({
  base: {
    display: "block",
    blockSize: pxToRem(6),
    inlineSize: pxToRem(6),
    borderRadius: "100%",
    backgroundColor: colors.red900,
  },
  variants: {
    state: {
      idle: {
        backgroundColor: colors.black600,
      },
      warning: {
        backgroundColor: colors.yellow900,
      },
      error: {
        backgroundColor: colors.red900,
      },
      default: {
        backgroundColor: colors.green900,
      },
    },
  },
  defaultVariants: {
    state: "idle",
  },
});

export const loaderArc = style({
  opacity: 0.5,
  position: "absolute",
  insetInlineEnd: pxToRem(0),
  insetBlockEnd: pxToRem(0),
  blockSize: "100%",
  inlineSize: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

globalStyle(`${loaderArc} svg`, {
  blockSize: pxToRem(14),
  inlineSize: pxToRem(14),
  transformOrigin: "center",
  animation: `${rotate} 1.5s linear infinite`,
});
