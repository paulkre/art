<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useStorage, whenever } from "@vueuse/core";
import {
  strapiFestivals,
  strapiEvents,
  useTicket,
  sortNewerFirst,
} from "../lib";

const route = useRoute();

const festival = computed(() =>
  (strapiFestivals.value || []).find(
    (f) => f.slug === route.params.festival_slug
  )
);
const event = computed(() =>
  (strapiEvents.value || []).find((e) => e.slug === route.params.event_slug)
);
const festivalRoute = computed(() => `/strapi/${festival.value?.slug}`);

const { status } = useTicket(festival, event);
</script>

<template>
  <horizontal style="padding: 48px; grid-template-columns: 5fr 1fr">
    <vertical>
      <component
        v-for="(src, i) in event?.streamurls"
        :key="i"
        :is="event?.is_360 ? 'video-stream-three' : 'video-stream'"
        :src="src"
        :streamkey="event?.streamkeys?.[0]"
        style="width: 100%"
      />
      <h1>{{ event?.title }}</h1>
      <strapi-fienta :festival="festival" :event="event" />
      <vertical v-html="event?.description_estonian" />
      <h3 v-if="event?.description_english">In English</h3>
      <vertical v-html="event?.description_english" />
      <vertical v-if="festival?.events">
        <div style="height: 32px" />
        <h1>Other events</h1>
        <strapi-event
          v-for="(event, i) in festival?.events"
          :key="i"
          :festival="festival"
          :event="event"
        />
      </vertical>
    </vertical>
    <vertical> </vertical>
    <layout>
      <template #top-left>
        <back-button :to="festivalRoute" />
      </template>
      <template #top-right>
        <theme-button />
      </template>
    </layout>
  </horizontal>
</template>
