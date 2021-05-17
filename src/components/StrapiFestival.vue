<script setup>
import { defineProps } from "vue";

const props = defineProps({
  festival: { type: Object },
});
</script>

<template>
  <vertical style="gap: 4px">
    <h1>{{ festival.title }}</h1>
  </vertical>
</template>

<style scoped></style>
