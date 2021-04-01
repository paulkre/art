<script setup>
import { defineProps } from "vue";

defineProps({
  src: {
    default: "",
  },
  muted: {
    default: true,
  },
});
</script>

<template>
  <audio ref="audioRef" :src="src" :muted="muted" autoplay loop />
</template>
