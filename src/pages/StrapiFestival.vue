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
</script>
<template>
  <horizontal style="padding: 48px">
    <!-- <pre>{{ festival?.events }}</pre> -->
    <vertical>
      <h1>{{ festival?.title }}</h1>
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
      <div v-if="upcomingEvents" style="height: 32px" />
      <h1 v-if="festival?.events" style="opacity: 0.6">Past events</h1>
      <strapi-event
        v-for="(event, i) in pastEvents"
        :key="i"
        :festival="festival"
        :event="event"
      />
    </vertical>
    <layout>
      <template #top-left>
        <back-button to="/strapi" />
      </template>
      <template #top-right>
        <theme-button />
      </template>
    </layout>
  </horizontal>
</template>
