import { type RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const tag = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: pxToRem(2),
    fontSize: pxToRem(12),
    fontWeight: weights.semibold,
    lineHeight: 1,
    paddingBlock: pxToRem(4),
    paddingInline: pxToRem(6),
    borderRadius: pxToRem(4),
  },
  variants: {
    variant: {
      neutral: {
        backgroundColor: colors.black750,
        color: colors.black000,
      },
      warning: {
        backgroundColor: colors.yellow100,
        color: colors.yellow900,
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export type TagVariants = RecipeVariants<typeof tag>;
