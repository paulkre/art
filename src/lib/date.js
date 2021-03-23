//@ts-check
import {
  compareAsc,
  format,
  formatDistanceStrict,
  intervalToDuration,
  isPast,
} from 'date-fns';

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

export const formatDate = (str) => {
  if (isDatetime(str)) {
    return format(new Date(str), "d. MMMM y HH:mm");
  } else {
    return format(new Date(str), "d. MMM y");
  }
};

export const getDiff = (event) => {
  let { fromdate, fromtime, todate, totime } = event;
  fromtime = fromtime.trim() ? fromtime : "00:00";
  todate = todate.trim() ? todate : fromdate;
  totime = totime.trim() ? totime : fromtime;
  const fromDateTime = createDate(fromdate, fromtime);
  const toDateTime = createDate(todate, totime);
  const now = new Date();
  const fromDiff = formatDistanceStrict(fromDateTime, now, {
    roundingMethod: "ceil",
    addSuffix: true,
  });
  const fromDiff2 = intervalToDuration({
    start: fromDateTime,
    end: now,
  });
  const comp = compareAsc(fromDateTime, toDateTime);
  return {
    from: fromDateTime,
    to: toDateTime,
    diff: {
      fromdate,
      fromtime,
      todate,
      totime,
      fromDateTime,
      fromDateTime2: formatDate(fromDateTime),
      toDateTime,
      //toDateTime2: formatDate(toDateTime),
      fromDiff,
      fromDiff2,
      now,
      now2: formatDate(now),
      past: isPast(fromDateTime),
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
