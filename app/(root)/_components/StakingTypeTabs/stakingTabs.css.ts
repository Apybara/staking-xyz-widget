import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "@/theme/utils";
import { colors, weights } from "@/theme/theme.css";

export const tabs = style({
  display: "flex",
  justifyContent: "space-between",
  padding: pxToRem(4),
  gap: pxToRem(2),
  borderRadius: pxToRem(8),
  backgroundColor: colors.black900,
});

export const tab = style({
  width: "100%",
});

export const tabButton = recipe({
  base: {
    width: "100%",
    textAlign: "center",
    paddingBlock: pxToRem(5),
    paddingInline: pxToRem(6),
    borderRadius: pxToRem(4),
    fontSize: pxToRem(14),
    fontWeight: weights.semibold,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: pxToRem(4),
  },
  variants: {
    state: {
      default: {
        color: colors.black600,
        backgroundColor: "transparent",
        transition: "color .3s, background-color .3s",
        ":hover": {
          color: colors.black000,
          backgroundColor: colors.black750,
        },
      },
      highlighted: {
        color: colors.black000,
        backgroundColor: colors.black750,
      },
      disabled: {
        color: colors.black600,
        cursor: "not-allowed",
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const tooltip = style({
  maxInlineSize: pxToRem(300),
});
