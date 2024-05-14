import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const button = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(6),
  paddingBlock: pxToRem(8),
  paddingInline: pxToRem(10),
  borderRadius: pxToRem(8),
  backgroundColor: colors.black750,
  transition: "background-color .3s",

  selectors: {
    "&:hover": {
      backgroundColor: colors.black700,
    },
  },
});

export const defaultButtonText = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
});

export const connectingButtonText = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  color: colors.black300,
});

export const account = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(6),
});

export const accountAddress = style({
  "@media": {
    "screen and (max-width: 420px)": {
      display: "none",
    },
  },
});
