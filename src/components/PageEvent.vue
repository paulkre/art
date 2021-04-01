<script setup>
import { computed, defineProps, ref } from "vue";
import { replaceYoutube } from "../lib";
const props = defineProps({
  event: { type: Object },
  description: { type: Boolean, default: true },
});
const isOpen = ref(false);
const pageLink = computed(() => {
  let link = "";
  if (props.event.pageid) {
    link =
      props.event.pageid === props.event.streamkey
        ? props.event.pageid
        : props.event.eventid;
  } else {
    link = props.event.eventid;
  }
  return `/${link}`;
});
</script>
<template>
  <Vertical
    style="gap: 4px"
    :style="{ opacity: event.urgency === 'past' ? 0.25 : 1 }"
  >
    <div>
      <Vertical style="gap: 4px">
        <RouterLink :to="pageLink">
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

      <Flex style="gap: 16px; margin-bottom: 8px">
        <Button v-if="!isOpen" @click="isOpen = true">More info</Button>
        <Button v-if="isOpen" @click="isOpen = false">Less info</Button>
        <RouterLink class="EventCard" :to="pageLink">
          <Button
            :style="{
              background: event.urgency.valuey === 'now' ? 'red' : '',
              border: event.urgency.value === 'now' ? 'red' : '',
            }"
          >
            Go to event ➜
          </Button>
        </RouterLink>
      </Flex>

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
