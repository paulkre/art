import { ref, computed } from "vue";
import ky from "ky";
import { compareDesc, differenceInMinutes } from "date-fns";
import { useNow } from "@vueuse/core";
import { formatMarkdown, config, formatStreamUrl, replace } from "../lib";

const strapi = ky.extend({
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
  event.streamurls = event.streamkey
    ? event.streamkey
        .split(",")
        .map((s) => s.trim())
        .map(formatStreamUrl)
    : [];
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

const sortEvents = (a, b) =>
  compareDesc(new Date(b.start_at), new Date(a.start_at));

export const filterUpcomingEvents = (event) => event.urgency !== "past";

export const filterPastEvents = (event) => event.urgency === "past";

export const strapiEvents = ref([]);
export const strapiFestivals = ref([]);
export const strapiPages = ref([]);

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
    .then((results) => (strapiFestivals.value = results.map(processFestivals)));

  strapi
    .get("pages")
    .json()
    .then((results) => (strapiPages.value = results));
};
