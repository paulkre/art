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

const snapshots = computed(() =>
  messages.value.filter((message) => message.type === "SNAPSHOT").reverse()
);

const imagesRef = useScrollToBottom();
</script>

<template>
  <Vertical>
    <Button @click="onSnapshot">Take Snapshot</Button>
    <Vertical v-if="snapshots.length" style="overflow: auto; height: 70vh">
      <div v-for="(snapshot, i) in snapshots" :key="i">
        <img :src="snapshot.value" style="width: 100%" />
      </div>
    </Vertical>
  </Vertical>
</template>
