import type { Network } from "../../types";
import cn from "classnames";
import Image from "next/image";
import * as Select from "../Select";
import { networkVariants, networkInfo } from "../../consts";
import * as S from "./networkSelect.css";
import CosmosHubLogo from "../../_assets/networks/cosmos-hub-logo.svg";
import { useNetworkReward } from "@/app/_services/stakingOperator/hooks";

export type NetworkSelectProps = {
  activeNetwork: Network;
  onNetworkChange: (network: Network) => void;
};

export const NetworkSelect = ({ activeNetwork, onNetworkChange }: NetworkSelectProps) => {
  return (
    <Select.Main
      defaultValue={activeNetwork}
      onValueChange={(value) => onNetworkChange(value as Network)}
      triggerContent={
        <Select.Trigger label="Network">
          <Image src={networkInfo[activeNetwork].logo} width={18} height={18} alt={`Logo of ${activeNetwork}`} />
          <Select.Value asChild>
            <p className={cn(S.triggerItemTitle)}>{networkInfo[activeNetwork].name}</p>
          </Select.Value>
          <Select.TriggerIcon />
        </Select.Trigger>
      }
      items={
        <>
          {networkVariants.map((network) => (
            <NetworkItem network={network} key={"select-" + network} />
          ))}
          {disabledNetworks.map((network) => (
            <Select.Item
              key={"select-" + network}
              value={network.id as any}
              className={cn(S.selectItemDisabled)}
              disabled
            >
              <div className={cn(S.selectItemMain)}>
                <Image src={network.logo} width={18} height={18} alt={`Logo of ${network}`} />
                <h5 className={cn(S.itemTitle)}>{network.name}</h5>
              </div>
              <p className={cn(S.itemSuffixText)}>Coming soon</p>
            </Select.Item>
          ))}
        </>
      }
    />
  );
};

const NetworkItem = ({ network }: { network: Network }) => {
  const networkReward = useNetworkReward(network);

  return (
    <Select.Item value={network} className={cn(S.selectItem)}>
      <div className={cn(S.selectItemMain)}>
        <Image src={networkInfo[network].logo} width={18} height={18} alt={`Logo of ${network}`} />
        <h5 className={cn(S.itemTitle)}>{networkInfo[network].name}</h5>
      </div>
      <p className={cn(S.itemSuffixText)}>{networkReward?.rewards.percentage} %</p>
    </Select.Item>
  );
};

const disabledNetworks = [
  {
    id: "cosmoshub",
    name: "Cosmos Hub",
    logo: CosmosHubLogo,
  },
];
