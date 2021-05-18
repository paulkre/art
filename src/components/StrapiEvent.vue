<script setup>
import { defineProps, computed } from "vue";
import { format } from "date-fns";
import { useTimeAgo, whenever } from "@vueuse/core";
import { timezoneShortname } from "../lib";

const startedAt = props.event?.start_at
  ? useTimeAgo(new Date(props.event?.start_at))
  : "";

const formatDate = (str) =>
  `${format(new Date(str), "d. MMMM y HH:mm")} ${timezoneShortname(
    new Date()
  )}`;

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
});

const eventRoute = computed(
  () => `/strapi/${props.festival.slug}/${props.event.slug}`
);
</script>

<template>
  <vertical
    style="gap: 4px"
    :style="{ opacity: event?.urgency === 'past' ? 0.5 : 1 }"
  >
    <router-link :to="eventRoute">
      <h2>{{ event.title }}</h2>
    </router-link>
    <strapi-fienta :festival="festival" :event="event" />
    <flex style="opacity: 0.66">
      {{ startedAt }}
      {{ formatDate(event.start_at) }} →
      {{ formatDate(event.end_at) }}
    </flex>
  </vertical>
</template>

<style scoped></style>
