import { style, globalStyle } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const title = style({});

globalStyle(title, {
  fontSize: pxToRem(18),
  marginBlockEnd: pxToRem(16),
  marginInlineStart: pxToRem(10),
});

export const walletCardButton = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(10),
  inlineSize: "100%",
  padding: pxToRem(10),
  borderRadius: pxToRem(8),
  backgroundColor: colors.black900,
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,

  selectors: {
    "&:hover": {
      backgroundColor: colors.black700,
    },
    "&:disabled": {
      opacity: 0.5,
    },
  },
});

export const list = style({
  minInlineSize: pxToRem(240),
});

globalStyle(`${list} > * + *`, {
  marginBlockStart: pxToRem(6),
});
