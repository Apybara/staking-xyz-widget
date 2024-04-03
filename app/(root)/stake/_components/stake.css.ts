import { style } from "@vanilla-extract/css";
import { colors } from "../../../../theme/theme.css";

export const bottomBox = style({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
});

export const rewardInfoValue = style({
  color: colors.green900,
});
