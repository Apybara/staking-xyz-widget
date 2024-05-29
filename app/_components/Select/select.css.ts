import { style, globalStyle } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { colors } from "../../../theme/theme.css";

export const trigger = style({
  display: "flex",
  gap: pxToRem(10),
  alignItems: "center",
  paddingBlock: pxToRem(8),
  paddingInlineStart: pxToRem(10),
  paddingInlineEnd: pxToRem(8),
  borderRadius: pxToRem(8),
  backgroundColor: colors.black750,
  transition: "background-color .3s",

  selectors: {
    "&:hover": {
      backgroundColor: colors.black700,
    },
    "&[data-state='open']": {
      backgroundColor: colors.black700,
    },
  },
});

export const triggerIcon = style({
  lineHeight: 0,
  color: colors.black300,

  selectors: {
    [`${trigger}[data-state='open'] &`]: {
      transform: "rotate(180deg)",
    },
  },
});

export const content = style({
  overflow: "hidden",
  marginBlockStart: pxToRem(6),
  backgroundColor: colors.black750,
  borderRadius: pxToRem(8),
  boxShadow: "0px 0px 12px 0px #00000029",
});

export const viewport = style({
  padding: pxToRem(8),
});

globalStyle(`${viewport} > * + *`, {
  marginBlockStart: pxToRem(4),
});

export const item = style({
  cursor: "pointer",
  padding: pxToRem(8),
  borderRadius: pxToRem(8),
  backgroundColor: "transparent",
  selectors: {
    "&[data-state='checked']": {
      pointerEvents: "none",
    },
    "&:hover, &[data-state='checked']": {
      backgroundColor: colors.black700,
    },
  },
});
