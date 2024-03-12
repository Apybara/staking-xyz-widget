import { createGlobalTheme } from "@vanilla-extract/css";
import { tonalPalette } from "./colors";

export const vars = createGlobalTheme(":root", {
  color: {
    ...tonalPalette,
  },
});
