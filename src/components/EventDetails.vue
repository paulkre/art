<script setup>
import { defineProps } from "vue";
defineProps({ event: { type: Object } });
</script>

<template>
  <Vertical>
    <h1>{{ event.title }}</h1>
    <div class="date" v-if="event.from">
      {{ event.from }} {{ event.to ? "→" : "" }} {{ event.to }}
    </div>
    <Vertical v-html="event.description" />
  </Vertical>
</template>

<style scoped>
.date {
  font-size: 0.9em;
  opacity: 0.8;
}
</style>
