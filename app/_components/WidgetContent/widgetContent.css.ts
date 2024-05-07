import { colors } from "@/theme/theme.css";
import { pxToRem } from "@/theme/utils";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const widgetContent = recipe({
  base: {
    paddingInline: pxToRem(16),
  },
  variants: {
    state: {
      default: {
        blockSize: `clamp(342px, 394px, 400px)`,
        overflow: "auto",
      },
      full: {
        blockSize: `100%`,
        overflow: "auto",
      },
    },
  },
});

export const widgetWrapper = style({
  blockSize: "100%",
});

globalStyle(`${widgetContent()} ${widgetWrapper} > div > *:last-child`, {
  marginBlockEnd: pxToRem(16),
});

globalStyle(`${widgetWrapper} > div`, {
  display: "flex !important",
  flexDirection: "column",
  gap: pxToRem(16),
});

export const scrollbar = style({
  display: "flex",
  userSelect: "none",
  touchAction: "none",
  padding: pxToRem(2),
  background: "transparent",

  selectors: {
    "&:hover": {
      background: "transparent",
    },

    "&[data-orientation='vertical']": {
      inlineSize: pxToRem(14),
    },
  },
});

export const thumb = style({
  flex: "1",
  background: colors.black600,
  borderRadius: pxToRem(14),
  position: "relative",
  marginInlineEnd: pxToRem(2),

  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      insetBlockStart: "50%",
      insetInlineStart: "50%",
      transform: "translate(-50%, -50%)",
      inlineSize: "100%",
      blockSize: "100%",
      minInlineSize: "44px",
      minBlockSize: "44px",
    },
  },
});

export const corner = style({
  background: "transparent",
});
