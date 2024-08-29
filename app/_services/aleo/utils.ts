import type { AleoNetwork, AleoWalletType, StakingType } from "@/app/types";
import BigNumber from "bignumber.js";
import { Asset, AssetList } from "@chain-registry/types";
import { assets } from "chain-registry";
import { getFormattedCoinValue } from "@/app/_utils/conversions";
import { aleoNetworkVariants, aleoWalletVariants, networkCurrency, aleoFees } from "@/app/consts";
import { PALEO_INSTANT_WITHDRAWAL_FEE_RATIO } from "@/app/consts";

export const getAleoTotalUnstakeFees = ({
  amount,
  stakingType,
  isInstant,
  pAleoToAleoRate,
}: {
  amount: string;
  stakingType: StakingType;
  isInstant: boolean;
  pAleoToAleoRate?: number;
}) => {
  if (amount === "" || amount === "0") return undefined;

  const txFee = getMicroCreditsToCredits(aleoFees.unstake[stakingType || "native"]);
  if (!isInstant) {
    return txFee;
  }

  const pAleoInstantWithdrawFee = getAleoFromPAleo(getPAleoInstantWithdrawFee({ amount }), pAleoToAleoRate || 1);
  return txFee + pAleoInstantWithdrawFee;
};

export const getInstantWithdrawalAleoAmount = ({
  pAleoMicroCredits,
  pAleoToAleoRate,
}: {
  pAleoMicroCredits: string | number;
  pAleoToAleoRate: number;
}) => {
  const pAleoInstantWithdrawFee = getPAleoInstantWithdrawFee({ amount: pAleoMicroCredits.toString() });
  const txPAleoAmount = BigNumber(pAleoMicroCredits).minus(pAleoInstantWithdrawFee).toString();
  const aleoMicroCreditsAmount = getAleoFromPAleo(txPAleoAmount, pAleoToAleoRate);
  // The round-down value is to prevent fluctuation of the pALEO to ALEO conversion rate
  const aleoMicroCreditsRoundDownAmount = Math.floor(BigNumber(aleoMicroCreditsAmount).times(0.99998).toNumber());
  return aleoMicroCreditsRoundDownAmount + "u64";
};

export const getIsAleoNetwork = (network: string | null): network is AleoNetwork => {
  return aleoNetworkVariants.includes(network as AleoNetwork);
};

export const getIsAleoWalletType = (walletType: string): walletType is AleoWalletType => {
  return aleoWalletVariants.includes(walletType as AleoWalletType);
};

export const getIsAleoAddressFormat = (address: string): boolean => {
  if (typeof address !== "string") return false;
  if (!address) return false;
  if (address.length !== 63 || !address.startsWith("aleo")) return false;

  return getIsBech32(address);
};

export const getCoinValueFromDenom = ({ network, amount }: { network: AleoNetwork; amount?: string | number }) => {
  const exponent = getExponent(network);
  return new BigNumber(amount || 0).multipliedBy(10 ** -exponent).toString();
};

export const getChainAssets = (network: AleoNetwork) => {
  return assets.find((chain) => chain.chain_name === network) as AssetList;
};

const getExponent = (network: AleoNetwork) => {
  const coin = getCoin(network);
  return coin?.denom_units?.find((unit) => unit.denom === coin.display)?.exponent || 0;
};

const getCoin = (network: AleoNetwork) => {
  const chainAssets = getChainAssets(network);
  const denomDisplayName = networkCurrency[network].toLowerCase();
  return chainAssets?.assets.find((asset) => asset.display === denomDisplayName) as Asset;
};

export const getMicroCreditsToCredits = (microCredits: string | number) => {
  return BigNumber(microCredits).div(TOKEN_CONVERSION_FACTOR).toNumber();
};

export const getCreditsToMicroCredits = (credits: string | number) => {
  return Math.floor(BigNumber(credits).times(TOKEN_CONVERSION_FACTOR).toNumber());
};

export const getFormattedPAleoFromAleo = ({
  val,
  aleoToPAleoRate,
}: {
  val: string | number;
  aleoToPAleoRate: number;
}) => {
  return getFormattedCoinValue({
    val: getPAleoFromAleo(val, aleoToPAleoRate),
    formatOptions: {
      currencySymbol: "pALEO",
    },
  });
};

export const getFormattedAleoFromPAleo = ({
  val,
  pAleoToAleoRate,
}: {
  val: string | number;
  pAleoToAleoRate: number;
}) => {
  return getFormattedCoinValue({
    val: getAleoFromPAleo(val, pAleoToAleoRate),
    formatOptions: {
      currencySymbol: networkCurrency.aleo,
    },
  });
};

export const getPAleoFromAleo = (aleo: string | number, aleoToPAleoRate: number) => {
  return BigNumber(aleo)
    .times(aleoToPAleoRate || "1")
    .toNumber();
};

export const getAleoFromPAleo = (pAleo: string | number, pAleoToAleoRate: number) => {
  return BigNumber(pAleo)
    .times(pAleoToAleoRate || "1")
    .toNumber();
};

export const getPAleoInstantWithdrawFee = ({ amount }: { amount: string }) => {
  return BigNumber(amount).times(PALEO_INSTANT_WITHDRAWAL_FEE_RATIO).toNumber();
};

const TOKEN_CONVERSION_FACTOR = Math.pow(10, 6); // 1,000,000

const getIsBech32 = (address?: string) => {
  if (!address) return false;

  const charset = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
  const separator = "1";

  // Length Check
  if (address.length < 14 || address.length > 74) return false;

  // Lowercase/Uppercase Check
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) return false;

  // Find Separator
  const separatorIndex = address.lastIndexOf(separator);
  if (separatorIndex === -1) return false;

  // Check Human-Readable Part
  const hrp = address.slice(0, separatorIndex);
  if (!hrp) return false;

  // Check Data Part
  const data = address.slice(separatorIndex + 1);
  for (let i = 0; i < data.length; i++) {
    if (charset.indexOf(data[i]?.toLowerCase() as string) === -1) return false;
  }

  return true;
};
