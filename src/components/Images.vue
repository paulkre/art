<script setup>
import { computed, defineProps } from "vue";
import { useImages, users } from "../lib";

const props = defineProps({ channel: String });

const updatedUsers = computed(() =>
  users.value
    .map((user) => {
      return user;
    })
    .sort((a, b) => a.userId.localeCompare(b.userId))
);

const { onStart, onStop, videoRef, canvasRef, sendImageMessages } = useImages(
  props.channel
);

const usersWithImages = computed(() =>
  updatedUsers.value.filter((user) => user.value.image)
);
</script>

<template>
  <div>
    <Button @click="onStart">Start</Button>
    <Button @click="onStop">Stop</Button>
    <div>
      <video
        ref="videoRef"
        autoplay
        playsinline
        style="
          opacity: 0;
          pointer-events: none;
          width: 0px;
          height: 0px;
          line-height: 0;
        "
      />
      <canvas ref="canvasRef" style="display: none" />
    </div>
    <ImageGrid>
      <img
        v-for="(user, i) in usersWithImages"
        :src="user.value.image"
        :key="i"
        style="display: block; width: 100%; height: auto"
      />
    </ImageGrid>
  </div>
</template>
