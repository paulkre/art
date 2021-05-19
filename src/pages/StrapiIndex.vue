<script setup>
import { computed } from "vue";
import { sortNewerFirst } from "../lib";
import {
  strapiEvents,
  strapiFestivals,
  strapiPages,
  filterUpcomingEvents,
} from "../lib";

const upcomingEvents = computed(() =>
  (strapiEvents.value || []).filter(filterUpcomingEvents)
);
</script>

<template>
  <horizontal style="padding: 48px; --cols: auto auto 1fr; gap: 72px">
    <vertical>
      <logo />
      <div />
      <strapi-social />
      <div />
      <strapi-page v-for="(page, i) in strapiPages" :key="i" :page="page" />
    </vertical>
    <vertical>
      <horizontal style="--cols: 1fr 1fr; gap: 16px" v-if="strapiFestivals">
        <strapi-festival
          v-for="(festival, i) in strapiFestivals"
          :key="i"
          :festival="festival"
        />
      </horizontal>
    </vertical>
    <vertical style="gap: 32px" v-if="upcomingEvents.length">
      <strapi-event
        v-for="(event, i) in upcomingEvents"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
    </vertical>
    <users />
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
