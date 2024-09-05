import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const dialog = style({
  inlineSize: pxToRem(320),
  paddingBlockStart: pxToRem(24),
});

export const title = style({
  fontSize: pxToRem(18),
  lineHeight: pxToRem(24),
  textAlign: "center",
  color: colors.black000,
  fontWeight: weights.bold,
  marginBlockEnd: pxToRem(24),
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  inlineSize: "100%",
  marginBlockEnd: pxToRem(20),
  borderTop: `1px solid ${colors.black700}`,
});

export const item = style({
  borderBottom: `1px solid ${colors.black700}`,
  paddingBlock: pxToRem(14),
  paddingInline: pxToRem(10),
});

export const itemContent = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(10),
  inlineSize: "100%",
});

export const infoContainer = style({
  display: "flex",
  flexDirection: "column",
  inlineSize: "100%",
  gap: pxToRem(16),
});

export const itemInfo = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  inlineSize: "100%",
  gap: pxToRem(10),
});

export const titleContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(8),
});

export const itemTitle = style({
  fontSize: pxToRem(14),
  fontWeight: weights.bold,
  lineHeight: 1,
  color: colors.black000,
});

export const itemSubtitle = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  color: colors.black300,
  lineHeight: 1,
});

export const loadingIcon = style({
  color: colors.black000,
  opacity: 0.5,
});

export const checkIcon = style({
  color: colors.green900,
});

export const actions = style({
  display: "flex",
  gap: pxToRem(10),
  inlineSize: "100%",
});

export const dismissButton = style({
  borderRadius: pxToRem(8),
  backgroundColor: colors.black700,
  color: colors.black000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  inlineSize: "100%",
  blockSize: pxToRem(48),
  fontSize: pxToRem(16),
  fontWeight: weights.bold,
  lineHeight: 1,
});

export const activityButton = style([
  dismissButton,
  {
    backgroundColor: colors.green100,
    color: colors.green900,
  },
]);
