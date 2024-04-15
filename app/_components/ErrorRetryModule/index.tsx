import cn from "classnames";
import { Icon } from "../Icon";
import * as S from "./errorRetryModule.css";

export type ErrorRetryModuleProps = {
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  onRetry?: () => void;
};

export const ErrorRetryModule = ({ title, subtitle, isLoading, onRetry }: ErrorRetryModuleProps) => {
  return (
    <div className={cn(S.root)}>
      <div className={cn(S.texts)}>
        <h4 className={cn(S.title)}>{title || "Error"}</h4>
        <p className={cn(S.subtitle)}>{subtitle || "Couldn’t get the data."}</p>
      </div>
      <button className={cn(S.button)} onClick={onRetry} disabled={isLoading}>
        {!isLoading && <span>Retry</span>}
        <Icon className={cn(S.loader)} name="refresh" size={12} />
      </button>
    </div>
  );
};
