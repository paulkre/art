import { ref, computed, watch } from "vue";
import ky from "ky";
import { compareDesc, differenceInMinutes } from "date-fns";
import { useNow, useStorage } from "@vueuse/core";
import { formatMarkdown, config, formatStreamUrl, replace } from "../lib";

export const strapi = ky.extend({
  prefixUrl: config.strapiUrl,
});

const { now } = useNow(1000 * 60); // Update in each minue

const dateUrgency = (startAtDate, endAtDate) =>
  computed(() => {
    const soonMinutes = 3 * 60; // In 3 hours
    const started = differenceInMinutes(startAtDate, now.value);
    const ended = differenceInMinutes(endAtDate, now.value);
    if (started < 0 && ended >= 0) {
      return "now";
    } else if (started >= 0 && started <= soonMinutes) {
      return "soon";
    } else if (started >= 0 && started > soonMinutes) {
      return "future";
    } else {
      return "past";
    }
  });

const processEvents = (event) => {
  event.description_estonian = event.description_estonian
    ? formatMarkdown(event.description_estonian)
    : null;
  event.description_english = event.description_english
    ? formatMarkdown(event.description_english)
    : null;
  event.urgency = dateUrgency(new Date(event.start_at), new Date(event.end_at));
  event.streamkeys = event.streamkey
    ? event.streamkey.split(",").map((s) => s.trim())
    : [];
  event.streamurls = event.streamkeys.map(formatStreamUrl);

  if (event.festival?.fienta_id) {
    event.festival.fienta_url = replace(config.fientaTicketUrl, {
      fientaid: event.festival.fienta_id,
    });
  }

  if (event.fienta_id) {
    event.fienta_url = replace(config.fientaTicketUrl, {
      fientaid: event.fienta_id,
    });
  }
  return event;
};

const processFestivals = (festival) => {
  festival.description_estonian = festival.description_estonian
    ? formatMarkdown(festival.description_estonian)
    : null;
  festival.description_english = festival.description_english
    ? formatMarkdown(festival.description_english)
    : null;
  if (festival.fienta_id) {
    festival.fienta_url = replace(config.fientaTicketUrl, {
      fientaid: festival.fienta_id,
    });
  }
  return festival;
};

const processPages = (page) => {
  page.description_estonian = page.description_estonian
    ? formatMarkdown(page.description_estonian)
    : null;
  page.description_english = page.description_english
    ? formatMarkdown(page.description_english)
    : null;

  return page;
};

const sortEvents = (a, b) =>
  compareDesc(new Date(b.start_at), new Date(a.start_at));

export const filterUpcomingEvents = (event) => event.urgency !== "past";

export const filterPastEvents = (event) => event.urgency === "past";

export const strapiEvents = ref(null);
export const strapiFestivals = ref(null);
export const strapiPages = ref(null);

export const getStrapi = () => {
  strapi
    .get("events")
    .json()
    .then(
      (results) =>
        (strapiEvents.value = results.map(processEvents).sort(sortEvents))
    );

  strapi
    .get("festivals")
    .json()
    .then((results) => {
      strapiFestivals.value = results.map(processFestivals);
      strapiFestivals.value.push(strapiFestivals.value.shift());
    });

  strapi
    .get("pages")
    .json()
    .then((results) => (strapiPages.value = results.map(processPages)));
};

const tickets = useStorage("elektron_data", []);

export const useTicket = (festival, event) => {
  const status = ref("NO_DATA");
  watch(
    [festival, event, tickets],
    () => {
      if (event.value && festival.value) {
        if (event.value.fienta_id || festival.value.fienta_id) {
          status.value = "REQUIRES_TICKET";
          const eventTicket = tickets.value?.find(
            (t) => t.fientaid == event.value.fienta_id
          );
          const festivalTicket = tickets.value?.find(
            (t) => t.fientaid == festival.value?.fienta_id
          );
          if (festivalTicket) {
            status.value = "HAS_FESTIVAL_TICKET";
          }
          if (eventTicket) {
            status.value = "HAS_EVENT_TICKET";
          }
        } else {
          status.value = "FREE";
        }
      }
    },
    { immediate: true }
  );
  return { status };
};
