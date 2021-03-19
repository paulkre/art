<script setup>
import { defineProps, ref, watch } from "vue";
import { useFullscreen } from "@vueuse/core";
import { useVideoStream } from "../lib";

const props = defineProps({ src: String });
const { videoRef, status, width, height } = useVideoStream(props.src);

const playerRef = ref(null);
const { isFullscreen, enter, exit, toggle } = useFullscreen(playerRef);

const muted = ref(true);

const statuses = {
  nodata: "Stream is not playing",
  loading: "Stream is loading",
  playing: "",
};

// Snapshot

const canvasRef = ref(null);
const context = ref(null);

const canvasSizeMultiplier = 1;

watch([videoRef, canvasRef, width, height], () => {
  if (videoRef.value && canvasRef.value) {
    context.value = canvasRef.value.getContext("2d");
  }
  if (width.value && height.value) {
    canvasRef.value.width = width.value * canvasSizeMultiplier;
    canvasRef.value.height = height.value * canvasSizeMultiplier;
  }
});

const onSnapshot = () => {
  context.value.drawImage(
    videoRef.value,
    0,
    0,
    width.value * canvasSizeMultiplier,
    height.value * canvasSizeMultiplier
  );
};
</script>

<template>
  <div style="position: relative; background: var(--bgdark)" ref="playerRef">
    <video
      class="debug"
      ref="videoRef"
      autoplay
      playsinline
      loop
      :muted="muted"
      crossorigin="anonymous"
      :style="{
        opacity: status === 'nodata' ? 0 : 1,
        display: 'block',
        width: '100%',
        aspectRatio: width + ' / ' + height,
      }"
    />
    <canvas class="debug" ref="canvasRef" style="display: block" />
    <slot :status="status">
      <Transition name="fade" appear>
        <div v-if="status !== 'playing'">
          <Overlay>
            {{ statuses[status] }}
          </Overlay>
        </div>
      </Transition>
    </slot>
    <transition name="fade">
      <div
        style="
          position: absolute;
          right: clamp(5px, 2vw, 24px);
          bottom: clamp(5px, 2vw, 24px);
          color: white;
          display: flex;
          align-items: center;
        "
      >
        <Small v-if="muted" @click="muted = !muted" style="cursor: pointer"
          >Turn on sound&ensp;</Small
        >
        <IconMute v-if="!muted" @click="muted = !muted" />
        <IconUnmute v-if="muted" @click="muted = !muted" />
        &emsp;
        <IconFullscreen v-if="!isFullscreen" @click="enter" />
        <IconUnfullscreen v-if="isFullscreen" @click="exit" />
      </div>
    </transition>
    <Button @click="onSnapshot">Snapshot</Button>
  </div>
</template>
