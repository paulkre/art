//@ts-check
import { ref } from "vue";

import {
  config,
  fetchSheet,
  getDiff,
  replace,
  formatText,
  sortEvents,
} from "./";

export const events = ref([]);

const processEvent = (event) => {
  if (event.description) {
    event.intro = `${event.description.split(/\n/)[0]}.`;
    event.description = formatText(event.description);
  }
  if (event.fromdate) {
    const {
      fromDatetime,
      toDatetime,
      formattedFromDatetime,
      formattedToDatetime,
      urgency,
      formattedDistance,
    } = getDiff(event);
    event = {
      ...event,
      fromDatetime,
      toDatetime,
      formattedFromDatetime,
      formattedToDatetime,
      urgency,
      formattedDistance,
    };
  }
  if (event.streamkey) {
    event.streamkeys = event.streamkey.split(",").map((key) => key.trim());
  } else {
    event.streamkeys = [event.eventid];
  }
  if (event.fientaid) {
    event.ticketUrl = replace(config.fientaTicketUrl, {
      fientaid: event.fientaid,
    });
  }
  return event;
};

export const loadEvents = () => {
  [
    config.eventsUrl1,
    config.eventsUrl2,
    ,
    config.eventsUrl3,
    ,
    config.eventsUrl4,
  ]
    .filter((url) => url)
    .forEach((url) =>
      fetchSheet(url).then(({ rows }) =>
        (events.value = [...events.value, ...rows.map(processEvent)])
          .filter((event) => event.hidden !== "TRUE")
          .sort(sortEvents)
      )
    );
};
