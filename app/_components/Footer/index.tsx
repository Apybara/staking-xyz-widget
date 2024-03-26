import numbro from "numbro";
import { RootFooter } from "./RootFooter";

export const Footer = () => {
  const formattedBlockHeight = numbro(123456).format({
    thousandSeparated: true,
    mantissa: 0,
  });

  return <RootFooter networkStatus="loading" blockHeight={"——————"} />;
};
