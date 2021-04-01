<script setup>
import { ref, toRefs, computed, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCssVar } from "@vueuse/core";

import {
  replace,
  config,
  events,
  pages,
  activeTheme,
  checkTicket,
  users,
  ws,
  createMessage,
  safeJsonParse,
  admin,
  formatStreamUrl,
} from "../lib";

const { params } = toRefs(useRoute());
const router = useRouter();

const eventsWithPages = computed(() =>
  events.value.map((event) => {
    if (event.pageid) {
      event.page = pages.value.find((page) => page.pageid === event.pageid);
    }
    return event;
  })
);

const event = computed(() => {
  const currentEvent = eventsWithPages.value.find(
    (event) => event.eventid === params.value.eventid
  );
  if (currentEvent) {
    const pageEvents = events.value
      .filter(
        (event) =>
          event.pageid &&
          currentEvent.pageid &&
          event.pageid === currentEvent.pageid
      )
      .filter((event) => {
        return event.hidden !== "TRUE" && event.urgency !== "past";
      });
    currentEvent.events = pageEvents;
  }
  if (currentEvent && currentEvent.pageid && pages.value) {
    currentEvent.page = pages.value.find(
      (page) => page.pageid === currentEvent.pageid
    );
  }
  return currentEvent;
});

// const formatStreamUrl = (streamkey) => {
//   if (streamkey.endsWith("m3u8")) {
//     return streamkey;
//   } else {
//     return replace(config.streamUrl, { streamkey });
//   }
// };

const srcs = computed(() => {
  if (event.value && event.value.streamkeys) {
    return event.value.streamkeys.map(formatStreamUrl);
  } else if (params.value.eventid) {
    return [formatStreamUrl(params.value.eventid)];
  } else {
    return [];
  }
});
const channel = computed(() => params.value.eventid);

const eventAudienceWidth = useCssVar("--event-audience-width");
const eventAudienceColumns = useCssVar("--event-audience-columns");

const audienceColumns = computed(
  () => {
    let images = false;
    let chat = true;
    let snapshot = false;
    if (event.value) {
      if (event.value.chat === "FALSE") {
        chat = false;
      }
      if (event.value.images === "TRUE") {
        images = true;
      }
      // if (event.value.snapshot === "TRUE") {
      //   snapshot = true;
      // }
    }
    return { images, chat, snapshot };
  },
  { immediate: true }
);

watch(
  audienceColumns,
  () => {
    const columns = Object.values(audienceColumns.value).filter((col) => col);

    eventAudienceWidth.value = `${columns.length * 300}px`;
    eventAudienceColumns.value = columns.map((_) => "1fr").join(" ");
  },
  { immediate: true }
);

const route = useRoute();
const code = ref(route.query.code);
const sumittedCode = ref(null);

const { status, statusMessage } = checkTicket(sumittedCode, event);

const onCheck = () => {
  sumittedCode.value = code.value;
};

watch(status, () => {
  if (status.value === "CHECKED" && route.query.code) {
    router.push({ path: `/${params.value.eventid}` });
  }
});

const showUsers = ref(false);

ws.addEventListener("message", ({ data }) => {
  const message = safeJsonParse(data);
  if (message.type === "USERS") {
    showUsers.value = !showUsers.value;
  }
});

const onToggleUsers = () => {
  const outgoingMessage = createMessage({
    type: "USERS",
    channel: channel.value,
  });
  ws.send(outgoingMessage);
};
</script>

<template>
  <div>
    <div class="Event">
      <div class="EventContent">
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
            :streamkey="event && event.streamkeys[0]"
          />
        </div>
        <div v-else>
          <VideoStream
            :src="srcs[0]"
            :streamkey="event?.streamkeys[0] || params.eventid"
          />
        </div>
        <p />
        <h1 v-if="event?.title">{{ event.title }}</h1>
        <EventDate v-if="event?.fromdate" :event="event" />
        <Vertical v-if="event?.description" v-html="event.description" />
        <p />
        <h2 v-if="event?.events">Current and upcoming events</h2>

        <Vertical v-if="event?.events" style="gap: 32px">
          <EventEvent
            v-for="(event, i) in event.events"
            :key="i"
            :event="event"
          />
        </Vertical>
      </div>
    </div>
    <div
      v-if="
        audienceColumns.images ||
        audienceColumns.chat ||
        audienceColumns.snapshot
      "
      class="EventPanels"
    >
      <EventPanel
        v-if="audienceColumns.images"
        title="Audience"
        style="background: var(--bglight)"
      >
        <Images />
      </EventPanel>
      <EventPanel
        v-if="audienceColumns.chat"
        title="Chat"
        style="background: var(--bglighter)"
      >
        <Chat
          :channel="channel"
          :sendtype="event?.sendtype"
          :reveivetype="event?.reveivetype"
        />
      </EventPanel>
      <!-- <EventPanel
        v-if="audienceColumns.snapshot"
        title="Snapshot"
        style="background: var(--bglighter)"
      >
        <Snapshot :channel="channel" />
      </EventPanel> -->
    </div>

    <Overlay
      v-if="event && event.fientaid && status !== 'CHECKED'"
      :event="event"
      style="position: fixed; top: 0; right: 0; bottom: 0; left: 0"
    >
      <IconCreditcard style="transform: scale(3); color: var(--ticket)" />
      <p />
      <p />
      <h1>{{ event.title }}</h1>
      <div style="color: var(--ticket)">This event requires a ticket</div>
      <!-- <div>This event has not yet started but you can already enter.</div> -->
      <input
        v-model="code"
        placeholder="Type the ticket code"
        style="width: 200px"
      />
      <ButtonBig @click="onCheck">Enter to the event</ButtonBig>
      <p />
      <div v-if="status === 'USED'">
        This ticket has been used already. We only support using the ticket on a
        single device, sorry.
      </div>
      <a
        v-if="event.ticketUrl"
        :href="event.ticketUrl"
        style="border-bottom: 1px solid var(--fg)"
        target="_blank"
      >
        No tickets yet? Get them here
      </a>
      <p />
      <p v-if="config.phoneUrl">
        <span style="opacity: 0.5">Having problems with getting in? Call</span
        >&nbsp;
        <a :href="config.phoneUrl" style="border-bottom: 1px solid var(--fg)">{{
          config.phoneUrl.replace("tel:", "")
        }}</a>
      </p>
    </Overlay>

    <Users v-if="showUsers" />
    <layout>
      <template #top-left>
        <back-button :to="event?.pageid ? '/page/' + event.pageid : null" />
      </template>
      <template #top-center>
        <update-button />
      </template>
      <template #top-right>
        <theme-button />
      </template>
      <template #bottom-left>
        <users-button v-if="showUsers" />
      </template>
      <template #bottom-center>
        <Button style="--fg: orange" v-if="admin" @click="onToggleUsers">
          Admin: Toggle dots
        </Button>
      </template>
      <template #bottom-right>
        <a
          title="I have a ticket"
          v-if="event && event.fientaid && status === 'CHECKED'"
        >
          <IconCreditcard style="color: var(--ticket)" />
        </a>
      </template>
    </layout>
  </div>
</template>

<style scoped>
.Event {
  display: grid;
  grid-template-columns: 1fr var(--event-audience-width);
  min-height: 100vh;
  transition: 200ms;
}
@media (max-width: 800px) {
  .Event {
    grid-template-columns: 1fr;
  }
}
.EventContent {
  padding: 64px 32px 32px clamp(1.5rem, 5vw, 3rem);
  display: grid;
  grid-auto-rows: max-content;
  gap: 16px;
}
@media (max-width: 800px) {
  .EventContent {
    height: calc(50vh);
    overflow: auto;
  }
}
.EventPanels {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: var(--event-audience-width);
  display: grid;
  grid-template-columns: var(--event-audience-columns);
  transition: 200ms;
}
@media (max-width: 800px) {
  .EventPanels {
    position: static;
    width: inherit;
    grid-template-columns: 1fr;
  }
}
</style>
