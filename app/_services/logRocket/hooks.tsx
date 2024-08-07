import { useEffect } from "react";
import LogRocket from "logrocket";
import useLocalStorage from "use-local-storage";
import setupLogRocketReact from "logrocket-react";
import { useWallet } from "@/app/_contexts/WalletContext";
import { useShell } from "@/app/_contexts/ShellContext";

const LOGROCKET_APP_ID = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;
const LOGROCKET_ENABLED = process.env.NEXT_PUBLIC_LOGROCKET_ENABLED;

export const useInitLogRocket = () => {
  useEffect(() => {
    if (LOGROCKET_APP_ID && LOGROCKET_ENABLED === "true") {
      LogRocket.init(LOGROCKET_APP_ID, {
        dom: {
          isEnabled: true,
          textSanitizer: false,
          inputSanitizer: true,
        },
        network: {
          isEnabled: true,
        },
        console: {
          isEnabled: true,
          shouldAggregateConsoleErrors: true,
        },
      });
      setupLogRocketReact(LogRocket);
    }
  }, []);

  useLogRocketEvents();
};

const useLogRocketEvents = () => {
  const { connectionStatus, address } = useWallet();
  const [connectedAddresses] = useLocalStorage<Array<string>>("connectedAddress", []);

  useEffect(() => {
    const isDifferentConnectedAddress =
      connectionStatus === "connected" && !!address && connectedAddresses.indexOf(address) === -1;

    if (isDifferentConnectedAddress) {
      LogRocket.startNewSession();
      LogRocket.identify(address);

      connectedAddresses.push(address);
    }
  }, [connectionStatus, address, connectedAddresses]);
};
