import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";
import { borderedCardButton } from "../../../../theme/baseStyles.css";

export const card = style([
  borderedCardButton,
  {
    textAlign: "center",
  },
]);

export const title = style({
  display: "block",
  fontSize: pxToRem(20),
  fontWeight: weights.bold,
  marginBlockEnd: pxToRem(4),
});

export const subtitle = style({
  fontSize: pxToRem(12),
  color: colors.black600,
});
