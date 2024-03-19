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
});

export const tabButton = recipe({
  base: {
    textAlign: "center",
    padding: pxToRem(6),
    borderRadius: pxToRem(4),
    fontSize: pxToRem(14),
    fontWeight: weights.semibold,
  },
  variants: {
    state: {
      default: {
        color: colors.black600,
        backgroundColor: "transparent",
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
