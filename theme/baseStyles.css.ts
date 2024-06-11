import { style } from "@vanilla-extract/css";
import { colors } from "./theme.css";
import { pxToRem } from "./utils";

export const borderedCard = style({
  border: `1px solid ${colors.black700}`,
  borderRadius: pxToRem(16),
  paddingBlock: pxToRem(19),
  paddingInline: pxToRem(20),
});

export const borderedCardButton = style([
  borderedCard,
  {
    backgroundColor: colors.black700,
    borderColor: colors.black800,
    boxShadow: "0px 0px 12px 0px rgba(0, 0, 0, 0.16)",
    transition: "background-color .3s",

    selectors: {
      "&:hover": {
        transition: "background-color .3s",
        backgroundColor: colors.black750,
        borderColor: colors.black900,
      },
    },
  },
]);
