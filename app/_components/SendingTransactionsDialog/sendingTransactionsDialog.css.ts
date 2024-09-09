import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";
import { recipe } from "@vanilla-extract/recipes";

export const dialog = style({
  inlineSize: pxToRem(320),
});

export const title = style({
  fontSize: pxToRem(18),
  lineHeight: pxToRem(24),
  textAlign: "center",
  color: colors.black000,
  fontWeight: weights.bold,
  marginBlockStart: pxToRem(8),
  marginBlockEnd: pxToRem(24),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: pxToRem(8),
});

export const tooltip = style({
  width: pxToRem(300),
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

export const statusIcon = recipe({
  base: {
    display: "flex",
  },
  variants: {
    state: {
      pending: {},
      success: {
        color: colors.black000,
      },
      failed: {
        color: colors.yellow900,
      },
    },
  },
  defaultVariants: {
    state: "success",
  },
});

export const actions = style({
  display: "flex",
  gap: pxToRem(10),
  inlineSize: "100%",
});

export const dismissButton = style({
  borderRadius: pxToRem(8),
  backgroundColor: colors.black700,
  border: `1px solid ${colors.black800}`,
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
    border: 0,
  },
]);
