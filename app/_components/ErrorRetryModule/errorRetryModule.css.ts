import { style, keyframes } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const root = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: pxToRem(16),
});

export const texts = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: pxToRem(8),
});

export const title = style({
  fontSize: pxToRem(16),
  lineHeight: 1,
  fontWeight: weights.semibold,
  color: colors.black000,
});

export const subtitle = style({
  fontSize: pxToRem(14),
  lineHeight: 1,
  color: colors.black300,
});

export const button = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "fit-content",
  minInlineSize: pxToRem(88),
  gap: pxToRem(8),
  borderRadius: pxToRem(8),
  paddingBlock: pxToRem(10),
  paddingInline: pxToRem(16),
  backgroundColor: colors.black900,
  border: `1px solid ${colors.black800}`,
  boxShadow: `0px 0px 12px 0px rgba(0, 0, 0, 0.16)`,
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
  color: colors.black000,

  selectors: {
    "&:hover": {
      cursor: "pointer",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "progress",
    },
  },
});

const rotate = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});
export const loader = style({
  color: colors.black300,
  transformOrigin: "center",
  blockSize: pxToRem(16),

  selectors: {
    [`${button}:disabled &`]: {
      "@media": {
        "(prefers-reduced-motion: no-preference)": {
          animation: `${rotate} 1s cubic-bezier(0, 0, 0, 1) infinite`,
        },
      },
    },
  },
});
