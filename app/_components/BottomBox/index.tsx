import type { ReactNode } from "react";

import * as S from "./bottombox.css";

export type BottomBoxProps = {
  children: ReactNode;
};

export const BottomBox = ({ children }: BottomBoxProps) => {
  return <div className={S.bottomBox}>{children}</div>;
};
