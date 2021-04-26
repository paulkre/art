<script setup>
import { defineProps } from "vue";
import "@justinribeiro/lite-youtube";

import { replaceYoutube } from "../lib";

defineProps({
  src: { type: String, default: "" },
});
</script>
<template>
  <div v-html="replaceYoutube(src)" />
</template>
