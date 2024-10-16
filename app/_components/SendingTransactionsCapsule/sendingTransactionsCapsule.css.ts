import { style } from "@vanilla-extract/css";
import { colors, weights } from "../../../theme/theme.css";
import { pxToRem } from "@/theme/utils";

export const sendingTransactionsCapsule = style({
  position: "fixed",
  insetInlineStart: pxToRem(20),
  insetBlockEnd: pxToRem(20),
  inlineSize: pxToRem(280),
  blockSize: pxToRem(70),
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: pxToRem(12),
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

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(8),
});

export const title = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(6),
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
  display: "flex",
  color: colors.black000,
});

export const checkIcon = style({
  display: "flex",
  color: colors.green900,
});
