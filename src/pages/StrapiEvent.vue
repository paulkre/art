<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useStorage, whenever } from "@vueuse/core";
import { strapiFestivals, strapiEvents, useTicket } from "../lib";

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

const hasTicketOrFree = computed(() =>
  ["HAS_FESTIVAL_TICKET", "HAS_EVENT_TICKET", "FREE"].includes(status.value)
);
</script>

<template>
  <horizontal style="--cols: 3.5fr 1fr; gap: 0">
    <vertical style="padding: 48px">
      <div v-if="hasTicketOrFree" style="width: 100%">
        <component
          v-for="(src, i) in event?.streamurls"
          :key="i"
          :is="event?.is_360 ? 'video-stream-three' : 'video-stream'"
          :src="src"
          :streamkey="event?.streamkeys?.[0]"
        />
      </div>
      <div v-if="hasTicketOrFree" />
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
    <event-panel
      v-if="hasTicketOrFree"
      title="Chat"
      style="background: var(--bglighter)"
    >
      <chat :channel="route.params.event_slug" />
    </event-panel>
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
