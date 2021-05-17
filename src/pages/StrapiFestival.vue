<script setup>
import { toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { strapiFestivals } from "../lib";

const { params } = toRefs(useRoute());
const festival = computed(() =>
  strapiFestivals.value.find((f) => f.slug === params.value.festival_slug)
);
</script>
<template>
  <horizontal style="padding: 48px">
    <vertical>
      <h1>{{ festival?.title }}</h1>
      <vertical v-html="festival?.description_estonian" />
      <h3 v-if="festival?.description_english">In English</h3>
      <vertical v-html="festival?.description_english" />
    </vertical>
    <vertical>
      <strapi-event
        v-for="(event, i) in festival?.events"
        :key="i"
        :festival="festival"
        :event="event"
      />
    </vertical>
    <layout>
      <template #top-left>
        <back-button to="/strapi" />
      </template>
    </layout>
  </horizontal>
</template>
