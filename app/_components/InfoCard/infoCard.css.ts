import { style, globalStyle } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";
import { borderedCard } from "../../../theme/baseStyles.css";

export const card = style([
  borderedCard,
  {
    borderRadius: `${pxToRem(8)} !important`,
    inlineSize: "100%",
  },
]);

export const stack = style({});
globalStyle(`${stack} > * + *`, {
  marginBlockStart: pxToRem(24),
});

export const stackItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const title = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  lineHeight: 1,
  color: colors.black000,
});

export const titleBox = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(4),
});

export const titleIcon = style({
  lineHeight: 0,
  color: colors.black600,
});

export const content = style({
  fontSize: pxToRem(14),
  lineHeight: 1,
  color: colors.black000,
});
