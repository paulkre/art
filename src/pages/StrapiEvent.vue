<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useStorage, whenever } from "@vueuse/core";
import { strapiFestivals, strapiEvents, useTicket } from "../lib";

const r = useRoute();

const festival = computed(() =>
  (strapiFestivals.value || []).find((f) => f.slug === r.params.festival_slug)
);
const event = computed(() =>
  (strapiEvents.value || []).find((e) => e.slug === r.params.event_slug)
);
const festivalRoute = computed(() => `/strapi/${festival.value?.slug}`);

const { status } = useTicket(festival, event);
</script>

<template>
  <horizontal style="padding: 48px">
    <vertical>
      <h1>{{ status }}</h1>
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
        :is="event?.is_360 ? 'video-stream-three' : 'video-stream'"
        :src="src"
        :streamkey="event?.streamkeys?.[0]"
      />
      {{ event?.streamkeys }}
    </vertical>
    <layout>
      <template #top-left>
        <back-button :to="festivalRoute" />
      </template>
    </layout>
  </horizontal>
</template>
