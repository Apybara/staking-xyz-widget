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
  paddingInline: pxToRem(20),
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
  paddingInline: pxToRem(16),
});

export const cardContent = style([
  main,
  {
    paddingInline: 0,
  },
]);

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
});

export const iconArrow = style({
  display: "flex",
  color: colors.black300,
  transition: "color .3s",
  selectors: {
    [`${card}:hover &`]: {
      color: colors.black000,
    },
  },
});
