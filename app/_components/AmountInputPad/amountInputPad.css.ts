import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights, monospaced } from "../../../theme/theme.css";

export const inputField = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: pxToRem(50),
  blockSize: pxToRem(50),
  color: colors.black000,
  fontFeatureSettings: monospaced,
});

export const htmlInputFieldContainer = style({
  display: "flex",
  position: "relative",
});

export const htmlInputFieldWidth = style({
  /**
   * "visibility: hidden" and "pointer-events: none" removes user interaction from
   * this element so that it goes directly to the input
   */
  visibility: "hidden",
  pointerEvents: "none",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxInlineSize: pxToRem(223),
});

export const htmlInputField = style({
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxInlineSize: "100%",
  position: "absolute", // input fits into the container and dynamically resizes accordingly
});

export const conversionTool = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: pxToRem(6),
  fontSize: pxToRem(14),
  color: colors.black300,

  ":hover": {
    color: colors.black000,
  },
});

export const mainControlBox = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(4),
  inlineSize: "100%",
});

export const amountInputPad = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: pxToRem(20),
  backgroundColor: colors.black700,
  border: `1px solid ${colors.black800}`,
  borderRadius: pxToRem(8),
  paddingInline: pxToRem(20),
  paddingBlockStart: pxToRem(30),
  paddingBlockEnd: pxToRem(30),
});

export const topBar = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  inlineSize: "100%",
  marginBlockStart: pxToRem(-16),
});

export const maxButton = style({
  fontSize: pxToRem(12),
  fontWeight: weights.semibold,
  textAlign: "center",
  lineHeight: 1,
  color: colors.green900,
  paddingBlock: pxToRem(6),
  paddingInline: pxToRem(12),
  borderRadius: pxToRem(8),
  backgroundColor: colors.green100,
});

export const primaryAvailabilityText = style({
  fontSize: pxToRem(12),
  color: colors.black000,
  lineHeight: 1,
});
export const secondaryAvailabilityText = style({
  fontSize: pxToRem(12),
  color: colors.black300,
  lineHeight: 1,
});
