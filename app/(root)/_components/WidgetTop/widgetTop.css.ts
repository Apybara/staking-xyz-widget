import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";

export const defaultTop = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: pxToRem(12),
  marginInlineEnd: pxToRem(2),
  paddingBlock: pxToRem(4),
});

export const pageTop = style({
  display: "flex",
  alignItems: "center",
});

export const title = style({
  fontSize: pxToRem(20),
  fontWeight: weights.semibold,
  lineHeight: 1,
  textAlign: "center",
  flexGrow: 1,
  marginInlineEnd: 20,
});

export const button = style({
  lineHeight: 0,
  color: colors.black600,

  selectors: {
    "&:hover": {
      color: colors.black000,
    },
  },
});
