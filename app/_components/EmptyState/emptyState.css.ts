import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: pxToRem(8),
});

export const title = style({
  fontSize: pxToRem(16),
  lineHeight: 1,
  fontWeight: weights.bold,
  color: colors.black000,
});

export const subtitle = style({
  fontSize: pxToRem(14),
  lineHeight: 1,
  color: colors.black300,
});
