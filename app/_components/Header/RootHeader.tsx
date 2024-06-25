import Link from "next/link";
import cn from "classnames";
import * as S from "./header.css";
import { type CurrencyTabsProps, CurrencyTabs } from "../CurrencyTabs";
import { type NetworkSelectProps, NetworkSelect } from "../NetworkSelect";
import type { StakingType } from "@/app/types";
import { WalletCapsule } from "../WalletCapsule";

export type RootHeaderProps = {
  stakingType: StakingType | null;
  currencyTabs: CurrencyTabsProps;
  networkSelect: NetworkSelectProps;
};

export const RootHeader = ({ stakingType, currencyTabs, networkSelect }: RootHeaderProps) => {
  return (
    <header className={cn(S.header)}>
      <Link href="/" className={cn(S.logo)}>
        <svg width="160" height="32" viewBox="0 0 160 32" fill="none">
          <path
            d="M48.0366 24.1934C44.285 24.1934 41.8678 22.4763 41.6819 19.5669L41.6709 19.3918H44.7882L44.8099 19.5121C45.0178 20.7371 46.3194 21.5029 48.124 21.5029C49.9506 21.5029 51.099 20.7043 51.099 19.5013V19.4902C51.099 18.4184 50.3226 17.8825 48.3646 17.4777L46.7022 17.1497C43.585 16.5262 42.0099 15.0387 42.0099 12.6653V12.6543C42.0099 9.76685 44.5256 7.86372 48.0256 7.86372C51.6787 7.86372 53.921 9.69029 54.0741 12.4575L54.085 12.6653H50.9678L50.9568 12.534C50.7928 11.2981 49.6554 10.5434 48.0256 10.5434C46.3302 10.5543 45.3131 11.3309 45.3131 12.4575V12.4684C45.3131 13.4637 46.1226 14.0434 47.9381 14.4043L49.6115 14.7434C52.9147 15.3997 54.4022 16.7449 54.4022 19.2278V19.2387C54.4022 22.2685 52.0178 24.1934 48.0366 24.1934ZM60.8115 24.1606C58.2085 24.1606 56.9834 23.1544 56.9834 20.6387V14.6012H55.3538V12.195H56.9834V9.32935H60.2099V12.195H62.3538V14.6012H60.2099V20.2888C60.2099 21.3825 60.7022 21.7544 61.6646 21.7544C61.9491 21.7544 62.1568 21.7216 62.3538 21.6997V24.0403C61.9928 24.095 61.4787 24.1606 60.8115 24.1606ZM67.4944 24.1059C65.1429 24.1059 63.5568 22.6294 63.5568 20.5622V20.5403C63.5568 18.4075 65.2085 17.1606 68.1178 16.9747L71.0163 16.7997V16.0777C71.0163 15.0387 70.3381 14.3934 69.0912 14.3934C67.899 14.3934 67.1771 14.9512 67.024 15.7059L67.0022 15.8043H64.0819L64.0928 15.6731C64.2678 13.5075 66.1272 11.9543 69.2226 11.9543C72.2522 11.9543 74.2099 13.5184 74.2099 15.8809V23.92H71.0163V22.1699H70.9506C70.2834 23.3731 69.0366 24.1059 67.4944 24.1059ZM66.7178 20.3981C66.7178 21.2622 67.4288 21.7763 68.5334 21.7763C69.9662 21.7763 71.0163 20.8574 71.0163 19.6325V18.7902L68.599 18.9433C67.3632 19.02 66.7178 19.5449 66.7178 20.3763V20.3981ZM76.3866 23.92V8.13716H79.5803V16.8872H79.6459L83.6053 12.195H87.2256L82.796 17.2371L87.4443 23.92H83.7584L80.4006 19.1294L79.5803 20.0371V23.92H76.3866ZM89.9928 10.6856C89.0302 10.6856 88.2866 9.93092 88.2866 9.02309C88.2866 8.11528 89.0302 7.3606 89.9928 7.3606C90.9554 7.3606 91.699 8.11528 91.699 9.02309C91.699 9.93092 90.9554 10.6856 89.9928 10.6856ZM88.396 23.92V12.195H91.5898V23.92H88.396ZM93.7334 23.92V12.195H96.9272V14.12H96.9928C97.5944 12.7747 98.7974 11.9543 100.569 11.9543C103.151 11.9543 104.616 13.6059 104.616 16.3512V23.92H101.423V17.0075C101.423 15.4762 100.701 14.6012 99.2678 14.6012C97.835 14.6012 96.9272 15.6512 96.9272 17.1825V23.92H93.7334ZM112.119 27.9888C108.893 27.9888 106.858 26.5341 106.552 24.6528L106.541 24.5544H109.648L109.68 24.6309C109.932 25.2105 110.785 25.7137 112.119 25.7137C113.771 25.7137 114.646 24.8606 114.646 23.5481V21.7544H114.58C113.968 22.9793 112.655 23.756 110.96 23.756C108.029 23.756 106.213 21.5685 106.213 17.9262V17.9153C106.213 14.1747 108.051 11.9543 111.015 11.9543C112.666 11.9543 113.946 12.8293 114.58 14.1965H114.646V12.195H117.84V23.5918C117.84 26.2059 115.641 27.9888 112.119 27.9888ZM112.065 21.4153C113.629 21.4153 114.657 20.1029 114.657 18.0029V17.9918C114.657 15.9028 113.618 14.6012 112.065 14.6012C110.479 14.6012 109.462 15.8918 109.462 17.9918V18.0029C109.462 20.1137 110.468 21.4153 112.065 21.4153ZM121.602 24.1059C120.607 24.1059 119.83 23.3184 119.83 22.3341C119.83 21.3387 120.607 20.5622 121.602 20.5622C122.587 20.5622 123.374 21.3387 123.374 22.3341C123.374 23.3184 122.587 24.1059 121.602 24.1059ZM124.544 23.92L128.219 18.0793L124.566 12.195H128.165L130.276 16.1544H130.341L132.419 12.195H135.897L132.233 17.9918L135.865 23.92H132.397L130.166 19.8512H130.101L127.902 23.92H124.544ZM139.19 27.7809C138.566 27.7809 137.932 27.7043 137.56 27.6387V25.2653C137.79 25.3091 138.162 25.3747 138.632 25.3747C139.583 25.3747 140.108 25.1013 140.393 24.3029L140.535 23.92L136.39 12.195H139.901L142.372 21.3606H142.46L144.943 12.195H148.312L144.287 24.1278C143.368 26.895 141.793 27.7809 139.19 27.7809ZM149.208 23.92V22.1043L155.104 14.6559V14.6012H149.296V12.195H158.757V14.2184L153.212 21.4481V21.5137H158.888V23.92H149.208Z"
            fill="white"
            className={cn(S.logoLigature)}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 0C7.12728 0 0 7.12728 0 16C0 24.8728 7.12728 32 16 32C24.8728 32 32 24.8728 32 16C32 7.12728 24.8728 0 16 0Z"
            fill="#333333"
          />
          <path
            d="M21.5272 17.7455L24.7272 16.7272C25.4546 16.4363 25.4546 15.5637 24.4363 15.1273L21.2363 14.1091C19.4909 13.5273 18.1818 12.2182 17.6 10.4727L16.5818 7.27274C16.4363 6.54548 15.5636 6.54548 15.2727 7.27274L14.1091 10.7637C13.5273 12.5091 12.2182 13.8182 10.4727 14.4L7.27272 15.4182C6.54545 15.5637 6.54545 16.4363 7.27272 16.7272L10.7636 17.8909C12.5091 18.4728 13.8182 19.7818 14.4 21.5272L15.4182 24.7272C15.5636 25.4546 16.4363 25.4546 16.7272 24.7272L17.8909 21.3818C18.4728 19.6363 19.7818 18.3272 21.5272 17.7455Z"
            fill="white"
          />
        </svg>
      </Link>
      <ul className={cn(S.endBox)}>
        {!stakingType && <CurrencyTabs {...currencyTabs} />}
        <NetworkSelect {...networkSelect} />
        <WalletCapsule />
      </ul>
    </header>
  );
};
