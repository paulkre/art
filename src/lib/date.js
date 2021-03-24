//@ts-check
import { ref } from 'vue';

import {
  compareDesc,
  differenceInHours,
  format,
  formatDistanceStrict,
  intervalToDuration,
} from 'date-fns';

const timezoneAbbr = (dateInput) => {
  let dateString = dateInput + "",
    tzAbbr =
      dateString.match(/\(([^\)]+)\)$/) ||
      dateString.match(/([A-Z]+) [\d]{4}$/);

  if (tzAbbr) {
    // @ts-ignore
    tzAbbr = tzAbbr[1].match(/[A-Z]/g).join("");
  }

  if (!tzAbbr && /(GMT\W*\d{4})/.test(dateString)) {
    return RegExp.$1;
  }

  return tzAbbr;
};

const timeZone = "Europe/Tallinn";

// export const createDate = (str) => utcToZonedTime(str, timezone);

// export const createNow = () =>
//   format(utcToZonedTime(new Date(), timezone), "yyyy-MM-dd HH:mm:ss");

/*
export const createDate = (dateStr, timeStr = "00:00:00.000", tz = "+00:00") =>
  new parseISO(`${dateStr}T${timeStr}${tz}`).toLocaleString("et", {
    timeZone: "Europe/Berlin",
  });*/

export const createDate = (dateStr, timeStr = "00:00", tz = "+02:00") =>
  new Date(`${dateStr}T${timeStr}:00.000${tz}`);

export const createDate2 = (dateStr, timeStr, tz = "+02:00") =>
  new Date(`${dateStr}T${timeStr}:00.000${tz}`).toLocaleString("et", {
    timeZone,
  });

// .toLocaleString("et", {
//   timeZone: "Europe/Tallinn",
// });

export const createNow = () => createDate(new Date());

const isDatetime = (str) => String(str).match(/:/g);

const now = new Date();

export const formatDate = (str) => {
  let dateStr;
  if (isDatetime(str)) {
    dateStr = format(new Date(str), "d. MMMM y HH:mm");
  } else {
    dateStr = format(new Date(str), "d. MMM y");
  }
  return `${dateStr} ${timezoneAbbr(now)}`;
};

export const sortEvents = (a, b) => compareDesc(b.fromDatetime, a.fromDatetime);

export const getDiff = (event) => {
  let { fromdate, fromtime, todate, totime } = event;
  fromtime = fromtime.trim() ? fromtime : "00:00";
  todate = todate.trim() ? todate : fromdate;
  totime = totime.trim() ? totime : "00:00";

  // const tz = now.getTimezoneOffset() / -60;
  // const timezone = `${tz < 0 ? "-" : "+"}${String(tz).padStart(2, "0")}:00`;
  // const timezoneName = `${
  //   Intl.DateTimeFormat().resolvedOptions().timeZone.split("/")[1]
  // } time`;
  // const tzAbbr = timezoneAbbr(now);

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

  const distance = formatDistanceStrict(fromDatetime, now, {
    roundingMethod: "ceil",
    addSuffix: true,
  });

  return {
    fromDatetime,
    toDatetime,
    diff: {
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

export const getDifference = (start, end = null) =>
  end ? getDifferenceBetween(start, end) : getDifferenceStart(start);

const getDifferenceBetween = (start, end) => {
  const diffStart = differenceInHours(start, createNow());
  const diffEnd = differenceInHours(createDate(end), createNow());
  if (isDatetime(start) && isDatetime(end)) {
    if (diffStart < 0 && diffEnd >= 0) {
      return { diff: "now", diffStart, diffEnd };
    } else if (diffStart >= 0 && diffStart <= 3) {
      return { diff: "soon", diffStart, diffEnd };
    } else if (diffStart >= 0 && diffStart > 3) {
      return { diff: "future", diffStart, diffEnd };
    } else {
      return { diff: "past", diffStart, diffEnd };
    }
  } else {
    // No time specified
    if (diffStart < 0) {
      return { diff: "past", diffStart, diffEnd };
    } else {
      return { diff: "future", diffStart, diffEnd };
    }
  }
};

const getDifferenceStart = (start) => {
  const diffStart = differenceInHours(start, createNow());
  if (isDatetime(start)) {
    if (diffStart < 0) {
      return { diff: "now", diffStart };
    } else if (diffStart >= 0) {
      return { diff: "soon", diffStart };
    } else if (diffStart >= 0) {
      return { diff: "future", diffStart };
    } else {
      return { diff: "past", diffStart };
    }
  } else {
    // No time specified
    if (diffStart < 0) {
      return { diff: "past", diffStart };
    } else {
      return { diff: "future", diffStart };
    }
  }
};

export const useCountdown = (initialDate) => {
  const duration = ref([]);

  const formatDuration = (duration) => {
    const durationMap = {
      months: "m",
      days: "d",
      hours: "h",
      minutes: "m",
      seconds: "s",
    };
    const formattedDuration = Object.entries(duration)
      .map(([key, value]) =>
        durationMap[key] ? `${value}${durationMap[key]}` : null
      )
      .filter((value) => value);
    return formattedDuration;
  };

  const updateDuration = () =>
    (duration.value = formatDuration(
      intervalToDuration({
        start: new Date(initialDate),
        end: new Date(),
      })
    ));

  updateDuration();
  setInterval(updateDuration, 1000);

  return duration;
};
