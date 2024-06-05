import type { ReactNode } from "react";
import { GrazProvider as Provider } from "graz";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, SITE_WALLET_CONNECT_LOGO } from "../../consts";
import {
  celestiaChainInfo,
  celestiatestnet3ChainInfo,
  cosmoshubChainInfo,
  cosmoshubtestnetChainInfo,
} from "../../_services/cosmos/consts";

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
        chains: [celestiaChainInfo, celestiatestnet3ChainInfo, cosmoshubChainInfo, cosmoshubtestnetChainInfo],
        walletConnect: {
          options: {
            projectId: walletConnectAPIKey,
            metadata: {
              name: SITE_TITLE,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              icons: [SITE_WALLET_CONNECT_LOGO],
            },
          },
        },
      }}
    >
      {children}
    </Provider>
  );
};
