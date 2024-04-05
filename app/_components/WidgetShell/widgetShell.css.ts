import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors } from "../../../theme/theme.css";

export const shell = style({
  padding: pxToRem(16),
  borderRadius: pxToRem(24),
  border: `1px solid ${colors.black800}`,
  background: colors.gradientBg,
  boxShadow: `0px 0px 25px 0px rgba(0, 0, 0, 0.25)`,
  inlineSize: `clamp(240px, calc(100vw - 20px), 340px)`,
  blockSize: `clamp(400px, 520px, 540px)`,
});
