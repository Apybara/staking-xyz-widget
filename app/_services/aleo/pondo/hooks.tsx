import { useWallet } from "@/app/_contexts/WalletContext";
import { getRebalancingPeriod } from ".";

export const useRebalancingPeriod = () => {
  const { address } = useWallet();

  const { rebalancingPeriod } = getRebalancingPeriod({ address: address as string });

  return { rebalancingPeriod };
};
