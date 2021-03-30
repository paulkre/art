<script setup>
import { watchEffect, ref, toRefs, computed, defineProps } from "vue";
import {
  emitter,
  useScrollToBottom,
  createMessage,
  messages,
  userName,
  userId,
  ws,
  safeJsonParse,
} from "../lib";

const props = defineProps({ channel: String });
const { channel } = toRefs(props);
const imgSrc = ref(null);

const onSnapshot = () => emitter.emit("SNAPSHOT_REQUEST");
const images = ref([]);

emitter.on("SNAPSHOT_RESPONSE", (image) => {
  const outgoingMessage = createMessage({
    type: "SNAPSHOT",
    channel: channel.value,
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
    .slice(0, showAll.value ? Infinity : 8)
);

const imagesRef = useScrollToBottom();
</script>

<template>
  <vertical>
    <div
      style="
        width: 100%;
        height: 64px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      &nbsp;
      <Button v-if="!showAll" @click="showAll = true"
        >Show all snapshots</Button
      >
      <Button v-if="showAll" @click="showAll = false"
        >Hide all snapshots</Button
      >
    </div>
    <Button
      style="
        margin-top: calc(-64px - 8px);
        justify-self: center;
        width: 64px;
        height: 64px;
      "
    >
      <icon-camera @click="onSnapshot" style="transform: scale(1.25)" />
    </Button>
    <div
      v-if="snapshots.length"
      style="display: grid; grid-template-columns: repeat(8, 1fr)"
    >
      <div v-for="(snapshot, i) in snapshots" :key="i">
        <img :src="snapshot.value" style="width: 100%" />
      </div>
    </div>
    <div style="width: 100%; display: flex; justify-content: center"></div>
  </vertical>
</template>
