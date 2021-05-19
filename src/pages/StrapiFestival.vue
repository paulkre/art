<script setup>
import { toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import {
  strapiFestivals,
  filterUpcomingEvents,
  filterPastEvents,
  sortOlderFirst,
} from "../lib";

const { params } = toRefs(useRoute());
const festival = computed(() =>
  (strapiFestivals.value || []).find(
    (f) => f.slug === params.value.festival_slug
  )
);
const upcomingEvents = computed(() =>
  festival.value?.events.filter(filterUpcomingEvents)
);
const pastEvents = computed(() =>
  festival.value?.events.filter(filterPastEvents).sort(sortOlderFirst)
);

const imageUrl = computed(() => {
  return festival.value?.images[0]
    ? festival.value.images[0].formats.small.url
    : "";
});
</script>
<template>
  <horizontal
    style="padding: 48px; --cols: 300px 1fr 1fr"
    :style="{ '--cols': imageUrl ? '300px 1fr 1fr' : '1fr 1.5fr' }"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      style="aspect-ratio: 1; object-fit: cover; border-radius: 0px"
    />
    <vertical>
      <h1 style="font-size: 80px; line-height: 1em">
        {{ festival?.title }}
      </h1>
      <vertical v-html="festival?.description_estonian" />
      <vertical v-html="festival?.description_english" />
    </vertical>
    <vertical style="gap: 32px">
      <strapi-event
        v-for="(event, i) in upcomingEvents"
        :key="i"
        :festival="festival"
        :event="event"
      />
      <strapi-event
        v-for="(event, i) in pastEvents"
        :key="i"
        :festival="festival"
        :event="event"
      />
    </vertical>
    <users />
    <layout>
      <template #top-left>
        <back-button to="/strapi" />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </horizontal>
</template>
