<script setup>
import { defineProps, computed } from "vue";
import { useStorage } from "@vueuse/core";

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
</script>

<template>
  {{ event.fienta_id }}
  <div v-if="!needsTicket" style="opacity: 0.3">Free event</div>
  <flex
    :style="{
      color: hasLocalTicket ? '#2ECC40' : 'var(--ticket)',
    }"
    v-if="needsTicket && event.urgency !== 'past'"
  >
    <icon-creditcard />
    <div v-if="hasLocalTicket">You have a ticket</div>
    <a
      v-if="!hasLocalTicket && festival?.fienta_url"
      :href="festival?.fienta_url"
      target="_black"
    >
      Get the festival ticket
    </a>
    <a
      v-if="!hasLocalTicket && event?.fienta_url"
      :href="event?.fienta_url"
      target="_black"
    >
      Get the event ticket
    </a>
  </flex>
</template>
