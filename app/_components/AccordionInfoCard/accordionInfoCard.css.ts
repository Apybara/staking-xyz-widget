import { globalStyle, style } from "@vanilla-extract/css";
import { pxToRem } from "../../../theme/utils";
import { card as infoCardStyle } from "../InfoCard/infoCard.css";
import { colors } from "../../../theme/theme.css";

export const infoCard = style({
  padding: `0 !important`,
});

export const item = style({
  overflow: "hidden",
});

export const itemHeader = style({
  display: "flex",
});

export const trigger = style([
  infoCardStyle,
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
    gap: pxToRem(8),
    fontSize: pxToRem(14),
    cursor: "pointer",
    color: colors.black300,

    selectors: {
      "&:hover": {
        borderColor: colors.black800,
        backgroundColor: colors.black700,
      },
      [`${itemHeader}[data-state='open'] &`]: {
        borderEndEndRadius: "0 !important",
        borderEndStartRadius: "0 !important",
      },
    },
  },
]);

globalStyle(`${itemHeader} ${trigger}`, {
  border: "none",
});

export const triggerIcon = style({
  selectors: {
    [`${itemHeader}[data-state='open'] &`]: {
      transform: `rotate(180deg)`,
    },
  },
});

export const content = style({
  overflow: "hidden",
  paddingBlockStart: pxToRem(8),
  paddingBlockEnd: pxToRem(16),
  paddingInline: pxToRem(20),
});
