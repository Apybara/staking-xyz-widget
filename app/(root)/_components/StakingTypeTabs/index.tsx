import type { StakingTypeTab } from "@/app/types";
import cn from "classnames";
import { useShell } from "@/app/_contexts/ShellContext";
import { useStakingTypeChange } from "@/app/_contexts/ShellContext/hooks";
import { stakingTypeMap } from "@/app/consts";
import { Icon } from "@/app/_components/Icon";
import Tooltip from "@/app/_components/Tooltip";

import * as S from "./stakingTabs.css";

export const StakingTypeTabs = () => {
  const { stakingType, validator } = useShell();
  const { activeStakingType, onUpdateRouter } = useStakingTypeChange();
  const { tabs } = useStakingTypeTabOptions();

  return (
    stakingType &&
    !validator && (
      <ul className={cn(S.tabs)}>
        {tabs.map(({ label, value, disabled }) => (
          <li key={`staking-tab-${value}`} className={cn(S.tab)}>
            <button
              className={cn(
                S.tabButton({
                  state: disabled ? "disabled" : activeStakingType === value ? "highlighted" : "default",
                }),
              )}
              onClick={() => onUpdateRouter(value)}
              disabled={disabled}
            >
              {activeStakingType === value && (
                <span className={S.activeTabIcon}>
                  <Icon name="circleCheck" />
                </span>
              )}
              <span>{label}</span>
              {disabled && <Tooltip className={S.tooltip} trigger={<Icon name="info" />} content="Coming soon!" />}
            </button>
          </li>
        ))}
      </ul>
    )
  );
};

const useStakingTypeTabOptions = () => {
  const isAleoNativeStakingEnabled = process.env.NEXT_PUBLIC_ALEO_NATIVE_STAKING_ENABLED === "true";
  const isAleoLiquidStakingEnabled = process.env.NEXT_PUBLIC_ALEO_LIQUID_STAKING_ENABLED === "true";

  const tabs: Array<StakingTypeTab> = [
    {
      label: stakingTypeMap.native,
      value: "native",
      disabled: !isAleoNativeStakingEnabled,
    },
    {
      label: stakingTypeMap.liquid,
      value: "liquid",
      disabled: !isAleoLiquidStakingEnabled,
    },
  ];

  return { tabs };
};
