<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
});

const eventRoute = computed(
  () => `/strapi/${props.festival.slug}/${props.event.slug}`
);
</script>

<template>
  <router-link :to="eventRoute">
    <vertical>
      <h2>{{ event.title }}</h2>
    </vertical>
  </router-link>
</template>

<style scoped></style>
