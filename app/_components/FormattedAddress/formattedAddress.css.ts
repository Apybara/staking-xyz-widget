import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const main = style({
  fontSize: pxToRem(14),
});

export const prefixString = style({
  lineHeight: 1,
  fontSize: "inherit",
  color: colors.black300,
  fontWeight: weights.regular,
});

export const start = style({
  lineHeight: 1,
  fontSize: "inherit",
  color: colors.black000,
  fontWeight: weights.semibold,
});

export const ellipsis = style({
  lineHeight: 1,
  fontSize: "inherit",
  color: colors.black300,
  fontWeight: weights.regular,
});

export const end = style({
  lineHeight: 1,
  fontSize: "inherit",
  color: colors.black000,
  fontWeight: weights.semibold,
});
