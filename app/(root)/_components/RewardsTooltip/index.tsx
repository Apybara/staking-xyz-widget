"use client";
import { useDynamicAssetValueFromCoin } from "../../../_utils/conversions/hooks";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";
import * as S from "./rewardsTooltip.css";

export const RewardsTooltip = () => {
  const formattedDailyReward = useDynamicAssetValueFromCoin({ coinVal: 1 });
  const formattedMonthlyReward = useDynamicAssetValueFromCoin({ coinVal: 10 });
  const formattedYearlyReward = useDynamicAssetValueFromCoin({ coinVal: 100 });

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
