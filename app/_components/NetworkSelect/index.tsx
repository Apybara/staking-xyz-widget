import { useShell } from "../../_contexts/ShellContext";
import { type RootNetworkSelectProps, RootNetworkSelect } from "./RootNetworkSelect";
import { isAleoOnlyInstance } from "@/app/consts";

export type NetworkSelectProps = RootNetworkSelectProps;

export const NetworkSelect = (props: NetworkSelectProps) => {
  const { isOnMobileDevice } = useShell();

  return <RootNetworkSelect {...props} isOnMobileDevice={isOnMobileDevice} selectionDisabled={isAleoOnlyInstance} />;
};
