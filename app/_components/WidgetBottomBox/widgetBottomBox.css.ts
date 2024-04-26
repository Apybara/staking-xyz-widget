import { pxToRem } from "@/theme/utils";
import { style } from "@vanilla-extract/css";

export const widgetBottomBox = style({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: pxToRem(16),
});
