<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
  image: { type: Boolean, default: false },
});

const eventRoute = computed(
  () => `/strapi/${props.festival.slug}/${props.event.slug}`
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
    :style="{ opacity: event?.urgency === 'past' ? 0.5 : 1 }"
  >
    <img v-if="imageUrl" :src="imageUrl" />
    <div style="height: 8px" />
    <router-link :to="eventRoute">
      <badge v-if="event.urgency === 'now'">live</badge>
      <h2 v-html="event.title" />
    </router-link>
    <strapi-fienta :festival="festival" :event="event" />
  </vertical>
</template>
