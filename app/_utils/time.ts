import moment from "moment";
import { fromUnixTime } from "date-fns";
import { pluralize } from ".";

export const getTimeDiffInSingleString = (time?: string | Date) => {
  if (!time) return undefined;
  const diff = getTimeDiffFromNow(time);

  if (diff.asMinutes() <= 1) {
    return `${diff.asSeconds()}s`;
  } else if (diff.asHours() <= 1) {
    return `${diff.asMinutes()}m`;
  } else if (diff.asHours() <= 24) {
    let result = `${Math.floor(diff.asHours())}h`;
    if (diff.minutes() > 0) {
      result += ` ${diff.asMinutes()}m`;
    }
    return result;
  } else {
    return `${diff.asDays()}d`;
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

  if (Math.abs(diff.asMinutes()) <= 1) {
    units.s = Math.floor(diff.seconds());
  } else if (Math.abs(diff.asHours()) <= 1) {
    units.m = Math.floor(Math.abs(diff.minutes()));
  } else if (Math.abs(diff.asHours()) <= 24) {
    units.h = Math.floor(Math.abs(diff.asHours()));
  } else {
    units.d = Math.floor(Math.abs(diff.asDays()));
  }

  return units;
};

export const getTimeUnitStrings = (units: TimeUnits) => {
  if (units.d !== undefined) {
    return {
      time: units.d,
      unit: pluralize(units.d, "day"),
    };
  }
  if (units.h !== undefined) {
    return {
      time: units.h,
      unit: pluralize(units.h, "hr"),
    };
  }
  if (units.m !== undefined) {
    return {
      time: units.m,
      unit: pluralize(units.m, "min"),
    };
  }
  if (units.s !== undefined) {
    return {
      time: units.s,
      unit: pluralize(units.s, "sec"),
    };
  }
};

const getTimeDiffFromNow = (time: string | Date) => {
  const now = moment();
  const endTime = moment(time);
  const diff = moment.duration(endTime.diff(now));

  return diff;
};

export const getTimeTillMidnight = () => {
  const midnightUTC = moment.utc().endOf("day").toDate();

  return getTimeDiffInSingleString(midnightUTC);
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

export const getUTCStringFromUnixTimeString = (time: string) => {
  return getFormattedUTCString(moment(time).toDate());
};

export const getShortestTime = (times: (TimeUnits | undefined)[]) => {
  const filteredTimes = times.filter((time) => time !== undefined) as TimeUnits[];

  if (!filteredTimes.length) {
    return undefined;
  }

  let shortestTimeObj = filteredTimes[0];
  let shortestTimeInSeconds = convertToSeconds(filteredTimes[0]);

  for (let i = 1; i < filteredTimes.length; i++) {
    const currentTimeInSeconds = convertToSeconds(filteredTimes[i]);
    if (currentTimeInSeconds < shortestTimeInSeconds) {
      shortestTimeInSeconds = currentTimeInSeconds;
      shortestTimeObj = filteredTimes[i];
    }
  }

  return shortestTimeObj;
};

const convertToSeconds = (timeObj: TimeUnits): number => {
  const SECONDS_IN_DAY = 86400;
  const SECONDS_IN_HOUR = 3600;
  const SECONDS_IN_MINUTE = 60;

  let totalSeconds = 0;
  if (timeObj.d !== undefined) {
    totalSeconds += timeObj.d * SECONDS_IN_DAY;
  }
  if (timeObj.h !== undefined) {
    totalSeconds += timeObj.h * SECONDS_IN_HOUR;
  }
  if (timeObj.m !== undefined) {
    totalSeconds += timeObj.m * SECONDS_IN_MINUTE;
  }
  if (timeObj.s !== undefined) {
    totalSeconds += timeObj.s;
  }
  return totalSeconds;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type TimeUnits = {
  d: number | undefined;
  h: number | undefined;
  m: number | undefined;
  s: number | undefined;
};
