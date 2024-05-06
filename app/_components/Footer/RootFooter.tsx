import cn from "classnames";
import * as S from "./footer.css";
import { Icon } from "../Icon";

export type RootFooterProps = {
  isRefetching?: boolean;
  networkStatus: "error" | "default" | "idle";
  blockHeight: number | string;
};

export const RootFooter = ({ isRefetching, networkStatus, blockHeight }: RootFooterProps) => {
  return (
    <footer className={cn(S.footer)}>
      <p className={cn(S.copy)}>Your portal to staking</p>
      <div className={cn(S.blockHeight({ state: networkStatus }), { [S.blockHeightLoading]: isRefetching })}>
        <span>{blockHeight}</span>
        <div className={S.loaderContainer}>
          <span className={cn(S.loader({ state: networkStatus }))} />

          {isRefetching && (
            <span className={S.loaderArc}>
              <Icon name="arc" />
            </span>
          )}
        </div>
      </div>
    </footer>
  );
};
