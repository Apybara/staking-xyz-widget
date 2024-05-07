"use client";
import { useNetworkReward, useRewards, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
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
  const { stakedBalance, isLoading: isLoadingStakedBalance, error: stakedBalanceError } = useStakedBalance() || {};
  const { isLoading: isLoadingReward, rewards, error: rewardError } = useNetworkReward() || {};
  const { query } = useRewards();
  const { daily_rewards } = query?.data || {};

  const formattedStakedBalance = useDynamicAssetValueFromCoin({ coinVal: stakedBalance });
  const formattedDailyEarned = useDynamicAssetValueFromCoin({ coinVal: daily_rewards });

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

    if (stakedBalanceError) {
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
          title="Error"
          subtitle="Please try to refresh"
        />
      );
    }

    if (stakedBalance && stakedBalance !== "0") {
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
          subtitle={!!daily_rewards && <span className={S.dailyEarned}>+Daily earned {formattedDailyEarned}</span>}
        />
      );
    }

    if (rewardError) {
      return <CTACard topSubtitle="Begin earning" title="Error" subtitle="Please try to refresh" />;
    }

    return (
      <CTACard
        topSubtitle="Begin earning"
        title={isLoadingReward ? <Skeleton width={180} height={20} /> : `${rewards?.percentage}% rewards`}
        subtitle="Making staking easier to manage"
      />
    );
  }

  return <WalletConnectionCard />;
};
