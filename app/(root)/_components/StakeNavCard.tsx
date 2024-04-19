"use client";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { useDynamicAssetValueFromCoin } from "../../_utils/conversions/hooks";
import * as NavCard from "../_components/NavCard";

export const StakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { address, activeWallet } = useWallet();
  const { network } = useShell();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};
  const balance = useDynamicAssetValueFromCoin({ coinVal: balanceData });

  return (
    <NavCard.Card
      {...props}
      page="stake"
      endBox={
        balance
          ? {
              title: <NavCard.SecondaryText>Available</NavCard.SecondaryText>,
              value: <NavCard.PrimaryText>{balance}</NavCard.PrimaryText>,
            }
          : undefined
      }
    />
  );
};
