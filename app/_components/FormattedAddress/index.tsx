import type { GetAddressChunksProps } from "../../_utils/address";
import cn from "classnames";
import { getAddressChunks } from "../../_utils/address";
import * as S from "./formattedAddress.css";

export type FormattedAddressProps = GetAddressChunksProps & {
  className?: string;
};

export const FormattedAddress = ({
  address,
  prefixString = "celestia1",
  startLenExcludesPrefix,
  endLen,
  className,
}: FormattedAddressProps) => {
  const { start, end, ellipsis } = getAddressChunks({ address, prefixString, startLenExcludesPrefix, endLen });

  return (
    <p className={cn(S.main, className)}>
      <span className={S.prefixString}>{prefixString}</span>
      <span className={S.start}>{start.replace(prefixString, "")}</span>
      <span className={S.ellipsis}>{ellipsis}</span>
      <span className={S.end}>{end}</span>
    </p>
  );
};
