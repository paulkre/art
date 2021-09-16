<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  feature: { type: Object },
});

const featureRoute = computed(() =>
  props.feature?.slug ? `/${props.feature.slug}` : ""
);

const bgImageStyle = computed(() => {
  return props.feature?.images[0]
    ? {
        backgroundImage: `url(${props.feature?.images?.[0]?.formats?.small?.url})`,
      }
    : null;
});
</script>

<template>
  <router-link :to="featureRoute" style="max-width: 240px">
    <div
      style="background-size: cover; width: 100%; aspect-ratio: 1"
      :style="bgImageStyle"
    />
    <h2 style="margin-top: 8px" v-html="feature?.title" />
  </router-link>
</template>

<style scoped>
.strapi-feature {
  display: grid;
  background: var(--bglight);
  min-width: 280px;
  max-width: 280px;
  height: 280px;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* border-radius: 10000px; */
  padding: 16px;
}
.strapi-feature > * {
  width: 100%;
}
</style>
