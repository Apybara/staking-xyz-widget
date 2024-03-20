export const getAddressChunks = ({
  address,
  prefixString = "celestia1",
  startLenExcludesPrefix = 4,
  endLen = 4,
}: GetAddressChunksProps) => {
  const prefixLength = (prefixString.length || 0) + startLenExcludesPrefix;
  const start = address.slice(0, prefixLength);
  const end = address.slice(endLen * -1);

  return {
    start,
    end,
    prefixString,
    ellipsis: ELLIPSIS,
  };
};

export const ELLIPSIS = "..";

export type GetAddressChunksProps = {
  address: string;
  prefixString?: string;
  startLenExcludesPrefix?: number;
  endLen?: number;
};
