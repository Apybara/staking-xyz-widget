"use client";
import { useSearchParams, usePathname } from "next/navigation";
import { useShell } from "@/app/_contexts/ShellContext";
import { Icon } from "@/app/_components/Icon";
import * as Dialog from "../Dialog";
import { CTAButton } from "../CTAButton";
import * as S from "./questWarningBannerAndDialog.css";

export const QuestWarningBannerAndDialog = () => {
  const { network, isOnMobileDevice } = useShell();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const shouldShowBanner = pathname === "/stake" && network === "aleo" && !!isOnMobileDevice && !userId;
  if (!shouldShowBanner) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger className={S.banner}>
        <div className={S.bannerMain}>
          <Icon name="warning" size={16} className={S.bannerWarning} />{" "}
          <span>This page will not complete the Quest.</span>{" "}
        </div>
        <Icon name="chevron" className={S.bannerChevron} />
      </Dialog.Trigger>
      <Dialog.Main>
        <Dialog.Content className={S.dialog}>
          <div className={S.dialogTop}>
            <Icon name="warning" size={40} className={S.dialogWarning} />
            <Dialog.Title className={S.dialogTitle}>This is the wrong page</Dialog.Title>
          </div>
          <div className={S.dialogMain}>
            <Dialog.Description className={S.dialogDescription}>
              If you are looking to complete the Coinbase Quest, you will need to open this page again. Please go back
              to the Coinbase Quest page and click Start to open this page again.
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <CTAButton variant="tertiary">Dismiss</CTAButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Main>
    </Dialog.Root>
  );
};
