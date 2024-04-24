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
  fontSize: pxToRem(20),
  fontWeight: weights.bold,
  lineHeight: 1,
});

export const subtitle = style({
  display: "block",
  fontSize: pxToRem(12),
  lineHeight: 1,
  color: colors.black600,
  marginBlockStart: pxToRem(6),
});

export const ctaCard = style([
  borderedCard,
  {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    inlineSize: "100%",
    blockSize: pxToRem(98),
  },
]);

export const ctaCardTopSubtitle = style([
  subtitle,
  {
    display: "block",
    fontWeight: weights.semibold,
    marginBlockStart: 0,
    marginBlockEnd: pxToRem(8),
  },
]);
