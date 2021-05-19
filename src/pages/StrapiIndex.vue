<script setup>
import { computed } from "vue";
import { sortNewerFirst } from "../lib";
import {
  strapiEvents,
  strapiFestivals,
  strapiPages,
  filterUpcomingEvents,
  filterPastEvents,
  sortOlderFirst,
} from "../lib";

const upcomingEvents = computed(() =>
  (strapiEvents.value || []).filter(filterUpcomingEvents).sort(sortNewerFirst)
);

const pastEvents = computed(() =>
  (strapiEvents.value || []).filter(filterPastEvents).sort(sortNewerFirst)
);
</script>

<template>
  <horizontal style="padding: 48px; --cols: 1fr 6fr 6fr">
    <vertical><logo /><strapi-social /></vertical>
    <vertical>
      <strapi-festival
        v-for="(festival, i) in strapiFestivals"
        :key="i"
        :festival="festival"
      />
      <div style="height: 8px" />
      <strapi-page v-for="(page, i) in strapiPages" :key="i" :page="page" />
    </vertical>
    <vertical style="gap: 32px">
      <strapi-event
        v-for="(event, i) in upcomingEvents"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
      <div style="height: 32px" />
      <h1 v-if="pastEvents">Past events</h1>
      <strapi-event
        v-for="(event, i) in pastEvents"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
    </vertical>
    <layout>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </horizontal>
</template>
