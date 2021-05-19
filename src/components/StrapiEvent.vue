<script setup>
import { defineProps, computed } from "vue";

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
      <badge v-if="event.urgency === 'now'">live</badge>
      <h2 v-html="event.title" />
    </router-link>
    <strapi-fienta :festival="festival" :event="event" />
  </vertical>
</template>
