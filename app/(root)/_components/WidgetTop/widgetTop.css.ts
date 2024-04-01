import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors } from "../../../../theme/theme.css";

export const widgetTop = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: pxToRem(12),
  marginInlineEnd: pxToRem(2),
});

export const widgetTopButton = style({
  lineHeight: 0,
  color: colors.black600,

  selectors: {
    "&:hover": {
      color: colors.black000,
    },
  },
});
