import { style } from "@vanilla-extract/css";
import { pxToRem } from "../../../../theme/utils";
import { colors, weights } from "../../../../theme/theme.css";
import { borderedCard, borderedCardButton } from "../../../../theme/baseStyles.css";

export const card = style([
  borderedCardButton,
  {
    textAlign: "center",
    paddingBlock: `${pxToRem(27)} !important`,
  },
]);

export const title = style({
  display: "block",
  fontSize: pxToRem(20),
  fontWeight: weights.bold,
  lineHeight: 1,
  marginBlockEnd: pxToRem(3),
});

export const subtitle = style({
  fontSize: pxToRem(12),
  lineHeight: 1,
  color: colors.black600,
});

export const ctaCard = style([
  borderedCard,
  {
    textAlign: "center",
  },
]);
export const ctaCardTopSubtitle = style([
  subtitle,
  {
    display: "block",
    marginBlockEnd: pxToRem(6),
  },
]);
