"use client";
import { useSearchParams, usePathname } from "next/navigation";
import { useShell } from "@/app/_contexts/ShellContext";
import { LinkCTAButton } from "../CTAButton";
import { getIsUserIdValid } from "@/app/_utils/aleoQuest";

import { WarningBannerAndDialog } from "../WarningBannerAndDialog";

export const QuestWarningBannerAndDialog = () => {
  const { network, isOnMobileDevice } = useShell();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const isUserIdValid = getIsUserIdValid(userId || undefined);

  return (
    <WarningBannerAndDialog
      active={pathname === "/stake" && network === "aleo" && !!isOnMobileDevice && !isUserIdValid}
      title="This page will not complete the Quest."
      subtitle="This is the wrong page"
      message=" If you are looking to complete the Coinbase Quest, you will need to open this page again. Please go back
              to the Coinbase Quest page and click Start to open this page again."
      extraAction={
        <LinkCTAButton
          variant="secondary"
          href="https://coinbase.com/learning-rewards/aleo/lesson/6?type=quest&campaign=aleo-quest"
          target="_blank"
          rel="noreferrer"
        >
          Open the Aleo Quest page
        </LinkCTAButton>
      }
    />
  );
};
