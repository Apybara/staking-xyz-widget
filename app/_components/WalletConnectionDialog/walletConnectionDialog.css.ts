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

export const walletInstallButtonInfo = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(10),
  color: colors.black300,
});

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
    hasCancelButton: {
      true: {
        paddingInlineEnd: pxToRem(28),
      },
      false: {},
    },
  },
  defaultVariants: {
    state: "default",
    hasCancelButton: false,
  },
});

export const walletItem = style({
  position: "relative",
});

export const walletCardButtonInfo = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(10),
});

export const list = style({
  minInlineSize: pxToRem(240),
  marginBlockStart: pxToRem(16),
});

globalStyle(`${list} > * + *`, {
  marginBlockStart: pxToRem(6),
});

export const cancelButton = style({
  position: "absolute",
  insetInlineEnd: pxToRem(10),
  insetBlockStart: `calc(50% - ${pxToRem(14 / 2)})`,
  cursor: "pointer",
  color: colors.black300,
  lineHeight: 0,

  selectors: {
    "&:hover": {
      color: colors.black000,
    },
  },
});
