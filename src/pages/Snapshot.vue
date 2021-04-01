<script setup>
import { watchEffect, ref, toRefs, computed, defineProps } from "vue";
import { differenceInSeconds } from "date-fns";
import { useStorage, useNow } from "@vueuse/core";

import {
  checkTicket,
  events,
  formatStreamUrl,
  pages,
  emitter,
  useScrollToBottom,
  createMessage,
  messages,
  userName,
  userId,
  ws,
  safeJsonParse,
} from "../lib";

const eventid = "ruumiantropoloogiad";

const event = computed(() =>
  events.value.find((event) => event.eventid === eventid)
);
const page = computed(() =>
  pages.value.find((page) => page.pageid === eventid)
);
const { status } = checkTicket(ref(null), event);
const imgSrc = ref(null);

const diff = 60;
const { now } = useNow();
const lastSnapshot = useStorage("elektron_snapshot");
const sinceLastSnapshot = computed(() =>
  differenceInSeconds(now.value, new Date(lastSnapshot.value))
);
const canSnapshot = computed(() => sinceLastSnapshot.value > diff);
const sinceStr = computed(() => {
  if (!lastSnapshot.value) {
    return "You can do it only after each 10 minute";
  }
  if (canSnapshot.value) {
    return "Capture the moment!";
  } else {
    return `Time to next snapshot ${60 - sinceLastSnapshot.value}`;
  }
});

const onSnapshot = () => {
  emitter.emit("SNAPSHOT_REQUEST");
  //lastSnapshot.value = new Date();
};
const images = ref([]);

emitter.on("SNAPSHOT_RESPONSE", (image) => {
  const outgoingMessage = createMessage({
    type: "SNAPSHOT",
    channel: eventid,
    userName: userName.value,
    userId: userId.value,
    value: image,
    store: true,
  });
  ws.send(outgoingMessage);
});

const showAll = ref(false);

const snapshots = computed(() =>
  messages.value
    .filter((message) => message.type === "SNAPSHOT")
    .reverse()
    .slice(0, showAll.value ? 72 : 6)
);

const activeSnapshot = ref(null);

//v-if="event && event.fientaid && status === 'CHECKED'
</script>

<template>
  <layout>
    <vertical
      style="padding: 64px 32px 32px clamp(1.5rem, 5vw, 3rem); gap: 32px"
    >
      <video-stream :src="formatStreamUrl(eventid)" style="width: 100%" />
      <div
        style="
          width: 100%;
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <Small style="max-width: 250px; opacity: 0.5">
          Choose your moment.<br />Save your presence.
        </Small>
        <ButtonBig v-if="!showAll" @click="showAll = true">
          Show all moments
        </ButtonBig>
        <ButtonBig v-if="showAll" @click="showAll = false">
          Hide all moments
        </ButtonBig>
      </div>
      <Button class="CameraButton">
        <icon-camera @click="onSnapshot" style="transform: scale(1.25)" />
      </Button>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          overflow: hidden;
          margin-top: -32px;
        "
        :style="{ height: showAll ? '' : '9vw' }"
      >
        <transition-group v-if="snapshots.length" name="slide">
          <div
            v-for="snapshot in snapshots"
            :key="snapshot.id"
            @click="activeSnapshot = snapshot.value"
            class="cursor: pointer"
          >
            <img :src="snapshot.value" style="width: 100%" />
          </div>
        </transition-group>
      </div>
      <h1>{{ event?.title }}</h1>
      <horizontal>
        <vertical v-html="event?.description" />
        <vertical v-html="page?.content" />
      </horizontal>
    </vertical>
    <transition name="fade">
      <Overlay
        v-if="activeSnapshot"
        style="position: fixed"
        @click="activeSnapshot = null"
      >
        <img :src="activeSnapshot" style="width: 100%" />
      </Overlay>
    </transition>
    <template #top-left>
      <back-button :to="event?.pageid ? '/page/' + event.pageid : null" />
    </template>
    <template #top-center>
      <update-button />
    </template>
    <template #top-right>
      <theme-button />
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
</template>

<style scoped>
.CameraButton {
  margin-top: -96px;
  justify-self: center;
  width: 64px;
  height: 64px;
}
@media (max-width: 600px) {
  .CameraButton {
    margin-top: 0;
    transform: translateY(-16px);
  }
}
</style>
