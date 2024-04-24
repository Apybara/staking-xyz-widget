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
