<script setup>
import { toRefs, computed, watch } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { useCssVar } from "@vueuse/core";

import { replace, config, events, pages, activeTheme } from "../lib/index.js";

const { params } = toRefs(useRoute());

const event = computed(() => {
  const e = events.value.find(
    (event) => event.eventid === params.value.eventid
  );
  if (e && e.pageid && pages.value) {
    e.page = pages.value.find((page) => page.pageid === e.pageid);
  }
  return e;
});

const formatStreamUrl = (streamkey) => {
  if (streamkey.endsWith("m3u8")) {
    return streamkey;
  } else {
    return replace(config.streamUrl, { streamkey });
  }
};

const srcs = computed(() => {
  if (event.value && event.value.streamkeys) {
    return event.value.streamkeys.map(formatStreamUrl);
  } else if (params.value.eventid) {
    return [formatStreamUrl(params.value.eventid)];
  } else {
    return [];
  }
});
const channel = computed(() => params.value.link);

const eventAudienceWidth = useCssVar("--event-audience-width");
const audienceColumns = computed(
  () => {
    let images = false;
    let chat = true;
    if (event.value) {
      if (event.value.chat === "FALSE") {
        chat = false;
      }
      if (event.value.images === "TRUE") {
        images = true;
      }
    }
    return { images, chat };
  },
  { immediate: true }
);

watch(
  audienceColumns,
  () => {
    const columns = Object.values(audienceColumns.value).filter((col) => col)
      .length;
    eventAudienceWidth.value = `${columns * 200}px`;
  },
  { immediate: true }
);
// watch(
//   event,
//   () => {
//     let columns = 1;
//     if (event.value) {
//       if (!event.value.chat || event.value.chat !== "FALSE") {
//         columns--;
//       }
//       if (event.value.audience) {
//         columns++;
//       }
//     }
//     console.log(columns, `${columns * 200}px`);
//     eventAudienceWidth.value = `${columns * 200}px`;
//   },
//   { immediate: true }
// );
</script>

<template>
  <div>
    <div class="Event">
      <div class="EventContent">
        <!-- @TODO Make VideoStream reactive -->
        <div v-if="event">
          <component
            v-for="(src, i) in srcs"
            :key="i"
            :is="
              event && event.is360 === 'TRUE'
                ? 'video-stream-three'
                : 'video-stream'
            "
            :src="src"
          />
        </div>
        <div v-else>
          <VideoStream :src="srcs[0]" />
        </div>
        <EventDetails v-if="event" :event="event" />
      </div>
    </div>
    <div class="EventAudience">
      <div
        v-if="audienceColumns.images"
        style="display: grid; background: red"
      />
      <Chat v-if="audienceColumns.chat" :channel="channel" />
    </div>
    <EventOverlay v-if="event && event.tickets" :event="event" />
    <ButtonBack />
  </div>
</template>

<style scoped>
.Event {
  display: grid;
  grid-template-columns: 1fr var(--event-audience-width);
  min-height: 100vh;
  transition: 200ms;
}
.Event > * {
  border: 2px solid blue;
}
@media (max-width: 800px) {
  .Event {
    grid-template-columns: 1fr;
  }
}
.EventContent {
  padding: 64px 32px 32px 32px;
  display: grid;
  gap: 16px;
}
.EventContent > *:last-child {
  height: calc(100vh - 64px - 64px);
  overflow: auto;
}
.EventAudience {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--event-audience-width);
  padding: 64px 32px 32px 32px;
  background: orangered; /*var(--bglight); */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  transition: 200ms;
}
@media (max-width: 800px) {
  .EventAudience {
    position: static;
    width: inherit;
    height: calc(100vh - 64px);
    padding-top: 32px;
  }
  .Event .EventDetails {
    height: calc(100vh - 64px);
  }
}
</style>
