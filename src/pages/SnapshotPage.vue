<script setup>
import { ref, computed } from "vue";
import { checkTicket, events, formatStreamUrl, pages } from "../lib";

const eventid = "ruumiantropoloogiad";
const event = computed(() =>
  events.value.find((event) => event.eventid === eventid)
);
const page = computed(() =>
  pages.value.find((page) => page.pageid === eventid)
);
const { status } = checkTicket(ref(null), event);
</script>

<template>
  <layout v-if="event && event.fientaid && status === 'CHECKED'">
    <vertical style="padding: 64px 32px 32px clamp(1.5rem, 5vw, 3rem)">
      <video-stream :src="formatStreamUrl(eventid)" style="width: 100%" />
      <snapshot :channel="eventid" />
      <p />
      <h1>{{ event?.title }}</h1>
      <p />
      <horizontal>
        <vertical v-html="event?.description" />
        <vertical v-html="page?.content" />
      </horizontal>
    </vertical>
    <template #top-left>
      <back-button :to="event?.pageid ? '/page/' + event.pageid : null" />
    </template>
    <template #top-center>
      <update-button />
    </template>
    <template #top-right>
      <theme-button />
    </template>
    <template #bottom-right>
      <a
        title="I have a ticket"
        v-if="event && event.fientaid && status === 'CHECKED'"
      >
        <IconCreditcard style="color: var(--ticket)" />
      </a>
    </template>
  </layout>
</template>

<style>
/* CSS here */
</style>
