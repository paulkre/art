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
        <RouterLink
          :to="event.pageid ? '/' + event.pageid : '/' + event.eventid"
        >
          <h2 style="cursor: pointer">
            <badge v-if="event.urgency === 'now'">live</badge>
            {{ event.title }}
          </h2>
        </RouterLink>
        <Flex v-if="event.fientaid" style="color: var(--ticket)">
          <IconCreditcard />
          It is a paid event
        </Flex>
        <EventDate :event="event" />
      </Vertical>
      <Youtube :src="event.youtube" style="margin-bottom: 8px" />
      <Vertical>
        <Vertical v-if="event && event.intro && !isOpen" class="EventIntro"
          >{{ event.intro }}
        </Vertical>
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
        <Button
          :style="{
            opacity:
              event.urgency === 'soon' || event.urgency === 'now' ? 1 : 0.25,
          }"
        >
          Go to event
        </Button>
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
