"use client";
import type { ReactNode } from "react";
import { Icon } from "@/app/_components/Icon";
import * as Dialog from "../Dialog";
import { CTAButton } from "../CTAButton";

import * as S from "./warningBannerAndDialog.css";

export const WarningBannerAndDialog = ({
  active,
  title,
  subtitle,
  message,
  extraAction,
}: {
  active: boolean;
  title: ReactNode;
  subtitle: ReactNode;
  message: ReactNode;
  extraAction?: ReactNode;
}) => {
  if (!active) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger className={S.banner}>
        <div className={S.bannerMain}>
          <Icon name="warning" size={16} className={S.bannerWarning} /> <span>{title}</span>{" "}
        </div>
        <Icon name="chevron" className={S.bannerChevron} />
      </Dialog.Trigger>
      <Dialog.Main>
        <Dialog.Content className={S.dialog}>
          <div className={S.dialogTop}>
            <Icon name="warning" size={40} className={S.dialogWarning} />
            <Dialog.Title className={S.dialogTitle}>{subtitle}</Dialog.Title>
          </div>
          <div className={S.dialogMain}>
            <Dialog.Description className={S.dialogDescription}>{message}</Dialog.Description>
          </div>
          <div className={S.dialogBottom}>
            <Dialog.Close asChild>
              <CTAButton variant="tertiary">Dismiss</CTAButton>
            </Dialog.Close>

            {extraAction && <Dialog.Close asChild>{extraAction}</Dialog.Close>}
          </div>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};
