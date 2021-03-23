import { ref } from 'vue';

import {
  differenceInHours,
  formatDistanceToNow,
  intervalToDuration,
  parseISO,
} from 'date-fns';

const timezone = "Europe/Tallinn";

// export const createDate = (str) => utcToZonedTime(str, timezone);

// export const createNow = () =>
//   format(utcToZonedTime(new Date(), timezone), "yyyy-MM-dd HH:mm:ss");

export const createDate = (dateStr, timeStr = "00:00:00.000", tz = "+02:00") =>
  new parseISO(`${dateStr}T${timeStr}${tz}`).toLocaleString("et", {
    timeZone: "Europe/Tallinn",
  });

export const createNow = () => createDate(new Date());

const isDatetime = (str) => String(str).match(/:/g);

export const getDiff = (event) => {
  const { fromdate, fromtime, todate, totime } = event;
  const fromDateTime = createDate(fromdate, fromtime);
  const toDateTime = createDate(todate, totime);
  const fromDiff = formatDistanceToNow(new Date());
  console.log(createDate(fromdate));
  return {
    fromdate,
    fromtime,
    fromDateTime,
    todate,
    totime,
    toDateTime,
    fromDiff,
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
