import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors } from "../../../../theme/theme.css";

export const container = style({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: pxToRem(8),
  top: "calc(100% + 16px)",
  left: "0",
  right: "0",
  zIndex: 1,
});

export const text = style({
  fontSize: pxToRem(12),
  color: colors.black600,
  lineHeight: pxToRem(12),
});

export const link = style({
  textDecoration: "underline",

  selectors: {
    "&:hover": {
      transition: "color 0.3s",
      color: colors.black000,
    },
  },
});
