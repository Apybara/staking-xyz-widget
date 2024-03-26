import cn from "classnames";
import * as S from "./footer.css";

export type RootFooterProps = {
  networkStatus: "error" | "default" | "loading";
  blockHeight: number | string;
};

export const RootFooter = ({ networkStatus, blockHeight }: RootFooterProps) => {
  return (
    <footer className={cn(S.footer)}>
      <p className={cn(S.copy)}>Your portal to staking</p>
      <span className={cn(S.blockHeight({ state: networkStatus }))}>{blockHeight}</span>
    </footer>
  );
};
