<script setup>
import { defineProps, ref } from "vue";
import { useVideoStream } from "../lib";

const props = defineProps({ src: String });
const { videoRef, status, width, height } = useVideoStream(props.src);

const muted = ref(true);
</script>

<template>
  <div>
    <video
      ref="videoRef"
      autoplay
      loop
      :muted="muted"
      style="width: 640px"
      crossorigin="anonymous"
      playsinline
    />
    <Three>
      <ThreeVideoStream :video="videoRef" />
      <ThreeDots />
    </Three>
    <IconUnmute v-if="muted" @click="muted = !muted" />
    <IconMute v-if="!muted" @click="muted = !muted" />
  </div>
</template>
