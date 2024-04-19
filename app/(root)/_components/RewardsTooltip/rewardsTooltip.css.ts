import { globalStyle, style } from "@vanilla-extract/css";
import { colors, weights } from "../../../../theme/theme.css";
import { pxToRem } from "@/theme/utils";

export const rewardsTooltip = style({
  inlineSize: pxToRem(200),
});

export const rewardsList = style({});

globalStyle(`${rewardsList} > * + *`, {
  marginBlockStart: pxToRem(12),
});

export const rewardsItem = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  lineHeight: 1,
});

export const rewardsInterval = style({
  fontWeight: weights.bold,
  display: "flex",
  alignItems: "center",

  selectors: {
    "&::before": {
      content: "",
      inlineSize: "4px",
      blockSize: "4px",
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
