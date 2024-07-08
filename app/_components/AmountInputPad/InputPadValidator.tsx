import Image from "next/image";
import cn from "classnames";

import { defaultNetwork, networkWalletPrefixes } from "@/app/consts";
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

  const validatorName = !!name && name !== "not implemented" ? name : "";
  const validatorLogo = !!logo && logo !== "not implemented" ? logo : "";

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

          <div className={S.validatorDetails}>
            {validatorName && <p className={S.validatorName}>{validatorName}</p>}

            {address ? (
              <span className={S.validatorAddressContainer}>
                <FormattedAddress
                  className={cn(!!validatorName ? S.validatorAddress : S.validatorName)}
                  address={address}
                  prefixString={networkWalletPrefixes[network || defaultNetwork]}
                />
                <Icon name="externalLink" size={12} />
              </span>
            ) : (
              <p className={S.validatorInvalid}>Invalid validator provided</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
