import { style } from "@vanilla-extract/css";
import { colors } from "./theme.css";
import { pxToRem } from "./utils";

export const borderedCard = style({
  border: `1px solid ${colors.black700}`,
  borderRadius: pxToRem(16),
  padding: pxToRem(20),
});

export const borderedCardButton = style([
  borderedCard,
  {
    selectors: {
      "&:hover": {
        borderColor: colors.black800,
        backgroundColor: colors.black700,
      },
    },
  },
]);
