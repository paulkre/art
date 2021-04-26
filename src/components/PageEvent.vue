<script setup>
import { computed, defineProps, ref } from "vue";

const props = defineProps({
  event: { type: Object },
});

const isOpen = ref(false);

const pageLink = computed(() => {
  let link = props.event.id;
  // if (props.event.pageid) {
  //   link =
  //     props.event.pageid === props.event.streamkey
  //       ? props.event.pageid
  //       : props.event.eventid;
  // } else {
  //   link = props.event.eventid;
  // }
  return `/${link}`;
});
</script>
<template>
  <vertical
    style="gap: 4px"
    :style="{ opacity: event.urgency === 'past' ? 0.25 : 1 }"
  >
    <div>
      <vertical style="gap: 4px">
        <router-link :to="pageLink">
          <h2 style="cursor: pointer">
            <badge v-if="event.urgency === 'now'">live</badge>
            {{ event.title }}
          </h2>
        </router-link>
        <flex v-if="event.fientaid" style="color: var(--ticket)">
          <icon-creditcard />
          It is a paid event
        </flex>
        <event-date :event="event" />
      </vertical>
      <Youtube :src="event.youtube" style="margin-bottom: 8px" />

      <flex style="gap: 16px; margin-bottom: 8px">
        <button-medium v-if="!isOpen" @click="isOpen = true"
          >More info</button-medium
        >
        <button-medium v-if="isOpen" @click="isOpen = false"
          >Less info</button-medium
        >
        <router-link class="event-card" :to="pageLink">
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

      <!-- <vertical>
        <vertical v-if="event && event.intro && !isOpen" class="EventIntro"
          >{{ event.intro }}
        </vertical>
        <vertical
          v-if="description && isOpen"
          class="EventIntro"
          v-html="event.description"
        />
      </vertical> -->
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
.EventContent {
  display: grid;
  gap: 4px;
}
.EventIntro {
  word-wrap: break-word;
}
</style>
