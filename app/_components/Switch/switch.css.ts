import { style } from "@vanilla-extract/css";
import { pxToRem } from "@/theme/utils";
import { colors } from "@/theme/theme.css";

export const root = style({
  width: pxToRem(26),
  height: pxToRem(15),
  position: "relative",
  borderRadius: pxToRem(11),
  backgroundColor: "#FFFFFF40",
  boxShadow: "0px 0.5px 1.5px 0px #0000001F inset, 0px 0px 1px 0px #00000005 inset",
  transition: "all 0.3s",

  selectors: {
    '&[data-state="checked"]': {
      backgroundColor: colors.green900,
      boxShadow: "0px 0.5px 2.5px 0px #666666BF inset",
    },
  },
});

export const thumb = style({
  display: "block",
  width: pxToRem(13),
  height: pxToRem(13),
  backgroundColor: colors.black000,
  borderRadius: "50%",
  boxShadow: "0px 0.25px 0.5px 0.1px #0000001F",
  border: "1px solid #00000005",
  transform: "translateX(1px)",
  willChange: "transform",
  transition: "all 0.3s",

  selectors: {
    '&[data-state="checked"]': {
      transform: "translateX(12px)",
      boxShadow: "0px 0.2px 0.25px 0px #0000001F",
    },
  },
});
