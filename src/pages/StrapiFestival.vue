<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { strapiFestivals } from "../lib";

const props = defineProps({
  festival: { type: Object },
});

const { params } = toRefs(useRoute());
const festival = computed(() =>
  strapiFestivals.value.find((f) => f.slug === params.value.festival_slug)
);

//const eventRoute = computed(() => `/strapi/${festival.slug}/aa`);

const channel = computed(() => params.value.festival_slug);
</script>
<template>
  <horizontal style="padding: 48px">
    <vertical>
      <h1>{{ festival?.title }}</h1>
    </vertical>
    <vertical>
      <strapi-event
        v-for="(event, i) in festival.events"
        :key="i"
        :event="event"
      />
    </vertical>
  </horizontal>
</template>
