<script setup>
import { ref } from "vue";
import ky from "ky";
import { formatMarkdown } from "../lib";

const strapi = ky.extend({
  prefixUrl: "http://localhost:1337",
});

const processEvents = (event) => {
  if (event.description) {
    //event.description = formatMarkdown(event.description);
  }
  event.urgency = "now";
  return event;
};

const events = ref([]);

strapi
  .get("events")
  .json()
  .then((fetchedEvents) => (events.value = fetchedEvents.map(processEvents)));
</script>

<template>
  <div>
    <page-event v-for="(event, i) in events" :key="i" :event="event" />
  </div>
</template>
