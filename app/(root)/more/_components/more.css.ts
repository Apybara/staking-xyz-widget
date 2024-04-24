import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";

export const card = style({
  border: `1px solid ${colors.black800}`,
  borderRadius: pxToRem(16),
  backgroundColor: colors.black700,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  blockSize: pxToRem(76),
  paddingInlineStart: pxToRem(20),
  paddingInlineEnd: pxToRem(16),
  boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.16)",
  transition: "background-color 0.3s",

  selectors: {
    "&:hover": {
      backgroundColor: colors.black750,
      borderColor: colors.black900,
    },
  },
});

export const main = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(8),
});

export const title = style({
  fontSize: pxToRem(16),
  lineHeight: 1,
  fontWeight: weights.bold,
  color: colors.black000,
});

export const description = style({
  fontSize: pxToRem(12),
  lineHeight: 1,
  color: colors.black300,
});

export const endBox = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: pxToRem(4),
  marginInlineEnd: pxToRem(-4),
});

export const icon = style({});

export const iconChevron = style({
  transform: "rotate(-90deg)",
  color: colors.black300,
  selectors: {
    [`${card}:hover &`]: {
      display: "none",
      visibility: "hidden",
    },
  },
});

export const iconArrow = style({
  display: "none",
  selectors: {
    [`${card}:hover &`]: {
      display: "block",
      visibility: "visible",
    },
  },
});
