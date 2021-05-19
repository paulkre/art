<script setup>
import { defineProps, computed, toRefs } from "vue";
import { useStorage } from "@vueuse/core";
import { useTicket } from "../lib";

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
});

const tickets = useStorage("elektron_data", []);

const hasLocalTicket = computed(() =>
  tickets.value?.find(
    (ticket) =>
      (props.festival?.fienta_id &&
        ticket.fientaid == props.festival.fienta_id) ||
      (props.event?.fienta_id && ticket.fientaid == props.event.fienta_id)
  )
);

const needsTicket = computed(
  () => props.festival?.fienta_url || props.event?.fienta_url
);

const { festival, event } = toRefs(props);
const { status } = useTicket(festival, event);
</script>

<template>
  <div v-if="festival && event">
    <div if="status === 'FREE'" style="opacity: 0.3">Free event</div>
    <flex
      v-if="status !== 'FREE'"
      style="gap: 16px"
      :style="{
        color:
          status === 'HAS_FESTIVAL_TICKET' || status === 'HAS_EVENT_TICKET'
            ? '#2ECC40'
            : 'var(--ticket)',
      }"
    >
      <icon-creditcard />
      <div v-if="status === 'HAS_FESTIVAL_TICKET'">
        You have a festival ticket
      </div>
      <div v-if="status === 'HAS_EVENT_TICKET'">You have an event ticket</div>
      <a
        v-if="status === 'REQUIRES_TICKET' && festival?.fienta_url"
        :href="festival?.fienta_url"
        target="_black"
      >
        Get the festival ticket
      </a>
      <a
        v-if="status === 'REQUIRES_TICKET' && event?.fienta_url"
        :href="event?.fienta_url"
        target="_black"
      >
        Get the event ticket
      </a>
    </flex>
  </div>
</template>
