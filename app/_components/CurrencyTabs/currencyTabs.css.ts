import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "@/theme/utils";
import { colors, weights } from "@/theme/theme.css";

export const tabs = style({
  display: "flex",
  padding: pxToRem(4),
  gap: pxToRem(2),
  borderRadius: pxToRem(8),
  backgroundColor: colors.black750,

  "@media": {
    "screen and (max-width: 768px)": {
      display: "none",
      visibility: "hidden",
    },
  },
});

export const tabButton = recipe({
  base: {
    textAlign: "center",
    paddingBlock: pxToRem(5),
    paddingInline: pxToRem(6),
    borderRadius: pxToRem(4),
    fontSize: pxToRem(14),
    fontWeight: weights.semibold,
  },
  variants: {
    state: {
      default: {
        color: colors.black600,
        backgroundColor: "transparent",
        transition: "color .3s, background-color .3s",
        ":hover": {
          color: colors.black000,
          backgroundColor: colors.black900,
        },
      },
      highlighted: {
        color: colors.black000,
        backgroundColor: colors.black900,
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const selectTabs = style({
  display: "none",
  visibility: "hidden",

  "@media": {
    "screen and (max-width: 768px)": {
      display: "block",
      visibility: "visible",
    },
  },
});

export const selectTrigger = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  blockSize: "100%",
});

export const selectOptionText = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  textAlign: "center",
  minInlineSize: pxToRem(48),
});
