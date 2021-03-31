<script setup>
import { defineProps, ref, computed } from "vue";
import { replaceYoutube } from "../lib";
const props = defineProps({
  event: { type: Object },
  description: { type: Boolean, default: true },
});
const page = computed(() => {
  let link = "";
  const isPage =
    props.event.pageid && props.event.pageid === props.event.streamkey;
  if (props.event.pageid) {
    link =
      props.event.pageid === props.event.streamkey
        ? props.event.pageid
        : props.event.eventid;
  } else {
    link = props.event.eventid;
  }
  return { isPage, link: `/${link}` };
});
const isOpen = ref(false);
</script>
<template>
  <Vertical style="gap: 4px">
    <div>
      <Vertical style="gap: 4px">
        <h3 style="cursor: pointer" @click="isOpen = !isOpen">
          <badge v-if="event.urgency === 'now'">live</badge>
          {{ event.title }}
        </h3>
        <EventDate :event="event" />
      </Vertical>
      <Flex style="gap: 16px; margin-top: 8px">
        <Button style="opacity: 0.8" v-if="!isOpen" @click="isOpen = true"
          >More info</Button
        >
        <Button style="opacity: 0.8" v-if="isOpen" @click="isOpen = false"
          >Less info</Button
        >
        <RouterLink
          v-if="!page.isPage"
          class="EventCard"
          :to="page.link"
          :style="{
            opacity:
              event.urgency === 'soon' || event.urgency === 'now' ? 1 : 0.25,
          }"
        >
          <Button
            :style="{
              background: event.urgency === 'now' ? 'red' : '',
              border: event.urgency === 'now' ? 'red' : '',
            }"
            >Go to event ➜</Button
          >
        </RouterLink>
      </Flex>
      <Vertical>
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
