<script setup>
import { toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import {
  strapiFestivals,
  filterUpcomingEvents,
  filterPastEvents,
  sortNewerFirst,
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
  festival.value?.events.filter(filterPastEvents).sort(sortNewerFirst)
);

const imageUrl = computed(() => {
  return festival.value?.images[0]
    ? festival.value.images[0].formats.small.url
    : "";
});
</script>
<template>
  <horizontal
    style="padding: 48px; --cols: auto 1fr 1fr"
    :style="{ '--cols': imageUrl ? 'auto 1fr 1fr' : '1fr 1.75fr' }"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      style="
        width: 150px;
        height: 150px;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 10000px;
        transform: translate(-10px, 25px) scale(1.75);
      "
    />
    <vertical>
      <h1 style="font-size: 80px; line-height: 1em" v-html="festival?.title" />
      <vertical v-html="festival?.description_estonian" />
      <vertical v-html="festival?.description_english" />
    </vertical>
    <vertical style="gap: 36px">
      <h3 class="subtitle">Past events</h3>
      <event-card
        v-for="(event, i) in pastEvents"
        :key="i"
        :festival="festival"
        :event="event"
      />
      <h3 class="subtitle">Upcoming events</h3>
      <event-card
        v-for="(event, i) in upcomingEvents"
        :key="i"
        :festival="festival"
        :event="event"
        :image="true"
      />
    </vertical>
    <users />
    <layout>
      <template #top-left>
        <back-button />
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
