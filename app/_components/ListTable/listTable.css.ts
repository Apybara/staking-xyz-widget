import { style, globalStyle } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "../../../theme/utils";
import { colors, weights } from "../../../theme/theme.css";

export const tabs = style({
  display: "flex",
  alignItems: "flex-start",
  gap: pxToRem(4),
  inlineSize: "100%",
});

export const pad = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: pxToRem(18),
  paddingInline: pxToRem(20),
  paddingBlockStart: pxToRem(20),
  paddingBlockEnd: pxToRem(16),
  borderRadius: pxToRem(8),
  backgroundColor: colors.black700,
  border: `1px solid ${colors.black800}`,
  blockSize: "100%",
});
globalStyle(`${pad} .skeleton-container:not(:last-of-type)`, {
  inlineSize: "100%",
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(18),
  inlineSize: "100%",
});

export const item = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(10),
  inlineSize: "100%",
});

export const txInfoPrimary = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pxToRem(8),
    inlineSize: "100%",
  },
  variants: {
    isProcessing: {
      true: {
        color: colors.black600,
        transition: "color 0.3s",

        selectors: {
          [`${item}:hover &`]: {
            color: colors.black000,
            transition: "color 0.3s",
          },
        },
      },
      false: {
        color: colors.black000,
      },
    },
  },
  defaultVariants: {
    isProcessing: false,
  },
});
export const txInfoPrimaryStart = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(8),
});
export const txInfoPrimaryChild = style([
  txInfoPrimaryStart,
  {
    gap: pxToRem(4),
  },
]);
export const txInfoPrimaryTitle = style({
  fontSize: pxToRem(14),
  fontWeight: weights.bold,
  color: "inherit",
  lineHeight: 1,
});
export const txInfoPrimaryAmount = style({
  fontSize: pxToRem(12),
  fontWeight: weights.bold,
  color: "inherit",
  lineHeight: 1,
});
export const txInfoLinkIcon = style({
  color: colors.black300,
  lineHeight: 0,
  transition: "color, transform 0.3s",

  selectors: {
    [`${item}:hover &`]: {
      color: colors.black000,
      transform: "translate3d(1px, -1px, 0)",
      transition: "color, transform 0.3s",
    },
  },
});
export const txInfoLoadingIcon = style({
  color: colors.black000,
});

export const txInfoSecondary = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: pxToRem(8),
    inlineSize: "100%",
  },
  variants: {
    isProcessing: {
      true: {
        color: colors.black600,
        transition: "color 0.3s",

        selectors: {
          [`${item}:hover &`]: {
            color: colors.black300,
            transition: "color 0.3s",
          },
        },
      },
      false: {
        color: colors.black300,
      },
    },
  },
  defaultVariants: {
    isProcessing: false,
  },
});
export const txInfoSecondaryValue = style({
  fontSize: pxToRem(12),
  color: "inherit",
  lineHeight: 1,
});

export const pagination = style({});
export const paginationList = style({
  display: "flex",
  alignItems: "center",
});
export const paginationButton = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: pxToRem(4),

    selectors: {
      "&:disabled": {
        pointerEvents: "none",
      },
    },
  },
  variants: {
    state: {
      active: {
        color: colors.black000,
      },
      inactive: {
        color: colors.black600,
      },
    },
    direction: {
      forward: {
        transform: "rotate(-90deg)",
      },
      backward: {
        transform: "rotate(90deg)",
      },
    },
  },
  defaultVariants: {
    state: "inactive",
  },
});
export const paginationPage = style({
  fontSize: pxToRem(14),
  lineHeight: 1,
  color: colors.black000,
  marginInline: pxToRem(10),
});
