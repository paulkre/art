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
  (strapiEvents.value || []).filter(filterUpcomingEvents).sort(sortNewerFirst)
);
</script>

<template>
  <users />
  <layout>
    <template #top-right>
      <theme-button />
    </template>
    <template #bottom-left>
      <users-button />
    </template>
  </layout>
</template>
