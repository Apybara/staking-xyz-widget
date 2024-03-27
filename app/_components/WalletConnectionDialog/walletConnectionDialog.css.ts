import { recipe } from "@vanilla-extract/recipes";
import { style, globalStyle } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const title = style({});

globalStyle(title, {
  fontSize: pxToRem(18),
  marginBlockEnd: pxToRem(16),
  marginInlineStart: pxToRem(10),
});

const baseWalletCardStyle = style({
  inlineSize: "100%",
  padding: pxToRem(10),
  borderRadius: pxToRem(8),
  backgroundColor: colors.black900,
  fontSize: pxToRem(14),
  fontWeight: weights.semibold,

  selectors: {
    "&:hover": {
      backgroundColor: colors.black700,
    },
  },
});

export const walletInstallButton = style([baseWalletCardStyle, {}]);

export const walletCardButton = recipe({
  base: [
    baseWalletCardStyle,
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: pxToRem(10),
    },
  ],
  variants: {
    state: {
      default: {},
      loading: {
        cursor: "progress",
      },
      disabled: {
        pointerEvents: "none",
        opacity: 0.3,
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const walletCardButtonInfo = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(10),
});

export const list = style({
  minInlineSize: pxToRem(240),
});

globalStyle(`${list} > * + *`, {
  marginBlockStart: pxToRem(6),
});

export const cancelButton = style({
  marginBlockStart: pxToRem(12),
});
