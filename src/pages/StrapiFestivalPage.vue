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
      <vertical>
        {{ festival?.description_estonian }}
      </vertical>
      <h3>In English</h3>
      <vertical>
        {{ festival?.description_english }}
      </vertical>
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
