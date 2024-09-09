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
      unit: pluralize({ value: units.d, unit: "day" }),
    };
  }
  if (units.h !== undefined) {
    return {
      time: units.h,
      unit: pluralize({ value: units.h, unit: "hr" }),
    };
  }
  if (units.m !== undefined) {
    return {
      time: units.m,
      unit: pluralize({ value: units.m, unit: "min" }),
    };
  }
  if (units.s !== undefined) {
    return {
      time: units.s,
      unit: pluralize({ value: units.s, unit: "sec" }),
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
  let shortestTime: TimeUnits | undefined;
  let shortestSeconds = Infinity;

  for (const time of times) {
    if (time) {
      const seconds = convertToSeconds(time);
      if (seconds < shortestSeconds) {
        shortestSeconds = seconds;
        shortestTime = time;
      }
    }
  }

  return shortestTime;
};

const convertToSeconds = (timeObj: TimeUnits) => {
  let totalSeconds = 0;

  for (const unit in timeObj) {
    if (unit in TIME_UNIT_SECONDS) {
      const value = timeObj[unit as TimeUnit];
      if (value !== undefined) {
        totalSeconds += value * TIME_UNIT_SECONDS[unit as TimeUnit];
      }
    }
  }

  return totalSeconds;
};

const TIME_UNIT_SECONDS = {
  d: 24 * 60 * 60,
  h: 60 * 60,
  m: 60,
  s: 1,
};

type TimeUnit = keyof typeof TIME_UNIT_SECONDS;
type TimeUnits = Record<TimeUnit, number | undefined>;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
