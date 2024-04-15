import { fromUnixTime } from "date-fns";

export const getFormattedUTCString = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate().toString().padStart(2, "0");

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} ${month}. ${day}. ${year}`;
};

export const getUTCStringFromUnixTimestamp = (timestamp: number) => {
  return getFormattedUTCString(fromUnixTime(timestamp));
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
