<script setup>
import { ref, computed } from "vue";
import { checkTicket, events, formatStreamUrl } from "../lib";

const eventid = "ruumiantropoloogiad";
const eventid2 = "debug";
const event = computed(() =>
  events.value.find((event) => event.eventid === eventid)
);
const { status } = checkTicket(ref(null), event);
</script>

<template>
  <layout>
    <vertical style="padding: 64px 32px 32px clamp(1.5rem, 5vw, 3rem)">
      <video-stream :src="formatStreamUrl(eventid2)" style="width: 100%" />
      <snapshot :channel="eventid" />
      <h1>{{ event?.title }}</h1>
      <horizontal>
        <vertical v-html="event?.description" />
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
