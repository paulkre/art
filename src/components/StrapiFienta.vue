<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  festival: { type: Object },
  event: { type: Object },
});
</script>

<template>
  <flex
    style="color: var(--ticket); gap: 16px"
    v-if="festival?.fienta_url || event?.fienta_url"
  >
    <icon-creditcard />
    <a v-if="festival.fienta_url" :href="festival.fienta_url" target="_black">
      Get the festival ticket
    </a>
    <a v-if="event.fienta_url" :href="event.fienta_url" target="_black">
      Get the event ticket
    </a>
  </flex>
</template>
