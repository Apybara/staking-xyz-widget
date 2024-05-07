import { globalStyle, style } from "@vanilla-extract/css";
import { colors, weights } from "../../../../theme/theme.css";
import { pxToRem } from "@/theme/utils";

export const rewardInfo = style({});
export const rewardInfoValue = style({});

globalStyle(`${rewardInfo} ${rewardInfoValue}`, {
  color: colors.green900,
});

export const plusSign = style({
  color: colors.black300,
});

export const unstakingTooltip = style({
  maxInlineSize: pxToRem(250),
});

export const approvalTooltip = style({
  maxInlineSize: pxToRem(300),
});

globalStyle(`${approvalTooltip} a`, {
  color: colors.black300,
  textDecoration: "underline",
  fontWeight: weights.regular,
});
