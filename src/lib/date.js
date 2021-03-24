import {
  compareDesc,
  differenceInMinutes,
  format,
  formatDistanceStrict,
} from 'date-fns';

import { sentencecase } from './';

const timezoneShortname = (date) => {
  let dateString = date + "",
    tz =
      dateString.match(/\(([^\)]+)\)$/) ||
      dateString.match(/([A-Z]+) [\d]{4}$/);

  if (tz) {
    // @ts-ignore
    tz = tz[1].match(/[A-Z]/g).join("");
  }

  if (!tz && /(GMT\W*\d{4})/.test(dateString)) {
    return RegExp.$1;
  }

  return tz;
};

export const createDate = (dateStr, timeStr = "00:00", tz = "+02:00") =>
  new Date(`${dateStr}T${timeStr}:00.000${tz}`);

const isDatetime = (str) => String(str).match(/:/g);

const now = new Date();

export const formatDate = (str, fromtime = null) => {
  if (fromtime) {
    return `${format(new Date(str), "d. MMMM y HH:mm")} ${timezoneShortname(
      now
    )}`;
  } else {
    return format(new Date(str), "d. MMM y");
  }
};

export const sortEvents = (a, b) => compareDesc(b.fromDatetime, a.fromDatetime);

const getDifferenceBetween = (fromDatetime, toDatetime) => {
  const soonMinutes = 3 * 60;
  const diffStart = differenceInMinutes(fromDatetime, now);
  const diffEnd = differenceInMinutes(toDatetime, now);
  if (diffStart < 0 && diffEnd >= 0) {
    return { diff: "now", diffStart, diffEnd };
  } else if (diffStart >= 0 && diffStart <= soonMinutes) {
    return { diff: "soon", diffStart, diffEnd };
  } else if (diffStart >= 0 && diffStart > soonMinutes) {
    return { diff: "future", diffStart, diffEnd };
  } else {
    return { diff: "past", diffStart, diffEnd };
  }
};

export const getDiff = (event) => {
  let { fromdate, fromtime, todate, totime } = event;
  fromtime = fromtime.trim() ? fromtime : "00:00";
  todate = todate.trim() ? todate : fromdate;
  totime = totime.trim() ? totime : "24:00";

  const fromDatetime = createDate(
    fromdate,
    fromtime,
    event.tz === "CEST" ? "+01:00" : "+02:00"
  );
  const formattedFromDatetime = formatDate(fromDatetime);

  const toDatetime = createDate(
    todate,
    totime,
    event.tz === "CEST" ? "+01:00" : "+02:00"
  );

  const formattedToDatetime = formatDate(toDatetime);

  const formatDistance = (datetime, datetimeStatus = null) => {
    const distance = sentencecase(
      formatDistanceStrict(datetime, now, {
        roundingMethod: "ceil",
        addSuffix: true,
      })
    );
    return datetimeStatus === "now" ? `Started ${distance}` : distance;
  };

  const diff2 = getDifferenceBetween(fromDatetime, toDatetime);

  const distance = formatDistance(fromDatetime, diff2.diff);

  return {
    fromDatetime,
    toDatetime,
    diff: {
      diff2,
      fromdate,
      fromtime,
      fromDatetime,
      todate,
      totime,
      toDatetime,
      formattedFromDatetime,
      formattedToDatetime,
      distance,
    },
  };
};
