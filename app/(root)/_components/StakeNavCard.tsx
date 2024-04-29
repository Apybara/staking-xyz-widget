"use client";
import { Skeleton } from "@/app/_components/Skeleton";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import { useDynamicAssetValueFromCoin } from "../../_utils/conversions/hooks";
import * as NavCard from "../_components/NavCard";

export const StakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { address, activeWallet, connectionStatus } = useWallet();
  const { network } = useShell();
  const { data: balanceData, isLoading } = useWalletBalance({ address, network, activeWallet }) || {};
  const balance = useDynamicAssetValueFromCoin({ coinVal: balanceData });

  const isDisconnected = connectionStatus !== "connected";

  return (
    <NavCard.Card
      {...props}
      page="stake"
      disabled={isLoading}
      endBox={
        !isDisconnected
          ? {
              title: (
                <NavCard.SecondaryText>
                  {isLoading ? <Skeleton width={68} height={12} /> : "Available"}
                </NavCard.SecondaryText>
              ),
              value: (
                <NavCard.PrimaryText>{isLoading ? <Skeleton width={82} height={16} /> : balance}</NavCard.PrimaryText>
              ),
            }
          : undefined
      }
    />
  );
};
