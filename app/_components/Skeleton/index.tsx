import cn from "classnames";
import type { SkeletonProps as RawSkeletonProps } from "react-loading-skeleton";
import { default as RawSkeleton } from "react-loading-skeleton";
import { colors } from "../../../theme/theme.css";

export interface SkeletonProps extends RawSkeletonProps {
  isDarker?: boolean;
}

export const Skeleton = ({ className, isDarker = false, ...props }: SkeletonProps) => {
  return (
    <RawSkeleton
      baseColor={colors.black800}
      highlightColor={colors.black700}
      borderRadius={4}
      duration={1.25}
      inline={true}
      containerClassName={cn(className, "skeleton-container")}
      {...props}
    />
  );
};
