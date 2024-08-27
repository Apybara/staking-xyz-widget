"use client";
import { useMemo } from "react";
import { useShell } from "@/app/_contexts/ShellContext";
import { useNetworkReward, useAddressRewards, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import { getIsAleoNetwork } from "@/app/_services/aleo/utils";
import { Skeleton } from "@/app/_components/Skeleton";
import Tooltip from "@/app/_components/Tooltip";
import { useWallet } from "../../../_contexts/WalletContext";
import { CTACard } from "./CTACard";
import { WalletConnectionCard } from "./WalletConnectionCard";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { Icon } from "@/app/_components/Icon";

import * as S from "./heroCard.css";

export const HeroCard = () => {
  const { network } = useShell();
  const { connectionStatus } = useWallet();
  const { stakedBalance, isLoading: isLoadingStakedBalance, error: stakedBalanceError } = useStakedBalance() || {};
  const { isLoading: isLoadingReward, rewards, error: rewardError } = useNetworkReward({ amount: stakedBalance }) || {};
  const { data: addressRewards } = useAddressRewards() || {};
  const { dailyRewards } = addressRewards || {};

  const formattedStakedBalance = useDynamicAssetValueFromCoin({ coinVal: stakedBalance });
  const formattedDailyEarned = useDynamicAssetValueFromCoin({ coinVal: dailyRewards || 0 });
  const formattedEstDailyReward = useDynamicAssetValueFromCoin({ coinVal: rewards?.daily });
  const addressRewardsValue = useMemo(() => {
    if (!stakedBalance || stakedBalance === "0") return undefined;
    if (dailyRewards && dailyRewards !== "0") return `+Daily earned ${formattedDailyEarned}`;
    if (formattedEstDailyReward) return `Est. daily rewards ${formattedEstDailyReward}`;
    return undefined;
  }, [addressRewards]);

  const isAleo = getIsAleoNetwork(network);

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
              <span>Total staked balance</span>
              {!isAleo && (
                <Tooltip
                  className={S.balanceTooltip}
                  trigger={<Icon name="info" />}
                  content="This balance only tracks stake that has been done through Staking.xyz."
                />
              )}
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
              <span>Total staked balance</span>
              {!isAleo && (
                <Tooltip
                  className={S.balanceTooltip}
                  trigger={<Icon name="info" />}
                  content="This balance only tracks stake that has been done through Staking.xyz."
                />
              )}
            </>
          }
          title={formattedStakedBalance}
          subtitle={!!addressRewardsValue && <span className={S.dailyEarned}>{addressRewardsValue}</span>}
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
