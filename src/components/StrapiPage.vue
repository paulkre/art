<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  page: { type: Object },
});

const pageRoute = computed(() => `/strapi/page/${props.page.slug}`);
</script>

<template>
  <router-link :to="pageRoute">
    <vertical>
      <h2>{{ page.title }}</h2>
    </vertical>
  </router-link>
</template>
