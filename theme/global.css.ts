import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";
import "./layers.css";
import "./reset.css";

globalStyle("html", {
  boxSizing: "border-box",
  scrollBehavior: "smooth",
  color: vars.color.black000,
  background: vars.color.black900,
  fontSize: 16,
  fontFamily: vars.typography.fonts.primary,
  textRendering: "optimizeLegibility",

  "@media": {
    "screen and (max-width: 768px)": {
      fontSize: 15,
    },
  },
});

globalStyle(".skeleton-container", {
  display: "block",
  lineHeight: 0,
});
