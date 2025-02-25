import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../theme/utils";

export const base = style({
  display: "flex",
  flexDirection: "column",
  blockSize: "100dvh",
  maxBlockSize: "100dvh",
});

export const main = style({
  margin: "auto",
  paddingInline: pxToRem(10),
  position: "relative",
});

export const nav = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(8),
});
