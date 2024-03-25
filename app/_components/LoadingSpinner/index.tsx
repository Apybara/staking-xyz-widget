import cn from "classnames";
import * as S from "./loadingSpinner.css";

export type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

export const LoadingSpinner = ({ size = 14, className }: LoadingSpinnerProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={cn(S.main, className)}>
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        fill="currentColor"
        opacity=".25"
      />
      <path
        d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
        className={cn(S.spinner)}
        fill="currentColor"
        opacity=".5"
      />
    </svg>
  );
};
