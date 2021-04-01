<script setup>
import { emitter, showMessages } from "../lib";
const onClick = () => emitter.emit("TOGGLE_USERS");
</script>

<template>
  <button-plain
    :style="{ animation: showMessages ? '' : 'bounce 1s infinite' }"
    @click="onClick"
  >
    <icon-close v-if="showMessages" />
    <icon-message v-if="!showMessages" />
  </button-plain>
</template>
