import cn from "classnames";

import * as S from "./stakingTabs.css";
import { useStakingTypeChange } from "@/app/_contexts/ShellContext/hooks";
import { stakingTypeMap } from "@/app/consts";
import type { StakingTypeTab } from "@/app/types";
import Tooltip from "@/app/_components/Tooltip";
import { Icon } from "@/app/_components/Icon";

const tabs: Array<StakingTypeTab> = [
  {
    label: stakingTypeMap.native,
    value: "native",
  },
  {
    label: stakingTypeMap.liquid,
    value: "liquid",
    disabled: true,
  },
];

export const StakingTypeTabs = () => {
  const { activeStakingType, onUpdateRouter } = useStakingTypeChange();

  return (
    <ul className={cn(S.tabs)}>
      {tabs.map(({ label, value, disabled }) => (
        <li key={`staking-tab-${value}`} className={cn(S.tab)}>
          <button
            className={cn(
              S.tabButton({ state: disabled ? "disabled" : activeStakingType === value ? "highlighted" : "default" }),
            )}
            onClick={() => onUpdateRouter(value)}
            disabled={disabled}
          >
            <span>{label}</span>
            {disabled && <Tooltip className={S.tooltip} trigger={<Icon name="info" />} content="Coming soon!" />}
          </button>
        </li>
      ))}
    </ul>
  );
};
