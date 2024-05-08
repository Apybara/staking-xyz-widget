import cn from "classnames";
import * as S from "./footer.css";
import { Icon } from "../Icon";
import { TELEGRAM_URL, TWITTER_URL } from "@/app/consts";

export type RootFooterProps = {
  isRefetching?: boolean;
  networkStatus: "error" | "default" | "idle";
  blockHeight: number | string;
};

export const RootFooter = ({ isRefetching, networkStatus, blockHeight }: RootFooterProps) => {
  return (
    <footer className={cn(S.footer)}>
      <p className={cn(S.copy)}>Your portal to staking</p>

      <div className={S.content}>
        <div className={S.linksContainer}>
          <a className={S.link} href={process.env.NEXT_PUBLIC_PRIVACY_LINK} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          <a className={S.link} href={process.env.NEXT_PUBLIC_TERMS_LINK} target="_blank" rel="noopener noreferrer">
            Terms of Use
          </a>
        </div>
        <div className={S.linksContainer}>
          <a className={S.link} href={TWITTER_URL} target="_blank" rel="noopener noreferrer">
            <Icon name="x" />
            <span>@staking_xyz</span>
          </a>
          <a className={S.link} href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Icon name="telegram" />
            <span>@staking_xyz</span>
          </a>
        </div>
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
      </div>
    </footer>
  );
};
