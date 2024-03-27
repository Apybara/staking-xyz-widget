import type { ReactNode } from "react";
import { GrazProvider as Provider } from "graz";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../../consts";
import { celestiaChainInfo, celestiatestnet3ChainInfo } from "../../_services/cosmos/graz/consts";

export const GrazProvider = ({
  walletConnectAPIKey,
  children,
}: {
  walletConnectAPIKey: string;
  children: ReactNode;
}) => {
  return (
    <Provider
      grazOptions={{
        chains: [celestiaChainInfo, celestiatestnet3ChainInfo],
        walletConnect: {
          options: {
            projectId: walletConnectAPIKey,
            metadata: {
              name: SITE_TITLE,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              icons: [""],
            },
          },
        },
      }}
    >
      {children}
    </Provider>
  );
};
