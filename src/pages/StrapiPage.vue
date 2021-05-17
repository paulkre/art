<script setup>
import { strapiEvents, strapiFestivals } from "../lib";
</script>

<template>
  <horizontal style="padding: 48px">
    <vertical>
      <strapi-festival
        v-for="(festival, i) in strapiFestivals"
        :key="i"
        :festival="festival"
      />
    </vertical>
    <vertical>
      <strapi-event
        v-for="(event, i) in strapiEvents"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
    </vertical>
  </horizontal>
</template>
