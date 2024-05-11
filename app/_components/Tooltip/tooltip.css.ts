import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "@/theme/utils";
import { colors, weights } from "@/theme/theme.css";

export const tooltip = recipe({
  base: {
    backgroundColor: colors.black700,
    borderRadius: pxToRem(8),
    color: colors.black000,
    fontSize: pxToRem(14),
    fontWeight: weights.semibold,
    border: `1px solid ${colors.black800}`,
    boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.16)",
    lineHeight: pxToRem(20),
  },
  variants: {
    state: {
      paragraph: {
        paddingBlock: pxToRem(10),
        paddingInline: pxToRem(16),
      },
      multilines: {
        padding: pxToRem(16),
      },
    },
  },
  defaultVariants: {
    state: "paragraph",
  },
});

export const trigger = style({
  display: "flex",
  color: colors.black600,
  cursor: "default",
});

export const title = style({
  color: colors.black300,
  fontWeight: weights.bold,
  marginBlockEnd: pxToRem(16),
});
