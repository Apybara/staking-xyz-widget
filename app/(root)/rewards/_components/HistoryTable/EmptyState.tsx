import Link from "next/link";
import BigNumber from "bignumber.js";
import { Icon } from "@/app/_components/Icon";
import { useLinkWithSearchParams } from "@/app/_utils/routes";
import { useAddressRewards, useNetworkReward, useStakedBalance } from "@/app/_services/stakingOperator/hooks";
import { useDynamicAssetValueFromCoin } from "@/app/_utils/conversions/hooks";
import { Skeleton } from "@/app/_components/Skeleton";

import * as S from "./historyTable.css";

export const HistoryEmptyState = () => {
  const stakeLink = useLinkWithSearchParams("stake");
  const { stakedBalance, isLoading: isStakedBalanceLoading } = useStakedBalance() || {};
  const { rewards, isLoading: isNetworkRewardsLoading } = useNetworkReward({ amount: stakedBalance }) || {};

  const { data: addressRewards, isLoading: isAddressRewardsLoading } = useAddressRewards()?.query || {};
  const { accrued_rewards } = addressRewards || {};

  const isAccruedRewardsSmall =
    accrued_rewards && BigNumber(accrued_rewards).isLessThan(1) && BigNumber(accrued_rewards).isGreaterThan(0);
  const formattedAccruedRewards = useDynamicAssetValueFromCoin({
    coinVal: accrued_rewards,
    minValue: !isAccruedRewardsSmall ? undefined : 0.000001,
    formatOptions: !isAccruedRewardsSmall ? undefined : { mantissa: 6 },
  });

  const nextCompounding = rewards?.nextCompoundingDays || 0;
  const isEstRewardsLoading = isNetworkRewardsLoading || isStakedBalanceLoading;

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
        {isAddressRewardsLoading ? (
          <Skeleton className={S.skeleton} width={60} height={14} />
        ) : (
          `${formattedAccruedRewards}.`
        )}{" "}
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
