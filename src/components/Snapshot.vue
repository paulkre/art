<script setup>
import { ref, computed, defineProps } from "vue";
import { emitter } from "../lib";

const props = defineProps({ channel: String });
const imgSrc = ref(null);

const onSnapshot = () => emitter.emit("SNAPSHOT_REQUEST");

emitter.on("SNAPSHOT_RESPONSE", (image) => {
  imgSrc.value = image;
});
</script>

<template>
  <Vertical>
    <Button @click="onSnapshot">Snapshot</Button>
    <img :src="imgSrc" style="width: 100%" />
  </Vertical>
</template>
