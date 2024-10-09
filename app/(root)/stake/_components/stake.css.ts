import { globalStyle, style } from "@vanilla-extract/css";
import { colors, weights } from "../../../../theme/theme.css";
import { pxToRem } from "@/theme/utils";
import { recipe } from "@vanilla-extract/recipes";

export const rewardInfo = style({});
export const rewardInfoValue = style({});

globalStyle(`${rewardInfo} ${rewardInfoValue}`, {
  color: colors.green900,
});

export const plusSign = style({
  color: colors.black300,
});

export const stakingTooltip = style({
  maxInlineSize: pxToRem(250),
});

export const feesTooltip = style({
  maxInlineSize: pxToRem(303),
  textAlign: "center",
});

export const approvalTooltip = style({
  maxInlineSize: pxToRem(300),
});

export const accordionButtonContainer = style({
  padding: pxToRem(4),
});

export const accordionButton = style({
  backgroundColor: colors.black900,
  height: pxToRem(22),
  inlineSize: "100%",
  borderRadius: pxToRem(4),
  color: colors.black600,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "color .3s, background-color .3s, transform .3s",

  selectors: {
    "&:hover": {
      backgroundColor: colors.black700,
      color: colors.black300,
    },
  },
});

export const accordionButtonIcon = recipe({
  base: {
    transform: "rotate(90deg)",
  },
  variants: {
    state: {
      default: {},
      open: {
        transform: "rotate(270deg)",
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const infoCardContainer = style({
  border: `1px solid ${colors.black700}`,
  borderRadius: pxToRem(8),
  backgroundColor: colors.black750,
});

export const infoCard = recipe({
  base: {
    border: 0,
  },
  variants: {
    state: {
      default: {},
      hasAccordion: {
        paddingBlockEnd: pxToRem(10),
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

globalStyle(`${approvalTooltip} a`, {
  color: colors.black300,
  textDecoration: "underline",
  fontWeight: weights.regular,
});
