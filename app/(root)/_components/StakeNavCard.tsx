"use client";
import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useShell } from "../../_contexts/ShellContext";
import { useWallet } from "../../_contexts/WalletContext";
import { useWalletBalance } from "../../_services/wallet/hooks";
import {
  getFormattedUSDPriceFromCoin,
  getFormattedEURPriceFromCoin,
  getFormattedCoinValue,
} from "../../_utils/conversions";
import * as NavCard from "../_components/NavCard";

export const StakeNavCard = (props: NavCard.PageNavCardProps) => {
  const { address, activeWallet } = useWallet();
  const { network, currency, coinPrice } = useShell();
  const { data: balanceData } = useWalletBalance({ address, network, activeWallet }) || {};

  const balance = useMemo(() => {
    if (!balanceData) return undefined;
    const castedCurrency = currency || "USD";

    if (castedCurrency === "USD") {
      return getFormattedUSDPriceFromCoin({
        val: balanceData,
        price: coinPrice?.[network || "celestia"]?.USD || 0,
      });
    }
    if (castedCurrency === "EUR") {
      return getFormattedEURPriceFromCoin({
        val: balanceData,
        price: coinPrice?.[network || "celestia"]?.EUR || 0,
      });
    }
    return getFormattedCoinValue({ val: BigNumber(balanceData).toNumber() });
  }, [balanceData, coinPrice, currency, network]);

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
