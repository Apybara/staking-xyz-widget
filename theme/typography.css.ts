import { style } from "@vanilla-extract/css";
import { typography } from "./theme.css";

export const monospaced = style({ fontFeatureSettings: typography.features.monospaced });
