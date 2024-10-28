import { globalStyle, style } from "@vanilla-extract/css";
import { colors, weights } from "../../../../theme/theme.css";
import { pxToRem } from "../../../../theme/utils";
import { recipe } from "@vanilla-extract/recipes";

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

export const withdrawableTooltip = recipe({
  base: {
    maxInlineSize: pxToRem(240),
    padding: pxToRem(16),
    backgroundColor: colors.green100,
    border: 0,
    color: colors.green900,
    textAlign: "center",
    borderRadius: pxToRem(8),
  },
  variants: {
    variant: {
      active: {},
      neutral: {
        color: colors.black600,
        backgroundColor: colors.black700,
      },
      warning: {
        color: colors.yellow900,
        backgroundColor: colors.yellow100,
      },
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

export const withdrawButton = recipe({
  base: {
    backgroundColor: colors.green100,
    border: 0,
    borderRadius: pxToRem(8),
    color: colors.green900,
    blockSize: pxToRem(24),
    paddingInline: pxToRem(8),
    fontSize: pxToRem(12),
    lineHeight: 1,
    fontWeight: weights.bold,
  },
  variants: {
    variant: {
      active: {},
      neutral: {
        cursor: "progress",
        color: colors.black600,
        backgroundColor: colors.black700,
      },
      warning: {
        cursor: "not-allowed",
        color: colors.yellow900,
        backgroundColor: colors.yellow100,
        opacity: 0.5,
      },
    },
  },
  defaultVariants: {
    variant: "active",
  },
});

export const withdrawTooltipArrow = recipe({
  base: {
    fill: colors.green100,
  },
  variants: {
    variant: {
      active: {},
      neutral: {
        fill: colors.black700,
      },
      warning: {
        fill: colors.yellow100,
      },
    },
  },
  defaultVariants: {
    variant: "active",
  },
});
