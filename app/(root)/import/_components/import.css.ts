import { globalStyle, style } from "@vanilla-extract/css";
import { colors, weights } from "../../../../theme/theme.css";
import { pxToRem } from "@/theme/utils";
import { recipe } from "@vanilla-extract/recipes";

export const importTop = style({});

globalStyle(`${importTop} h1`, {
  marginInlineEnd: 0,
});

export const helpButton = style({
  display: "flex",
  color: colors.black300,

  selectors: {
    "&:hover": {
      color: colors.black000,
    },
  },
});

export const infoBox = style({
  padding: pxToRem(20),
});

export const infoBoxStack = style({});
globalStyle(`${infoBoxStack} > * + *`, {
  marginBlockStart: pxToRem(16),
});

export const infoBoxText = recipe({
  variants: {
    state: {
      default: {
        color: colors.black100,
      },
      up: {
        color: colors.green900,
      },
      down: {
        color: colors.yellow900,
      },
    },
  },
});

export const rewardInfo = style({});
export const rewardInfoContent = style({
  display: "flex",
  gap: pxToRem(8),
});
export const rewardInfoValue = style({});
export const rewardInfoValueSlashed = style({
  textDecoration: "line-through",
});

globalStyle(`${rewardInfo} ${rewardInfoContent}`, {
  color: colors.black300,
});

globalStyle(`${rewardInfo} ${rewardInfoValue}`, {
  color: colors.green900,
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
