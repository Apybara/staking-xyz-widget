import moment from "moment";
import { fromUnixTime } from "date-fns";

export const getTimeDiffInSingleString = (time?: string | Date) => {
  if (!time) return undefined;
  const diff = getTimeDiffFromNow(time);

  if (diff.asMinutes() <= 1) {
    return `${diff.seconds()}s`;
  } else if (diff.asHours() <= 1) {
    return `${diff.minutes()}m`;
  } else if (diff.asHours() <= 24) {
    let result = `${Math.floor(diff.asHours())}h`;
    if (diff.minutes() > 0) {
      result += ` ${diff.minutes()}m`;
    }
    return result;
  } else {
    return `${diff.days()}d`;
  }
};

export const getTimeDiffInSingleUnits = (time?: string | Date) => {
  if (!time) return undefined;
  const diff = getTimeDiffFromNow(time);

  const units: TimeUnits = {
    d: undefined,
    h: undefined,
    m: undefined,
    s: undefined,
  };

  if (diff.asMinutes() <= 1) {
    units.s = Math.floor(diff.seconds());
  } else if (diff.asHours() <= 1) {
    units.m = Math.floor(diff.minutes());
  } else if (diff.asHours() <= 24) {
    units.h = Math.floor(diff.hours());
  } else {
    units.d = Math.floor(diff.asDays());
  }

  return units;
};

export const getTimeUnitStrings = (units: TimeUnits) => {
  if (units.d !== undefined) {
    return {
      time: units.d,
      unit: "days",
    };
  }
  if (units.h !== undefined) {
    return {
      time: units.h,
      unit: "hrs",
    };
  }
  if (units.m !== undefined) {
    return {
      time: units.m,
      unit: "mins",
    };
  }
  if (units.s !== undefined) {
    return {
      time: units.s,
      unit: "secs",
    };
  }
};

const getTimeDiffFromNow = (time: string | Date) => {
  const now = moment();
  const endTime = moment(time);
  const diff = moment.duration(endTime.diff(now));

  return diff;
};

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

type TimeUnits = {
  d: number | undefined;
  h: number | undefined;
  m: number | undefined;
  s: number | undefined;
};
