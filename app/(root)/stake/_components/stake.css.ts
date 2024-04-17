import { globalStyle, style } from "@vanilla-extract/css";
import { colors, weights } from "../../../../theme/theme.css";
import { pxToRem } from "@/theme/utils";

export const bottomBox = style({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
});

export const rewardInfoValue = style({
  color: colors.green900,
});

export const rewardsTooltip = style({
  width: pxToRem(200),
});

export const rewardsList = style({});

globalStyle(`${rewardsList} > * + *`, {
  marginBlockStart: pxToRem(16),
});

export const rewardsItem = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const rewardsInterval = style({
  fontWeight: weights.bold,
  display: "flex",
  alignItems: "center",

  selectors: {
    "&::before": {
      content: "",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      backgroundColor: colors.black600,
      marginInlineEnd: pxToRem(8),
    },
  },
});

export const rewardsValue = style({
  fontWeight: weights.regular,
  color: colors.black300,
});

export const plusSign = style({
  color: colors.black300,
});

export const unstakingTooltip = style({
  width: pxToRem(300),
});

export const approvalTooltip = style({
  width: pxToRem(250),
});

globalStyle(`${approvalTooltip} a`, {
  color: colors.black300,
  textDecoration: "underline",
  fontWeight: weights.regular,
});
