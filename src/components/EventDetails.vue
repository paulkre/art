<script setup>
import { defineProps, ref } from "vue";
import { replaceYoutube } from "../lib";
defineProps({
  event: { type: Object },
  description: { type: Boolean, default: true },
});
const isOpen = ref(false);
</script>
<template>
  <Vertical style="gap: 4px">
    <div>
      <Vertical style="gap: 4px">
        <h3 style="cursor: pointer" @click="isOpen = !isOpen">
          {{ event.title }}
        </h3>
        <EventDate :event="event" />
      </Vertical>
      <Vertical>
        <Vertical
          v-if="description && isOpen"
          class="EventIntro"
          v-html="event.description"
        />
      </Vertical>
    </div>

    <Flex style="gap: 16px; margin-top: 8px">
      <Button v-if="!isOpen" @click="isOpen = true">More info</Button>
      <Button v-if="isOpen" @click="isOpen = false">Less info</Button>
      <RouterLink
        class="EventCard"
        :to="event.pageid ? '/' + event.pageid : '/' + event.eventid"
      >
      </RouterLink>
    </Flex>
  </Vertical>
</template>

<style scoped>
.EventCard {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
}
.EventCard > .Icon {
  transform: scale(1.4) translateY(0.4ch);
}
.EventContent {
  display: grid;
  gap: 4px;
}
.EventIntro {
  word-wrap: break-word;
}
</style>
