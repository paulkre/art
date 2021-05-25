<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
  image: { type: Boolean, default: false },
});

const eventRoute = computed(
  () => `/${props.festival.slug}/${props.event.slug}`
);

const imageUrl = computed(() => {
  return props.image && props.event?.images[0]
    ? props.event?.images[0].formats.medium.url
    : "";
});
</script>

<template>
  <vertical
    style="gap: 4px"
    :style="{ opacity: event?.urgency === 'past' ? 0.3 : 1 }"
  >
    <img v-if="imageUrl" :src="imageUrl" style="border-radius: 2px" />
    <div style="height: 8px" />
    <router-link :to="eventRoute">
      <badge v-if="event.urgency === 'now'">live</badge>
      <h2 v-html="event.title" />
    </router-link>
    <event-data :festival="festival" :event="event" />
  </vertical>
</template>
