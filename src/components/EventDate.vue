<script setup>
import { defineProps } from "vue";
defineProps({ event: { type: Object } });
</script>

<template>
  <div class="event-date" v-if="event">
    {{ event.formattedDistance }}
    <span style="opacity: 0.6">
      {{ event.formattedFromDatetime }} → {{ event.formattedToDatetime }}
    </span>
  </div>
</template>

<style>
.event-date {
  font-size: 0.9em;
}
</style>
