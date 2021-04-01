<script setup>
import { emitter, showMessages, plausible } from "../lib";
const onClick = () => {
  if (!showMessages.value) {
    plausible.trackEvent("user_circlechat");
  }
  emitter.emit("TOGGLE_USERS");
};
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
