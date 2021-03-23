<script setup>
import { events } from "../lib";
</script>

<template>
  <Vertical style="padding: 64px; gap: 32px">
    <EventCard
      v-for="(event, i) in events"
      :key="i"
      :event="event"
      :description="false"
      style="font-family: monospace"
    />
  </Vertical>
</template>
