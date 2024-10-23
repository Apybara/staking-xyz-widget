import { colors, weights } from "@/theme/theme.css";
import { pxToRem } from "@/theme/utils";
import { style } from "@vanilla-extract/css";

export const banner = style({
  inlineSize: "100%",
  marginBlockEnd: pxToRem(20),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: pxToRem(6),
  paddingBlock: pxToRem(8),
  paddingInlineStart: pxToRem(10),
  paddingInlineEnd: pxToRem(12),
  borderRadius: pxToRem(20),
  fontSize: pxToRem(14),
  lineHeight: 1,
  fontWeight: weights.bold,
  color: colors.black000,
  background: colors.gradientBg,
  border: `1px solid ${colors.black700}`,
});

export const bannerMain = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(6),
});

export const bannerWarning = style({
  color: `${colors.yellow900} !important`,
});

export const bannerChevron = style({
  transform: "rotate(-90deg)",
});

export const dialog = style({
  inlineSize: `clamp(300px, 100%, 320px)`,
  border: `1px solid ${colors.gradientBg}`,
});

export const dialogTop = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: pxToRem(16),
  paddingBlockStart: pxToRem(8),
  marginBlockEnd: pxToRem(24),
});

export const dialogTitle = style({
  fontSize: pxToRem(18),
  lineHeight: 1,
  textAlign: "center",
  color: colors.black000,
  fontWeight: weights.semibold,
});

export const dialogWarning = style({
  color: `${colors.yellow900} !important`,
});

export const dialogMain = style({
  borderRadius: pxToRem(8),
  border: `1px solid ${colors.black700}`,
  padding: pxToRem(16),
  marginBlockEnd: pxToRem(20),
});

export const dialogDescription = style({
  fontSize: pxToRem(14),
  fontWeight: weights.regular,
  lineHeight: 1.4,
  color: colors.black000,
});
