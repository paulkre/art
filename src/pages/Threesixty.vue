<script setup>
import { ref } from "vue";
import { useVideoStream, config, replace } from "../lib";
const src = replace(config.streamUrl, { streamkey: "360" });
const { videoRef, status, width, height } = useVideoStream(src);
const muted = ref(true);
</script>

<template>
  <div>
    <video
      ref="videoRef"
      autoplay
      :muted="muted"
      :style="{
        opacity: status === 'nodata' ? 0 : 1,
        display: 'block',
        width: '100%',
        aspectRatio: width + ' / ' + height,
      }"
    />
    <IconUnmute v-if="muted" @click="muted = !muted" />
    <IconMute v-if="!muted" @click="muted = !muted" />
  </div>
</template>
