import { style } from "@vanilla-extract/css";
import { colors } from "../../../theme/theme.css";

export const button = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.black600,

  selectors: {
    "&:hover": {
      color: colors.black300,
    },
    '&[data-copied="true"]': {
      color: colors.black000,
    },
  },
});
