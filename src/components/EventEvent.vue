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
  <vertical style="gap: 4px">
    <div>
      <vertical style="gap: 4px">
        <h3>
          <badge v-if="event.urgency === 'now' && event.postponed !== 'TRUE'"
            >live</badge
          >

          <badge
            style="background: var(--fgdark)"
            v-if="event.postponed === 'TRUE'"
          >
            postponed
          </badge>
          {{ event.title }}
        </h3>
        <event-date :event="event" />
      </vertical>
      <flex style="gap: 16px; margin: 16px 0 8px 0">
        <button-medium
          style="opacity: 0.8"
          v-if="!isOpen"
          @click="isOpen = true"
          >More info</button-medium
        >
        <button-medium
          style="opacity: 0.8"
          v-if="isOpen"
          @click="isOpen = false"
          >Less info</button-medium
        >
        <router-link v-if="!page.isPage" class="event-card" :to="page.link">
          <button-medium
            :style="{
              background: event.urgency.value === 'now' ? 'red' : '',
              border: event.urgency.value === 'now' ? 'red' : '',
            }"
          >
            Go to event ➜
          </button-medium>
        </router-link>
      </flex>
      <vertical>
        <vertical
          v-if="description && isOpen"
          class="EventIntro"
          v-html="event.description"
        />
      </vertical>
    </div>
  </vertical>
</template>
