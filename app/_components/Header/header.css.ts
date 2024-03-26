import { style, createContainer } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";

export const headerContainer = createContainer();

export const header = style({
  containerType: "inline-size",
  containerName: headerContainer,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingInline: pxToRem(32),
  paddingBlock: pxToRem(21),

  "@media": {
    "screen and (max-width: 768px)": {
      paddingInline: pxToRem(20),
    },
  },
});

export const logo = style({
  display: "inline-block",
  lineHeight: 0,

  "@container": {
    "(max-width: 480px)": {
      inlineSize: 32,
    },
  },
});

export const logoLigature = style({
  "@container": {
    "(max-width: 520px)": {
      display: "none",
    },
  },
});

export const endBox = style({
  display: "flex",
  alignItems: "stretch",
  gap: pxToRem(20),

  "@container": {
    "(max-width: 480px)": {
      gap: pxToRem(16),
    },
  },
});
