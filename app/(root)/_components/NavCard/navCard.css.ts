import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";
import { borderedCard } from "../../../../theme/baseStyles.css";

const cardBase = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  blockSize: pxToRem(76),
});

export const card = style([
  borderedCard,
  cardBase,
  {
    backgroundColor: colors.black700,
    borderColor: colors.black800,
    boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.16)",
    transition: "background-color 0.3s",

    selectors: {
      "&:hover": {
        transition: "background-color 0.3s",
        backgroundColor: colors.black750,
        borderColor: colors.black900,
      },
    },
  },
]);

export const disabledCard = style([
  borderedCard,
  cardBase,
  {
    pointerEvents: "none",
  },
]);

export const main = style({
  display: "flex",
  alignItems: "center",
  gap: pxToRem(8),
});

export const mainContent = style({
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(8),
});

export const title = style({
  fontSize: pxToRem(16),
  fontWeight: weights.bold,
  color: colors.black000,

  selectors: {
    [`${disabledCard} &`]: {
      color: colors.black600,
    },
  },
});

export const description = style({
  fontSize: pxToRem(12),
  color: colors.black300,
});

export const endBox = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: pxToRem(4),
  marginInlineEnd: pxToRem(-4),
});

export const primaryText = style({
  fontSize: pxToRem(16),
  fontWeight: weights.bold,
  color: colors.black000,

  selectors: {
    [`${disabledCard} &`]: {
      color: colors.black600,
    },
  },
});

export const secondaryText = style({
  fontSize: pxToRem(12),
  color: colors.black300,

  selectors: {
    [`${disabledCard} &`]: {
      color: colors.black600,
    },
  },
});
export const valueTextBox = style({
  display: "flex",
  alignItems: "flex-end",
  gap: pxToRem(4),
});

export const icon = style({});
export const iconChevron = style({
  transform: "rotate(-90deg)",
  selectors: {
    [`${card}:hover &`]: {
      display: "none",
      visibility: "hidden",
    },
  },
});
export const iconArrow = style({
  display: "none",
  selectors: {
    [`${card}:hover &`]: {
      display: "block",
      visibility: "visible",
    },
  },
});
