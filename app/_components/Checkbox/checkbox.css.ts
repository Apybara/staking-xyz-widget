import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "@/theme/utils";
import { colors, weights } from "@/theme/theme.css";

export const checkbox = recipe({
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    overflow: "hidden",
    inlineSize: "100%",
    padding: pxToRem(10),
    borderRadius: pxToRem(8),
    border: `1px solid ${colors.black800}`,
    fontSize: pxToRem(14),
    fontWeight: weights.semibold,
  },
  variants: {
    state: {
      default: {
        backgroundColor: colors.black900,
        color: colors.black600,
      },
      checked: {
        backgroundColor: colors.black700,
        color: colors.black000,
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const input = style({
  height: 0,
  opacity: 0,
  position: "absolute",
});

export const label = style({
  marginLeft: pxToRem(10),
});

globalStyle(`${label} a`, {
  textDecoration: "underline",
});
