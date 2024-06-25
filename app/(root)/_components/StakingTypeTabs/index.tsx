import cn from "classnames";

import * as S from "./stakingTabs.css";
import { useStakingTypeChange } from "@/app/_contexts/ShellContext/hooks";
import { stakingTypeMap } from "@/app/consts";
import type { StakingType } from "@/app/types";

const tabs = [
  {
    label: stakingTypeMap.native,
    value: "native",
  },
  {
    label: stakingTypeMap.liquid,
    value: "liquid",
  },
];

export const StakingTypeTabs = () => {
  const { activeStakingType, onUpdateRouter } = useStakingTypeChange();

  return (
    <ul className={cn(S.tabs)}>
      {tabs.map(({ label, value }) => (
        <li key={`staking-tab-${value}`} className={cn(S.tab)}>
          <button
            className={cn(S.tabButton({ state: activeStakingType === value ? "highlighted" : "default" }))}
            onClick={() => onUpdateRouter(value as StakingType)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
};
