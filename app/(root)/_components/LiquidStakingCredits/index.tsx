import { PONDO_URL, ZKSECURITY_URL } from "@/app/consts";

import * as S from "./liquidStakingCredits.css";

export const LiquidStakingCredits = () => (
  <div className={S.container}>
    <span className={S.text}>
      Developed by{" "}
      <a className={S.link} href={PONDO_URL} target="_blank" rel="noreferrer">
        Pondo.xyz
      </a>
    </span>
    <span className={S.text}>
      Audited by{" "}
      <a className={S.link} href={ZKSECURITY_URL} target="_blank" rel="noreferrer">
        zkSecurity
      </a>
    </span>
  </div>
);
