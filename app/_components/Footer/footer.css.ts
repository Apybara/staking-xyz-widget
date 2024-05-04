import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { pxToRem } from "../../../theme/utils";
import { colors } from "../../../theme/theme.css";

export const footer = style({
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

export const copy = style({
  fontSize: pxToRem(12),
  lineHeight: 1,
  color: colors.black600,
});

export const blockHeight = recipe({
  base: {
    position: "relative",
    fontSize: pxToRem(12),
    lineHeight: 1,
    selectors: {
      "&:before": {
        content: '""',
        position: "absolute",
        insetBlockStart: `calc(50% - ${pxToRem(4)})`,
        insetInlineEnd: pxToRem(-14),
        blockSize: pxToRem(8),
        inlineSize: pxToRem(8),
        borderRadius: "100%",
      },
    },
  },
  variants: {
    state: {
      loading: {
        color: colors.black600,
        selectors: {
          "&:before": {
            backgroundColor: colors.black600,
          },
        },
      },
      error: {
        color: colors.yellow900,
        marginInlineEnd: pxToRem(8),
        selectors: {
          "&:before": {
            backgroundColor: colors.yellow900,
          },
        },
      },
      default: {
        color: colors.green900,
        marginInlineEnd: pxToRem(8),
        selectors: {
          "&:before": {
            backgroundColor: colors.green900,
          },
        },
      },
    },
  },
  defaultVariants: {
    state: "loading",
  },
});
