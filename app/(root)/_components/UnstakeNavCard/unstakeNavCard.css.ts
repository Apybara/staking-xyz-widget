import { style } from "@vanilla-extract/css";
import { colors } from "../../../../theme/theme.css";
import { pxToRem } from "../../../../theme/utils";

export const withdrawableTooltip = style({
  maxInlineSize: pxToRem(170),
  padding: pxToRem(16),
  backgroundColor: `${colors.yellow100} !important`,
  border: "none !important",
  color: `${colors.yellow900} !important`,
  textAlign: "center",
});

export const withdrawableText = style({
  position: "relative",

  selectors: {
    "&:after": {
      content: '""',
      display: "inline-block",
      inlineSize: pxToRem(8),
      blockSize: pxToRem(8),
      borderRadius: pxToRem(4),
      backgroundColor: colors.yellow900,
      marginInlineStart: pxToRem(8),
    },
  },
});
