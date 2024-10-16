import { globalStyle, style } from "@vanilla-extract/css";
import { colors, weights } from "../../../../theme/theme.css";
import { pxToRem } from "../../../../theme/utils";

export const triggerTexts = style({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
export const triggerProgressText = style({
  fontSize: pxToRem(14),
  color: colors.black300,
});
export const triggerCountText = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  color: colors.black000,
});
export const triggerAmountText = style({
  fontSize: pxToRem(14),
  color: colors.black000,
});
globalStyle(`.accordionInfoCardHeader[data-state="open"] ${triggerAmountText}`, {
  display: "none",
});
export const remainingDays = style({
  fontSize: pxToRem(14),
  color: colors.black000,
});

export const rewardInfoValue = style({
  color: colors.green900,
});

export const unstakingStatus = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(4),
});

export const plusSign = style({
  color: colors.black300,
});

export const unstakingTooltip = style({
  maxInlineSize: pxToRem(303),
  textAlign: "center",
});

export const claimableStatus = style({
  display: "block",
  blockSize: pxToRem(6),
  inlineSize: pxToRem(6),
  borderRadius: "100%",
  backgroundColor: colors.yellow900,
});

export const withdrawableTooltip = style({
  maxInlineSize: pxToRem(148),
  padding: pxToRem(16),
  backgroundColor: colors.green100,
  border: 0,
  color: colors.green900,
  textAlign: "center",
  borderRadius: pxToRem(8),
});

export const withdrawButton = style({
  backgroundColor: colors.green100,
  border: 0,
  borderRadius: pxToRem(8),
  color: colors.green900,
  blockSize: pxToRem(24),
  paddingInline: pxToRem(8),
  fontSize: pxToRem(12),
  lineHeight: 1,
  fontWeight: weights.bold,
});

export const withdrawTooltipArrow = style({
  fill: colors.green100,
});
