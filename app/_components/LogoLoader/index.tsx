import cn from "classnames";
import * as S from "./logoLoader.css";

export type LogoLoaderProps = {
  size?: number;
  className?: string;
};

export const LogoLoader = ({ size = 14, className }: LogoLoaderProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={cn(S.main, className)}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0C3.11818 0 0 3.11818 0 7C0 10.8818 3.11818 14 7 14C10.8818 14 14 10.8818 14 7C14 3.11818 10.8818 0 7 0Z"
        fill="#333333"
      />
      <path
        d="M9.41824 7.76363L10.8182 7.31818C11.1364 7.1909 11.1364 6.80908 10.691 6.61818L9.29096 6.17272C8.52733 5.91818 7.9546 5.34545 7.70006 4.58181L7.2546 3.18181C7.19096 2.86363 6.80915 2.86363 6.68187 3.18181L6.17278 4.70909C5.91824 5.47272 5.34551 6.04545 4.58187 6.29999L3.18187 6.74545C2.86369 6.80909 2.86369 7.1909 3.18187 7.31818L4.70915 7.82727C5.47278 8.08181 6.04551 8.65454 6.30006 9.41818L6.74551 10.8182C6.80915 11.1364 7.19096 11.1364 7.31824 10.8182L7.82733 9.35454C8.08187 8.5909 8.6546 8.01818 9.41824 7.76363Z"
        fill="white"
      />
    </svg>
  );
};
