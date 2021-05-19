<script setup>
import { defineProps, computed } from "vue";
import { format } from "date-fns";
import { useTimeAgo } from "@vueuse/core";
import { timezoneShortname } from "../lib";

const props = defineProps({
  event: { type: Object },
});

const startedAt = props.event?.start_at
  ? useTimeAgo(new Date(props.event?.start_at))
  : "";

const formatDate = (str) =>
  `${format(new Date(str), "d. MMMM y HH:mm")} ${timezoneShortname(
    new Date()
  )}`;

// const eventRoute = computed(
//   () => `/strapi/${props.event.festival.slug}/${props.event.slug}`
// );

const eventRoute = computed(() => `/strapi/aaa`);
</script>
<template>
  <vertical
    style="gap: 4px"
    :style="{ opacity: event.urgency === 'past' ? 0.25 : 1 }"
  >
    <div>
      <vertical style="gap: 4px">
        <router-link :to="''">
          <h2 style="cursor: pointer">
            <badge v-if="event.urgency === 'now' && event.postponed !== 'TRUE'">
              live
            </badge>
            {{ event.title }}
          </h2>
        </router-link>
        <flex v-if="event.fientaid" style="color: var(--ticket)">
          <icon-ticket />
          It is a paid event
        </flex>
        <flex style="gap: 16px">
          {{ startedAt }}
          {{ formatDate(event.start_at) }} →
          {{ formatDate(event.end_at) }}
          <router-link
            v-if="event.page"
            :to="''"
            style="text-decoration: underline"
          >
            {{ event.page?.title }}
          </router-link>
        </flex>
      </vertical>
      <youtube :src="event.youtube" style="margin-bottom: 8px" />
      <flex style="gap: 16px; margin-bottom: 8px">
        <router-link class="event-card" :to="eventRoute">
          <button-medium
            :style="{
              background: event?.urgency?.value === 'now' ? 'red' : '',
              border: event?.urgency?.value === 'now' ? 'red' : '',
            }"
          >
            Go to event ➜
          </button-medium>
        </router-link>
      </flex>
      <vertical v-if="event && event.intro">{{ event.intro }} </vertical>
    </div>
  </vertical>
</template>

<style scoped>
.event-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
}
.event-card > .icon {
  transform: scale(1.4) translateY(0.4ch);
}
.event-content {
  display: grid;
  gap: 4px;
}
</style>
