import { type RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const tabButton = recipe({
  base: {
    fontSize: pxToRem(14),
    fontWeight: weights.semibold,
    textAlign: "center",
    borderRadius: pxToRem(6),
    lineHeight: 1,
    padding: pxToRem(6),
  },
  variants: {
    state: {
      default: {
        color: colors.black600,
        backgroundColor: "transparent",
        transition: "color .3s, background-color .3s",

        selectors: {
          "&:hover": {
            color: colors.black000,
            backgroundColor: colors.black900,
          },
        },
      },
      highlighted: {
        color: colors.black000,
        backgroundColor: colors.black900,
      },
      disabled: {
        cursor: "not-allowed",
        color: colors.black750,
        backgroundColor: "transparent",
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export type TabButtonVariants = RecipeVariants<typeof tabButton>;
