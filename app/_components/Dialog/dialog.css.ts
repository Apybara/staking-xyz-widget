import { style, keyframes } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors } from "../../../theme/theme.css";

const scaleUp = keyframes({
  "0%": {
    opacity: 0,
    transform: "perspective(1px) translate3d(-50%, -48%, 0) scale(.96)",
  },
  "100%": {
    opacity: 1,
    transform: "perspective(1px) translate3d(-50%, -50%, 0) scale(1)",
  },
});

export const overlay = style({
  position: "fixed",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  inset: 0,
  animation: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
});

export const content = style({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "perspective(1px) translate3d(-50%, -50%, 0)",
  transformOrigin: "center",
  borderRadius: pxToRem(24),
  background: colors.gradientBg,
  boxShadow: "0px 0px 25px 0px rgba(0, 0, 0, 0.25)",
  padding: pxToRem(16),
  willChange: "opacity, transform",

  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      animation: `${scaleUp} 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
    },
  },
});
