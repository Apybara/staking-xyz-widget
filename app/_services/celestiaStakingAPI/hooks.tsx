import { useQuery } from "@tanstack/react-query";
import { getAddressAuthCheck } from ".";

export const useCelestiaAddressAuthCheck = ({ address }: { address?: string }) => {
  const { data, isLoading, error } = useQuery({
    enabled: !!address,
    queryKey: ["celestiaAddressAuthCheck", address],
    queryFn: () => getAddressAuthCheck(address || ""),
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, error };
};
