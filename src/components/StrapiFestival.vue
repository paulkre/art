<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
});

const festivalRoute = computed(() => `/strapi/${props.festival.slug}`);
</script>

<template>
  <router-link :to="festivalRoute">
    <vertical>
      <h2>{{ festival.title }}</h2>
    </vertical>
  </router-link>
</template>
