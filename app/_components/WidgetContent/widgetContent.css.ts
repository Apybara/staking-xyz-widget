import { pxToRem } from "@/theme/utils";
import { recipe } from "@vanilla-extract/recipes";

export const widgetContent = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(16),
    paddingInline: pxToRem(16),
  },
  variants: {
    state: {
      default: {
        blockSize: `clamp(342px, 394px, 400px)`,
        paddingBlockEnd: pxToRem(40),
        overflow: "auto",
      },
      full: {
        blockSize: `100%`,
        paddingBlockEnd: pxToRem(0),
        overflow: "auto",
      },
    },
  },
});
