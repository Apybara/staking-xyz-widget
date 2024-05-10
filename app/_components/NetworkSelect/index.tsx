import { useShell } from "../../_contexts/ShellContext";
import { type RootNetworkSelectProps, RootNetworkSelect } from "./RootNetworkSelect";

export type NetworkSelectProps = RootNetworkSelectProps;

export const NetworkSelect = (props: NetworkSelectProps) => {
  const { isOnMobileDevice } = useShell();

  return <RootNetworkSelect {...props} isOnMobileDevice={isOnMobileDevice} />;
};
