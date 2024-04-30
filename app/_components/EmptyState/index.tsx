import * as S from "./emptyState.css";

export type EmptyStateProps = {
  title?: string;
  subtitle?: string;
};

export const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <div className={S.root}>
      <h4 className={S.title}>{title || "No result"}</h4>
      <p className={S.subtitle}>{subtitle || "There is no record."}</p>
    </div>
  );
};
