"use client";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import { useNetworkReward } from "@/app/_services/stakingOperator/celestia/hooks";
import * as S from "./rewardsTooltip.css";

export const RewardsTooltip = () => {
  const { rewards } = useNetworkReward();

  const formattedDailyReward = useDynamicAssetValueFromCoin({ coinVal: rewards.daily });
  const formattedMonthlyReward = useDynamicAssetValueFromCoin({ coinVal: rewards.monthly });
  const formattedYearlyReward = useDynamicAssetValueFromCoin({ coinVal: rewards.yearly });

  return (
    <Tooltip
      className={S.rewardsTooltip}
      variant="multilines"
      trigger={<Icon name="info" />}
      title="Estimated rewards"
      content={
        <ul className={S.rewardsList}>
          <li className={S.rewardsItem}>
            <span className={S.rewardsInterval}>Daily</span>
            <span className={S.rewardsValue}>{formattedDailyReward}</span>
          </li>
          <li className={S.rewardsItem}>
            <span className={S.rewardsInterval}>Monthly</span>
            <span className={S.rewardsValue}>{formattedMonthlyReward}</span>
          </li>
          <li className={S.rewardsItem}>
            <span className={S.rewardsInterval}>Yearly</span>
            <span className={S.rewardsValue}>{formattedYearlyReward}</span>
          </li>
        </ul>
      }
    />
  );
};
