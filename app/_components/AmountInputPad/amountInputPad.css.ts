import { globalStyle, style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const inputField = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: pxToRem(50),
  blockSize: pxToRem(50),
  color: colors.black000,
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
  maxInlineSize: pxToRem(247),
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
  paddingInline: pxToRem(20),
  marginBlockStart: pxToRem(20),
  marginBlockEnd: pxToRem(32),
});

export const amountInputPad = style({
  backgroundColor: colors.black700,
  border: `1px solid ${colors.black800}`,
  borderRadius: pxToRem(8),
});

export const topBar = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  inlineSize: "100%",
  marginBlockStart: pxToRem(14),
  paddingInline: pxToRem(20),
  minBlockSize: pxToRem(24),
});

export const topBarInfo = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(4),
});

export const topBarTooltip = style({
  maxInlineSize: pxToRem(300),
});

export const maxButtonContainer = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(4),
});

export const maxButton = recipe({
  base: {
    fontSize: pxToRem(12),
    fontWeight: weights.semibold,
    textAlign: "center",
    lineHeight: 1,
    color: colors.green900,
    paddingBlock: pxToRem(6),
    paddingInline: pxToRem(8),
    borderRadius: pxToRem(8),
    backgroundColor: colors.green100,
  },
  variants: {
    state: {
      default: {},
      disabled: {
        opacity: "0.3",
        pointerEvents: "none",
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
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

export const errorMessage = style({
  fontSize: pxToRem(12),
  lineHeight: pxToRem(16),
  color: colors.yellow900,
  textAlign: "center",
  textWrap: "pretty",
  display: "block",
  maxInlineSize: "100%",
  marginBlockStart: pxToRem(-8),
  marginBlockEnd: pxToRem(14),
  paddingInline: pxToRem(20),
});

globalStyle(`${errorMessage} a`, {
  textDecoration: "underline",
});

export const validator = style({
  borderTop: `1px solid ${colors.black800}`,
  display: "flex",
  alignItems: "center",
  gap: pxToRem(10),
  marginBlockStart: pxToRem(12),
  paddingBlock: pxToRem(12),
  paddingInline: pxToRem(20),
  inlineSize: "100%",
});

export const validatorSkeleton = style({
  inlineSize: "100%",
});

export const validatorDetails = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(8),
});

export const validatorName = style({
  fontSize: pxToRem(14),
  lineHeight: 1,
  fontWeight: weights.bold,
  color: colors.black000,
});

export const validatorAddressContainer = style({
  display: "flex",
  alignItems: "flex-start",
  gap: pxToRem(4),
  color: colors.black300,
});

export const validatorAddress = style({
  fontSize: pxToRem(12),
  lineHeight: 1,
});

export const validatorInvalid = style([
  validatorName,
  {
    color: colors.yellow900,
  },
]);

globalStyle(`${validatorName} span`, {
  fontSize: pxToRem(14),
  fontWeight: weights.bold,
  color: colors.black000,
});

globalStyle(`${validatorAddress} span`, {
  color: `${colors.black300}`,
  fontWeight: `${weights.regular}`,
});

export const instantWithdrawal = recipe({
  base: {
    inlineSize: "100%",
    paddingInline: pxToRem(20),
    minBlockSize: pxToRem(43),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: `1px solid ${colors.black800}`,
    borderBottomLeftRadius: pxToRem(8),
    borderBottomRightRadius: pxToRem(8),
  },
  variants: {
    state: {
      default: {},
      disabled: {
        backgroundColor: colors.black900,
        cursor: "not-allowed",
      },
    },
  },
});

export const instantWithdrawalLabel = recipe({
  base: {
    fontSize: pxToRem(14),
    fontWeight: weights.bold,
    color: colors.black100,
    display: "flex",
    alignItems: "center",
    gap: pxToRem(4),
  },
  variants: {
    state: {
      default: {},
      disabled: {
        opacity: 0.25,
      },
    },
  },
});

export const instantWithdrawalTooltip = style({
  maxInlineSize: pxToRem(303),
  textAlign: "center",
});
