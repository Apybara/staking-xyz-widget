import { style } from "@vanilla-extract/css";
import { pxToRem } from "@/theme/utils";
import { colors, weights, monospaced } from "@/theme/theme.css";

export const selectItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingBlock: pxToRem(14),
  gap: pxToRem(48),

  "@media": {
    "screen and (max-width: 768px)": {
      gap: pxToRem(24),
    },
  },
});

export const selectItemMain = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(8),
});

export const triggerItemTitle = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,

  "@media": {
    "screen and (max-width: 768px)": {
      display: "none",
      visibility: "hidden",
    },
  },
});

export const itemTitle = style({
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,
});

export const itemSubtitle = style({
  fontSize: pxToRem(12),
  color: colors.black300,
  marginBlockStart: "0.1em",
});

export const itemSuffixText = style({
  fontSize: pxToRem(14),
  color: colors.green900,
  fontFeatureSettings: monospaced,
});
