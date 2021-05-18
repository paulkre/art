<script setup>
import {
  strapiEvents,
  strapiFestivals,
  strapiPages,
  filterUpcomingEvents,
  filterPastEvents,
  sortNewerFirst,
} from "../lib";
</script>

<template>
  <horizontal style="padding: 48px">
    <vertical>
      <h1 style="font-size: clamp(72px, 14vw, 96px)">eˉlektron</h1>
      <strapi-festival
        v-for="(festival, i) in strapiFestivals"
        :key="i"
        :festival="festival"
      />
      <div />
      <strapi-page v-for="(page, i) in strapiPages" :key="i" :page="page" />
    </vertical>
    <vertical style="gap: 32px">
      <div style="height: 8px" />
      <strapi-event
        v-for="(event, i) in (strapiEvents || [])
          .filter(filterUpcomingEvents)
          .sort(sortNewerFirst)"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
      <div style="height: 32px" />
      <h1>Past events</h1>
      <strapi-event
        v-for="(event, i) in (strapiEvents || [])
          .filter(filterPastEvents)
          .sort(sortNewerFirst)"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
    </vertical>
    <layout>
      <template #top-right>
        <theme-button />
      </template>
    </layout>
  </horizontal>
</template>
