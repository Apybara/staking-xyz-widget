import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors } from "../../../theme/theme.css";

export const main = style({
  minInlineSize: pxToRem(280),
  paddingBlockStart: pxToRem(24),
});

export const logoWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBlockEnd: pxToRem(16),
});

export const accountBox = style({
  textAlign: "center",
  marginBlockEnd: pxToRem(24),
});

export const addressBox = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: pxToRem(4),
  marginBlockEnd: pxToRem(4),
});

export const balanceBox = style({
  fontSize: pxToRem(14),
  color: colors.black300,
});
