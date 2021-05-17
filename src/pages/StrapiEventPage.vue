<script setup>
import { defineProps, toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { strapiFestivals, strapiEvents } from "../lib";

const { params } = toRefs(useRoute());
const festival = computed(() =>
  strapiFestivals.value.find((f) => f.slug === params.value.festival_slug)
);
const event = computed(() =>
  strapiEvents.value.find((e) => e.slug === params.value.event_slug)
);
const festivalRoute = computed(() => `/strapi/${festival.value?.slug}`);
</script>

<template>
  <horizontal style="padding: 48px">
    <vertical>
      <h1>{{ event?.title }}</h1>
      <strapi-fienta :festival="festival" :event="event" />
      <vertical v-html="event?.description_estonian" />
      <h3 v-if="event?.description_english">In English</h3>
      <vertical v-html="event?.description_english" />
      <strapi-event
        v-for="(event, i) in festival?.events"
        :key="i"
        :festival="festival"
        :event="event"
      />
    </vertical>
    <vertical>
      <component
        v-for="(src, i) in event?.streamurls"
        :key="i"
        :is="event?.is_360 === 'TRUE' ? 'video-stream-three' : 'video-stream'"
        :src="src"
        :streamkey="event?.streamkeys?.[0]"
      />
    </vertical>
    <layout>
      <template #top-left>
        <back-button :to="festivalRoute" />
      </template>
    </layout>
  </horizontal>
</template>
