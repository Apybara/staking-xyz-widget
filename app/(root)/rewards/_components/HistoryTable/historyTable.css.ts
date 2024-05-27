import { style } from "@vanilla-extract/css";
import { colors, weights } from "@/theme/theme.css";
import { pxToRem } from "@/theme/utils";

export const errorPad = style({
  justifyContent: "center !important",
});

export const emptyState = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
});

export const skeleton = style({
  display: "inline-block",
});

export const title = style({
  fontSize: pxToRem(16),
  lineHeight: 1,
  fontWeight: weights.bold,
  color: colors.black000,
  marginBlockEnd: pxToRem(12),
  whiteSpace: "nowrap",
});

export const subtitle = style({
  fontSize: pxToRem(14),
  lineHeight: pxToRem(18),
  color: colors.black300,
  marginBlockEnd: pxToRem(24),
  maxInlineSize: pxToRem(230),
});

export const button = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "fit-content",
  minInlineSize: pxToRem(88),
  gap: pxToRem(8),
  borderRadius: pxToRem(8),
  paddingBlock: pxToRem(10),
  paddingInline: pxToRem(16),
  backgroundColor: colors.black900,
  border: `1px solid ${colors.black800}`,
  boxShadow: `0px 0px 12px 0px rgba(0, 0, 0, 0.16)`,
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  color: colors.black000,
  marginBlockEnd: pxToRem(8),

  selectors: {
    "&:hover": {
      cursor: "pointer",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "progress",
    },
  },
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
