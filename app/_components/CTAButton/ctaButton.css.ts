import { type RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const button = recipe({
  base: {
    fontSize: pxToRem(16),
    fontWeight: weights.semibold,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: "100%",
    gap: pxToRem(8),
    borderRadius: pxToRem(8),
    padding: `${pxToRem(16)} ${pxToRem(20)}`,
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: colors.green900,
        color: colors.black900,
      },
      secondary: {
        backgroundColor: colors.green100,
        color: colors.green900,
      },
      tertiary: {
        backgroundColor: colors.black700,
        color: colors.black000,
      },
    },
    state: {
      default: {},
      loading: {
        pointerEvents: "none",
        cursor: "progress",
      },
      disabled: {
        pointerEvents: "none",
        cursor: "not-allowed",
        backgroundColor: colors.black700,
        color: colors.black600,
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        variant: "primary",
        state: "loading",
      },
      style: {
        color: colors.black900,
      },
    },
    {
      variants: {
        variant: "secondary",
        state: "loading",
      },
      style: {
        color: "rgba(1, 233, 83, 0.5)",
      },
    },
    {
      variants: {
        variant: "tertiary",
        state: "loading",
      },
      style: {
        color: colors.black600,
      },
    },
  ],
  defaultVariants: {
    variant: "primary",
    state: "default",
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
