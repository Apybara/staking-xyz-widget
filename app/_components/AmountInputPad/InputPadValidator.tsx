import Image from "next/image";
import cn from "classnames";

import { defaultNetwork, networkWalletPrefixes } from "@/app/consts";
import { useShell } from "@/app/_contexts/ShellContext";
import { Icon } from "../Icon";
import { FormattedAddress } from "../FormattedAddress";

import ValidatorPlaceholderLogo from "../../_assets/validators/validator-placeholder-logo.svg";
import * as S from "./amountInputPad.css";

export const InputPadValidator = ({ name, logo, address }: { name?: string; logo?: string; address: string }) => {
  const { network } = useShell();

  const isRegistered = !!name;

  return (
    <div className={S.validator}>
      <Image src={logo || ValidatorPlaceholderLogo} width={24} height={24} alt={`Validator Logo Placeholder  `} />

      <div className={S.validatorDetails}>
        {name && <p className={S.validatorName}>{name}</p>}

        <span className={S.validatorAddressContainer}>
          <FormattedAddress
            className={cn(isRegistered ? S.validatorAddress : S.validatorName)}
            address={address}
            prefixString={networkWalletPrefixes[network || defaultNetwork]}
          />
          <Icon name="externalLink" size={12} />
        </span>
      </div>
    </div>
  );
};
