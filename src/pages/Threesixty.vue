<script setup>
import { ref, onMounted } from "vue";

import { useVideoStream, config, replace } from "../lib";

const src = replace(config.streamUrl, { streamkey: "360" });
// const src =
//   "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";

//const { videoRef, status, width, height } = useVideoStream(src);

const muted = ref(true);
</script>

<template>
  <div style="padding: 32px">
    <Three>
      <ThreeVideoStream />
      <ThreeDots />
    </Three>
    <!-- <video ref="videoRef" autoplay :muted="muted" style="opacity: 0.5" />
    <IconUnmute v-if="muted" @click="muted = !muted" />
    <IconMute v-if="!muted" @click="muted = !muted" /> -->
  </div>
</template>
