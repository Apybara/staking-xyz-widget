import Image from "next/image";
import cn from "classnames";

import { defaultNetwork, networkExplorer, networkWalletPrefixes } from "@/app/consts";
import { useShell } from "@/app/_contexts/ShellContext";
import { Icon } from "../Icon";
import { Skeleton } from "../Skeleton";
import { FormattedAddress } from "../FormattedAddress";

import ValidatorPlaceholderLogo from "../../_assets/validators/validator-placeholder-logo.svg";
import * as S from "./amountInputPad.css";

export const InputPadValidator = ({
  isLoading,
  name,
  logo,
  address,
}: {
  isLoading?: boolean;
  name?: string;
  logo?: string;
  address?: string;
}) => {
  const { network } = useShell();
  const castedNetwork = network || defaultNetwork;

  const validatorName = !!name && name !== "not implemented" ? name : "";
  const validatorLogo = !!logo && logo !== "not implemented" ? logo : "";
  const validatorUrl = `${networkExplorer[castedNetwork]}address?a=${address}`;

  return (
    <div className={S.validator}>
      {isLoading ? (
        <Skeleton height={24} width={200} />
      ) : (
        <>
          <Image
            src={validatorLogo || ValidatorPlaceholderLogo}
            width={24}
            height={24}
            alt={`Validator Logo Placeholder  `}
          />

          {address ? (
            <a href={validatorUrl} className={S.validatorDetails} target="_blank" rel="noreferrer">
              {validatorName && <p className={S.validatorName}>{validatorName}</p>}

              <span className={S.validatorAddressContainer}>
                <FormattedAddress
                  className={cn(!!validatorName ? S.validatorAddress : S.validatorName)}
                  address={address}
                  prefixString={networkWalletPrefixes[castedNetwork]}
                />
                <Icon name="externalLink" size={12} />
              </span>
            </a>
          ) : (
            <div className={S.validatorDetails}>
              <p className={S.validatorInvalid}>Invalid validator provided</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
