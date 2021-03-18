<script setup>
import { defineProps, useContext } from "vue";
defineProps({ event: Object, status: String });
</script>

<template>
  <Overlay style="position: fixed; top: 0; right: 0; bottom: 0; left: 0">
    <HStack>
      <div>
        <div style="height: 80vh; overflow: auto">
          <event-details :event="event" />
        </div>
      </div>
      <VStack>
        <IconStage style="transform: scale(4); color: #f2dc5d" />
        <p />
        <div>This event has not yet started but you can already enter.</div>
        <slot />
        <a
          v-if="event.tickets"
          :href="event.tickets"
          style="border-bottom: 1px solid var(--fg)"
        >
          No tickets yet? Get them here
        </a>
        <p style="opacity: 0.5">
          Having problems? Write us at help@elektron.art
        </p>
      </VStack>
    </HStack>
  </Overlay>
</template>
