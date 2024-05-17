import Link from "next/link";
import { Icon } from "@/app/_components/Icon";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import { useNetworkReward, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { Skeleton } from "@/app/_components/Skeleton";

import * as S from "./historyTable.css";

export const HistoryEmptyState = () => {
  const stakeLink = useLinkWithSearchParams("stake");
  const { stakedBalance, isLoading: isStakedBalanceLoading } = useStakedBalance() || {};
  const { rewards, isLoading: isNetworkRewardsLoading } = useNetworkReward({ amount: stakedBalance }) || {};

  const isEstRewardsLoading = isNetworkRewardsLoading || isStakedBalanceLoading;

  const nextCompounding = rewards?.nextCompounding || 0;

  const dailyRewards = rewards?.daily || 0;
  const isEstRewardsSmall = dailyRewards > 0 && dailyRewards < 1;
  const formattedCycleReward = useDynamicAssetValueFromCoin({
    coinVal: dailyRewards,
    minValue: !isEstRewardsSmall ? undefined : 0.000001,
    formatOptions: !isEstRewardsSmall ? undefined : { mantissa: 6 },
  });

  return (
    <div className={S.emptyState}>
      <h4 className={S.title}>
        The compound will be in{" "}
        {isEstRewardsLoading ? (
          <Skeleton className={S.skeleton} width={60} height={16} />
        ) : nextCompounding > 100 ? (
          ">100 days"
        ) : (
          `${nextCompounding} days`
        )}
      </h4>
      <p className={S.subtitle}>
        You&apos;ve accrued{" "}
        {isEstRewardsLoading ? <Skeleton className={S.skeleton} width={60} height={14} /> : `${formattedCycleReward}.`}{" "}
        The app will only compound if more than 1 TIA is accrued.
      </p>

      <Link href={stakeLink} className={S.button}>
        Stake more
      </Link>
      <a
        className={S.link}
        href={process.env.NEXT_PUBLIC_COMPOUNDING_INFO_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>More info about compounding</span>
        <Icon name="arrow" size={12} />
      </a>
    </div>
  );
};
