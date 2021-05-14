<script setup>
import { defineProps } from "vue";

const props = defineProps({ to: { type: String, default: "/" } });
</script>

<template>
  <router-link :to="to">
    <icon-left />
  </router-link>
</template>
