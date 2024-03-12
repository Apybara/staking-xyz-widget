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
  textRendering: "optimizeLegibility",
});
