<script setup>
import { ref } from "vue";
import ky from "ky";
import { compareDesc } from "date-fns";
import { formatMarkdown, config } from "../lib";

const strapi = ky.extend({
  prefixUrl: config.strapiUrl,
});

const processEvents = (event) => {
  if (event.description) {
    event.description = formatMarkdown(event.description_estonian);
  }
  event.urgency = "now";
  return event;
};

const sortEvents = (a, b) =>
  compareDesc(new Date(b.start_at), new Date(a.start_at));

const events = ref([]);

strapi
  .get("events")
  .json()
  .then(
    (fetchedEvents) =>
      (events.value = fetchedEvents.map(processEvents).sort(sortEvents))
  );
</script>

<template>
  <div>
    <strapi-event v-for="(event, i) in events" :key="i" :event="event" />
  </div>
</template>
