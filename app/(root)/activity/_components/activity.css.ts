import { colors, weights } from "@/theme/theme.css";
import { pxToRem } from "@/theme/utils";
import { globalStyle, style } from "@vanilla-extract/css";

export const infoBanner = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: pxToRem(8),
  padding: pxToRem(8),
  borderRadius: pxToRem(8),
  fontSize: pxToRem(14),
  lineHeight: pxToRem(20),
  fontWeight: weights.bold,
  color: colors.black300,
  backgroundColor: colors.black900,
  border: `1px solid ${colors.black700}`,
  boxShadow: "0px 0px 12px 0px #00000029",
});

export const errorPad = style({
  justifyContent: "center !important",
});
