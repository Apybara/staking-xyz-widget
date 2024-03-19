import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingInline: pxToRem(32),
  paddingBlock: pxToRem(21),
});

export const logo = style({
  display: "inline-block",
  lineHeight: 0,
});
