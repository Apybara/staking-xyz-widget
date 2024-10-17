"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import cn from "classnames";
import * as S from "./sendingTransactionsDialog.css";

export const TimeText = ({ timestamp }: { timestamp: number }) => {
  const [time, setTime] = useState(moment(timestamp).fromNow());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(moment(timestamp).fromNow());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return <p className={cn(S.itemSubtitle)}>{time}</p>;
};
