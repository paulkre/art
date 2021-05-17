<script setup>
import { strapiEvents, strapiFestivals, strapiPages } from "../lib";
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
      <strapi-page v-for="(page, i) in strapiPages" :key="i" :page="page" />
    </vertical>
    <vertical>
      <div style="height: 16px" />
      <strapi-event
        v-for="(event, i) in strapiEvents"
        :key="i"
        :event="event"
        :festival="event.festival"
      />
    </vertical>
  </horizontal>
</template>
