"use client";
import { useNetworkReward, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import { Skeleton } from "@/app/_components/Skeleton";
import Tooltip from "@/app/_components/Tooltip";
import { useWallet } from "../../../_contexts/WalletContext";
import { CTACard } from "./CTACard";
import { WalletConnectionCard } from "./WalletConnectionCard";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { Icon } from "@/app/_components/Icon";

import * as S from "./heroCard.css";

export const HeroCard = () => {
  const { connectionStatus } = useWallet();
  const { stakedBalance, isLoading: isLoadingStakedBalance } = useStakedBalance() || {};
  const networkReward = useNetworkReward();

  const formattedStakedBalance = useDynamicAssetValueFromCoin({ coinVal: stakedBalance });
  const formattedDailyEarned = useDynamicAssetValueFromCoin({ coinVal: 0.2 });

  const isLoading = networkReward?.isLoading;

  if (connectionStatus === "connected") {
    if (isLoadingStakedBalance) {
      return (
        <CTACard
          topSubtitle={<Skeleton width={95} height={14} />}
          title={<Skeleton width={180} height={20} />}
          subtitle={<Skeleton width={95} height={14} />}
        />
      );
    }

    if (stakedBalance) {
      return (
        <CTACard
          topSubtitle={
            <>
              <span>Total balance</span>
              <Tooltip
                className={S.balanceTooltip}
                trigger={<Icon name="info" />}
                content="This balance only tracks stake that has been done through Staking.xyz."
              />
            </>
          }
          title={formattedStakedBalance}
          subtitle={<span className={S.dailyEarned}>+Daily earned {formattedDailyEarned}</span>}
        />
      );
    }

    return (
      <CTACard
        topSubtitle="You're missing"
        title={isLoading ? <Skeleton width={180} height={20} /> : `${networkReward?.rewards.percentage}% rewards`}
        subtitle="Also time to manage your staking"
      />
    );
  }

  return <WalletConnectionCard />;
};
