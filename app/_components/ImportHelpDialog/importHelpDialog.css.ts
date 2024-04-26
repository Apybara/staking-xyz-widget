import { style, globalStyle } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const content = style({
  inlineSize: "100%",
  maxInlineSize: pxToRem(320),
  padding: pxToRem(16),
  paddingBlockStart: pxToRem(24),
});

export const topBox = style({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
  gap: pxToRem(16),
  color: colors.black300,
});

export const title = style({
  fontSize: pxToRem(18),
  fontWeight: weights.bold,
  lineHeight: pxToRem(24),
  color: colors.black000,
  maxInlineSize: pxToRem(257),
});

export const benefits = style({
  borderRadius: pxToRem(8),
  backgroundColor: colors.black750,
  border: `1px solid ${colors.black700}`,
  padding: pxToRem(20),
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(16),
  marginBlockStart: pxToRem(24),
  marginBlockEnd: pxToRem(20),
});

export const benefitsItem = style({
  fontSize: pxToRem(14),
  lineHeight: 1,
  color: colors.black100,
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

export const button = style({
  borderRadius: pxToRem(8),
  backgroundColor: colors.black700,
  inlineSize: "100%",
  border: `1px solid ${colors.black800}`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  blockSize: pxToRem(48),
  fontSize: pxToRem(16),
  fontWeight: weights.bold,
  lineHeight: 1,
  color: colors.black000,
});
