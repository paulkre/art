<script setup>
import { toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import {
  strapiFestivals,
  sortNewerFirst,
  filterUpcomingEvents,
  filterPastEvents,
} from "../lib";

const { params } = toRefs(useRoute());
const festival = computed(() =>
  (strapiFestivals.value || []).find(
    (f) => f.slug === params.value.festival_slug
  )
);
</script>
<template>
  <horizontal style="padding: 48px">
    <!-- <pre>{{ festival?.events }}</pre> -->
    <vertical>
      <h1>{{ festival?.title }}</h1>
      <vertical v-html="festival?.description_estonian" />
      <h3 v-if="festival?.description_english">In English</h3>
      <vertical v-html="festival?.description_english" />
    </vertical>
    <vertical>
      <strapi-event
        v-for="(event, i) in festival?.events
          .filter(filterUpcomingEvents)
          .sort(sortNewerFirst)"
        :key="i"
        :festival="festival"
        :event="event"
      />
      <div style="height: 32px" />
      <h1 style="opacity: 0.6">Past events</h1>
      <strapi-event
        v-for="(event, i) in festival?.events
          .filter(filterPastEvents)
          .sort(sortNewerFirst)"
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
