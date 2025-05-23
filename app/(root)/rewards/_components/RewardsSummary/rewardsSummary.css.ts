import { globalStyle, style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../../theme/utils";
import { colors } from "../../../../../theme/theme.css";

export const card = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: pxToRem(10),
  backgroundColor: colors.black700,
  border: `1px solid ${colors.black800}`,
  borderRadius: pxToRem(8),
  paddingInline: pxToRem(20),
  paddingBlockStart: pxToRem(16),
  paddingBlockEnd: pxToRem(20),
});

export const cardTitle = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(4),
});
globalStyle(`${cardTitle} h3`, {
  textAlign: "center",
  fontSize: pxToRem(12),
  lineHeight: 1,
  color: colors.black300,
});

export const cardValue = style({
  textAlign: "center",
  fontSize: pxToRem(24),
  lineHeight: 1,
  color: colors.black000,
});

export const rewardInfoValue = style({
  color: colors.green900,
});

export const link = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: pxToRem(4),
  fontSize: pxToRem(14),
  lineHeight: 1,
  color: colors.black600,
  transition: "color .3s",

  selectors: {
    "&:hover": {
      color: colors.black300,
    },
  },
});

export const ctaButtons = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(16),
  inlineSize: "100%",
});

export const ctaButton = style({
  marginBlockStart: "auto",
});

export const tooltip = style({
  maxInlineSize: pxToRem(300),
});
