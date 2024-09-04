import { style } from "@vanilla-extract/css";
import { colors, weights } from "../../../theme/theme.css";
import { pxToRem } from "@/theme/utils";

export const pendingTransactionsCapsule = style({
  position: "fixed",
  left: pxToRem(20),
  bottom: pxToRem(20),
  blockSize: pxToRem(70),
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: pxToRem(10),
  backgroundColor: colors.black700,
  borderRadius: pxToRem(8),
  paddingInline: pxToRem(16),
  boxShadow: "0px 0px 25px 0px #00000040",
  zIndex: 1,
});

export const count = style({
  inlineSize: pxToRem(32),
  blockSize: pxToRem(32),
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.black600,
  color: colors.black100,
  fontSize: pxToRem(16),
  lineHeight: 1,
  fontWeight: weights.bold,
});

export const title = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(4),
  color: colors.black000,
  fontSize: pxToRem(16),
  lineHeight: 1,
  fontWeight: weights.bold,
});

export const description = style({
  color: colors.black300,
  fontSize: pxToRem(14),
  lineHeight: 1,
});

export const loadingIcon = style({
  color: colors.black000,
});
