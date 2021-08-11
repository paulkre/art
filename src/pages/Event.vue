<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useStorage, whenever } from "@vueuse/core";
import {
  strapiFestivals,
  strapiEvents,
  filterUpcomingEvents,
  filterPastEvents,
  useTicket,
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
const festivalRoute = computed(() => `/${festival.value?.slug}`);

const { status } = useTicket(festival, event);

const hasTicketOrFree = computed(() =>
  ["HAS_FESTIVAL_TICKET", "HAS_EVENT_TICKET", "FREE"].includes(status.value)
);

const imageUrl = computed(() => {
  return event.value?.images.length
    ? event.value.images[0].formats.small.url
    : "";
});
</script>

<template>
  <horizontal
    :style="{
      '--cols': event && event.chat === false ? '1fr 0' : '3.5fr 350px',
      gap: 0,
    }"
  >
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
      <h1
        :style="{
          fontSize: '60px',
          lineHeight: '1.2em',
          paddingRight: event && event.chat === false ? '10vw' : '',
        }"
        v-html="event?.title"
      />
      <event-data :festival="festival" :event="event" />
      <div style="height: 32px" />
      <horizontal
        :style="{
          '--cols': event && event.chat === false ? '3fr 2fr' : '1fr 1fr',
        }"
      >
        <vertical>
          <img
            v-if="imageUrl"
            :src="imageUrl"
            style="border-radius: 2px; object-fit: cover; aspect-ratio: 16/9"
          />
          <vertical v-html="event?.description_estonian" />
          <!-- <div style="height: 16px" /> -->
          <h3 v-if="event?.description_estonian && event?.description_english">
            In English
          </h3>
          <vertical v-html="event?.description_english" />
        </vertical>
        <vertical v-if="festival?.events">
          <h3
            class="subtitle"
            v-if="festival?.events.filter(filterUpcomingEvents).length"
          >
            Related events
          </h3>
          <event-card
            v-for="(event, i) in festival?.events.filter(filterUpcomingEvents)"
            :key="i"
            :festival="festival"
            :event="event"
            style="opacity: 0.8"
          />
          <div style="height: 32px" />
          <h3 class="subtitle" v-if="festival?.events.filter(filterPastEvents)">
            Past events
          </h3>
          <event-card
            v-for="(event, i) in festival?.events.filter(filterPastEvents)"
            :key="i"
            :festival="festival"
            :event="event"
          />
        </vertical>
      </horizontal>
    </vertical>
    <div v-if="event && event.chat !== false">
      <event-panel
        :title="hasTicketOrFree ? 'Chat' : ''"
        style="
          background: var(--bglighter);
          position: sticky;
          top: 0;
          height: 100vh;
        "
      >
        <chat v-if="hasTicketOrFree" :channel="route.params.event_slug" />
      </event-panel>
    </div>
    <users />
    <layout>
      <template #top-left>
        <back-button :to="festivalRoute" />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button />
      </template>
    </layout>
  </horizontal>
</template>
